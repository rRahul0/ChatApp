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
        const senderSocketId = userSocketMap.get(message.sender);
        const receiverSocketId = userSocketMap.get(message.receiver);
        const createMessage = (await Message.create(message));
        let messageData = await createMessage.populate('sender', "id email firstName lastName image")
        messageData = await createMessage.populate('receiver', "id email firstName lastName image")
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('receive-message', messageData);
        }
        if (senderSocketId) {
            io.to(senderSocketId).emit('receive-message', messageData);
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
        socket.on('disconnect', () => disconnect(socket));
    });
}

export default setupSocket;