import Chat from '../models/Chat.js'
import Message from '../models/Message.js'
import { uploadFileToCloudinary } from '../utils/UploadFile.js'
import Cryptr from 'cryptr';
import { config } from 'dotenv';

config();
const cryptr = new Cryptr(`${process.env.CRYPTR_SECRET}`);

export const getMessages = async (req, res) => {
    try {
        const { chatId } = req.body
        if (!chatId)
            return res.status(400).json({ success: false, message: "not found" })
        const messages = await Chat.findById(chatId)
            .populate("messages")
            .sort({ timestamp: -1 });

        const decryptMsg = messages.messages.map((msg) => {
            // try {

                if (msg.messageType === "file") {
                    msg.fileUrl.url = cryptr.decrypt(msg.fileUrl.url);
                    msg.fileUrl.public_id = cryptr.decrypt(msg.fileUrl.public_id);
                } else {
                    msg.content = cryptr.decrypt(msg.content);

                }
            // } catch (e) {
            //     console.log(e)
            // }
            return msg;
        }
        )
        // console.log(decryptMsg)

        return res.status(200).json({ messages: decryptMsg, success: true, message: "messages fetched successfully" })
    } catch (error) {
        return res.status(500).json({ success: false, message: "something went wrong while fetching messages", e: error })
    }
}

export const uploadFile = async (req, res) => {
    try {
        // const { file, receiver } = req.body
        const file = req.files.file
        const { receiver } = req.body

        if (!receiver)
            return res.status(400).json({ success: false, message: "receiver not found" })
        if (!file)
            return res.status(400).json({ success: false, message: "file not found" })

        //upload in cloudinary
        const uploadedFile = await uploadFileToCloudinary(
            file.tempFilePath,
            process.env.FOLDER_NAME,
        );
        uploadedFile.secure_url = cryptr.encrypt(uploadedFile.secure_url);
        uploadedFile.public_id = cryptr.encrypt(uploadedFile.public_id);
        let message = await Message.create({
            sender: req.user.id,
            receiver,
            messageType: "file",
            fileUrl: {
                name: file.name,
                url: uploadedFile.secure_url,
                public_id: uploadedFile.public_id,
            },
            timestamp: new Date(),
        })
        message = await message.populate('receiver', "id email firstName lastName image")
        message = await message.populate('sender', "id email firstName lastName image")
        // console.log(message)
        return res.status(201).json({ success: true, data: message, message: "message sent successfully" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "something went wrong while sending message" })
    }
}
