import Message from '../models/Message.js'
import { uploadFileToCloudinary } from '../utils/UploadFile.js'

export const getMessages = async (req, res) => {
    try {
        const user1 = req.user.id
        const user2 = req.body.id

        if (!user1 || !user2)
            return res.status(400).json({ success: false, message: "user id not found" })
        const messages = await Message.find({
            $or: [
                { sender: user1, receiver: user2 },
                { sender: user2, receiver: user1 },
            ],
        }).sort({ timestamp: 1 })
        return res.status(200).json({messages , success: true, message: "messages fetched successfully" })
    } catch (error) {
        return res.status(500).json({ success: false, message: "something went wrong while fetching messages" })
    }
}

export const uploadFile = async (req, res) => {
    try {
        const { receiver } = req.body
        console.log(req.file)
        const file = req.file
        if (!file)
            return res.status(400).json({ success: false, message: "file not found" })
        //upload in cloudinary
        const uploadedFile = await uploadFileToCloudinary(
            file,
            process.env.FOLDER_NAME,
          );
        // const message = new Message({
        //     sender: req.user.id,
        //     receiver,
        //     message: uploadedFile.secure_url,
        //     timestamp: new Date(),
        //     type: "file"
        // })
        // await message.save()

        console.log(uploadedFile)
        return res.status(201).json({ success: true, message: "message sent successfully" })
    } catch (error) {
        return res.status(500).json({ success: false, message: "something went wrong while sending message" })
    }
}