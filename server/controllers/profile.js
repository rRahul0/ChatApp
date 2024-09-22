import User from "../models/User.js";
import { v2 as cloudinary } from 'cloudinary';
import { config } from "dotenv";
import { uploadFileToCloudinary } from "../utils/UploadFile.js";
config();

export const changeProfileImage = async (req, res) => {
    try {
        const { image } = req.files;
        const userId = req.user.id;
        const user = await User.findById(userId).select("image");
        if (user.image.public_id) {
            const options = { folder: process.env.FOLDER_NAME, resource_type : "raw"};
            cloudinary.uploader.destroy(user.image.public_id, options);
        }
        const result = await uploadFileToCloudinary(image.tempFilePath, process.env.FOLDER_NAME,);
        user.image.url = result.secure_url;
        user.image.public_id = result.public_id;
        await user.save();
        return res
            .status(200)
            .json({ image: { url: result.secure_url, public_id: result.public_id }, success: true, message: "Image upload successfull" });
    } catch (error) {
        console.log(error);
        return res.ststus(500).json({ success: false, message: error.message })
    }
}

export const changeName = async (req, res) => {
    try {
        const { firstName, lastName } = req.body;
        const userId = req.user.id;
        const user = await User.findByIdAndUpdate(userId, { firstName, lastName }, { new: true }).select("firstName lastName");
        return res.status(200).json({ user, success: true, message: "Name updated Successfully!" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}