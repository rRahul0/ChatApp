import User from "../models/User.js";
import Message from '../models/Message.js'
import mongoose from 'mongoose';

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

        // Aggregation pipeline to fetch contacts for direct messaging
        const contacts = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { sender: userObjectId },
                        { receiver: userObjectId }
                    ]
                }
            },
            {
                $sort: { timestamp: -1 }
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ["$sender", userObjectId] },
                            then: "$receiver",
                            else: "$sender"
                        }
                    },
                    lastMessageTime: { $first: "$timestamp" },
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "contactInfo"
                }
            },
            {
                $unwind: "$contactInfo",
            },
            {
                $project: {
                    _id: 1,
                    lastMessageTime: 1,
                    email: "$contactInfo.email",
                    firstName: "$contactInfo.firstName",
                    lastName: "$contactInfo.lastName",
                    image: "$contactInfo.image",
                }
            },
            {
                $sort: { lastMessageTime: -1 }
            }
        ]);

        return res.status(200).json({ success: true, users: contacts });
    } catch (error) {
        console.error("Error fetching contacts:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
