import { createChannel } from './controllers/channel.js';
import Channel from './models/Channel.js';
import Message from './models/Message.js';
import { Server } from 'socket.io';


const setupSocket = (server) => {
    const io = new Server(
        server, {
        cors: {
            origin: process.env.FRONTEND_URL,
            methods: ['GET', 'POST'],
            credentials: true
        }
    })

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
            // console.log(messageData)
        } else {
            senderSocketId = userSocketMap.get(message.sender);
            receiverSocketId = userSocketMap.get(message.receiver);
            createMessage = (await Message.create(message));
            messageData = await createMessage.populate('sender', "id email firstName lastName image")
            messageData = await createMessage.populate('receiver', "id email firstName lastName image")
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
        // channelData = await createChannel.populate('admin', "id email firstName lastName image")
        // console.log(channelData)
        const adminSocketId = userSocketMap.get(channelData.admin._id);
        if (adminSocketId) {
            io.to(adminSocketId).emit('receive-channel', channelData);
        }
        for (const member of channelData.members) {
            const memberSocketId = userSocketMap.get(member._id);
            if (memberSocketId) {
                io.to(memberSocketId).emit('receive-channel', channelData);
            }
        }
    }
    const sendChannelMessage = async (message) => {
        const { messageType, sender, channelId, content } = message
        let createMessage
        if (messageType !== "file") {
            createMessage = (await Message.create(message)); // This section may be updated
        } else{
            createMessage = message
        }
            // console.log(message)
        const messageData = await Message.findById(createMessage._id).populate('sender', "id email firstName lastName image").exec();
        // console.log(messageData)
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
            // console.log(`user connected ${userId} with socket Id: ${socket.id}`)
        } else {
            // console.log(`user id  not provided during connection`)
        }
        socket.on('send-message', sendMessage);
        socket.on('create-channel', createChannel);
        socket.on('send-channel-message', sendChannelMessage);
        socket.on('disconnect', () => disconnect(socket));
    });
}

export default setupSocket;