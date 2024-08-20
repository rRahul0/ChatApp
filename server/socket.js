import Channel from './models/Channel.js';
import Message from './models/Message.js';
import Chat from './models/Chat.js';
import { Server } from 'socket.io';
import User from './models/User.js';
import Cryptr from 'cryptr';
import { config } from 'dotenv';

config();
const setupSocket = (server) => {
    const io = new Server(
        server, {
        cors: {
            origin: process.env.FRONTEND_URL,
            methods: ['GET', 'POST'],
            credentials: true
        }
    })
    const cryptr = new Cryptr(`${process.env.CRYPTR_SECRET}`);

    const userSocketMap = new Map();
    const disconnect = (socket) => {
        // console.log(`user disconnected with socket Id: ${socket.id}`)
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId);
                break;
            }
        }
    }
    const sendMessage = async (message) => {
        let createMessage, messageData, senderSocketId, receiverSocketId;
        if (message.messageType === "file") {
            senderSocketId = userSocketMap.get(message.sender._id);
            receiverSocketId = userSocketMap.get(message.receiver._id);
            messageData = message;
            messageData.fileUrl.url = cryptr.decrypt(message.fileUrl.url);
            messageData.fileUrl.public_id = cryptr.decrypt(message.fileUrl.public_id);
            // console.log(messageData)
            const chat = await Chat.findOne({
                $or: [
                    { user1: message.sender._id, user2: message.receiver._id },
                    { user1: message.receiver._id, user2: message.sender._id }
                ]
            });
            if (chat) {
                const newChat = await Chat.findByIdAndUpdate(chat._id, { $push: { messages: messageData._id } });
                await User.findByIdAndUpdate(message.sender._id, { $push: { chats: newChat._id } });
                await User.findByIdAndUpdate(message.receiver._id, { $push: { chats: newChat._id } });
            } else {
                await Chat.create({
                    user1: message.sender._id,
                    user2: message.receiver._id,
                    messages: [messageData._id]
                })
            }
        } else {
            senderSocketId = userSocketMap.get(message.sender);
            receiverSocketId = userSocketMap.get(message.receiver);
            message.content = cryptr.encrypt(message.content);

            createMessage = (await Message.create(message));
            // console.log(createMessage)
            createMessage.content = cryptr.decrypt(createMessage.content);

            messageData = await createMessage.populate('sender', "id email firstName lastName image")
            messageData = await createMessage.populate('receiver', "id email firstName lastName image")
            const chat = await Chat.findOne({
                $or: [
                    { user1: message.sender, user2: message.receiver },
                    { user1: message.receiver, user2: message.sender }
                ]
            });
            if (chat) {
                const newChat = await Chat.findByIdAndUpdate(chat._id, { $push: { messages: createMessage._id } });
                await User.findByIdAndUpdate(message.sender, { $push: { chats: newChat._id } });
                await User.findByIdAndUpdate(message.receiver, { $push: { chats: newChat._id } });
            } else {
                await Chat.create({
                    user1: message.sender,
                    user2: message.receiver,
                    messages: [createMessage._id]
                })
            }

            // console.log(messageData)
        }

        if (receiverSocketId) {
            io.to(receiverSocketId).emit('receive-message', messageData);
        }
        if (senderSocketId) {
            io.to(senderSocketId).emit('receive-message', messageData);
        }
    }

    const createChannel = async (data) => {
        const { channelName, members, admin, token } = data;

        const createChannel = (await Channel.create({
            name: channelName,
            members,
            admin,
            image: {
                url: `https://api.dicebear.com/5.x/initials/svg?seed=${channelName}`,
                public_id: null
            }
        }));

        let channelData = await createChannel.populate('members admin')
        const adminSocketId = userSocketMap.get(channelData.admin._id.toString());

        await User.findByIdAndUpdate(channelData.admin._id, { $push: { channels: createChannel._id } });
        if (adminSocketId) {
            io.to(adminSocketId).emit('receive-channel', channelData);
        }
        for (const member of channelData.members) {
            const memberSocketId = userSocketMap.get(member._id.toString());
            await User.findByIdAndUpdate(member._id, { $push: { channels: createChannel._id } });
            if (memberSocketId) {
                io.to(memberSocketId).emit('receive-channel', channelData);
            }
        }
    }
    const sendChannelMessage = async (message) => {
        const { messageType, sender, channelId } = message
        let { content } = message;

        let createMessage
        if (messageType !== "file") {
            content = cryptr.encrypt(content);
            message.content = content;
            createMessage = (await Message.create(message)); // This section may be updated
        } else {
            createMessage = message;
        }
        const messageData = await Message.findById(createMessage._id).populate('sender', "id email firstName lastName image").exec();
        // console.log(messageData, "54") 
        if (messageData.content) messageData.content = cryptr.decrypt(messageData.content);
        if (messageData.fileUrl) {
            messageData.fileUrl.url = cryptr.decrypt(messageData.fileUrl.url);
            messageData.fileUrl.public_id = cryptr.decrypt(messageData.fileUrl.public_id);
        }

        await Channel.findByIdAndUpdate(channelId, { $push: { messages: createMessage._id } });
        const channel = await Channel.findById(channelId).populate('members')
        const finalData = { ...messageData._doc, channelId: channel._id }

        if (channel && channel.members) {
            channel.members.forEach(member => {
                const memberSocketId = userSocketMap.get(member._id.toString());
                if (memberSocketId) {
                    io.to(memberSocketId).emit('receive-channel-message', finalData);
                }
            })
            const adminSocketId = userSocketMap.get(channel.admin._id.toString());
            if (adminSocketId) {
                io.to(adminSocketId).emit('receive-channel-message', finalData);
            }
        }
    }
    io.on('connection', (socket) => {
        const userId = socket.handshake.query.userId;
        if (userId) {
            userSocketMap.set(userId, socket.id);
        }
        socket.on('send-message', sendMessage);
        socket.on('create-channel', createChannel);
        socket.on('send-channel-message', sendChannelMessage);
        socket.on('is_user_online', (userId, contactId) => {
            const contactSocketId = userSocketMap.get(contactId)
            const userSocketId = userSocketMap.get(userId)
            if (contactSocketId!=undefined) {
                io.to(userSocketId).emit('user-online', true)
            } else {
                io.to(userSocketId).emit('user-online', false)
            }
        });
        socket.on('disconnect', () => disconnect(socket));
    });
}

export default setupSocket;