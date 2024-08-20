import User from "../models/User.js";
import Message from '../models/Message.js'
import mongoose from 'mongoose';
import Chat from '../models/Chat.js';

export const searchContacts = async (req, res) => {
    try {
        const { search } = req.body;
 
        if (!search) return res.status(400).send("Please enter username");
 
        const sanitizedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        const regex = new RegExp(sanitizedSearch, 'i');
        const user = await User.find({
            $and: [{ _id: { $ne: req.user.id } },
            { $or: [{ firstName: regex }, { lastName: regex }, { email: regex }] }
            ]
        });
        return res.status(200).json({ user, success: true, message: "Contacts found" });
    } catch (error) {
        return res.status(400).send({ success: false, message: error.message });
    }
}
export const getContactsDM = async (req, res) => {
    try {
        const userId = req.user.id;
        // Ensure userId is a valid ObjectId
        const userObjectId = new mongoose.Types.ObjectId(userId);

        const contacts = await Chat.find({
            $or: [
                { user1: userId },
                { user2: userObjectId }
            ]
        })
            .sort({ updatedAt: -1 })
            .populate("user1 user2", "email firstName lastName image")
            .exec();
        const result = contacts.map((contact) => {
            const user = contact.user1._id.toString() === userId ? contact.user2 : contact.user1;
            return {
                _id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                image: { ...user.image },
                chatId: contact._id,
                updatedAt: contact.updatedAt
            };
        });
        // console.log(result)

        return res.status(200).json({ success: true, users: result });
    } catch (error) {
        console.error("Error fetching contacts:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getAllContacts = async (req, res) => {
    try {
        const users = await User.find(
            { _id: { $ne: req.user.id } },
            "firstName lastName _id email"
        );
        // console.log("Users", users)
        const contacts = users.map((user) => ({
            label: user.firstName ? `${user.firstName} ${user.lastName}` : user.email,
            value: user._id
        }));
        // console.log("Contacts", contacts)
        return res.status(200).json({ contacts, success: true, message: "Here are all contacts" })
    } catch (error) {

    }
}