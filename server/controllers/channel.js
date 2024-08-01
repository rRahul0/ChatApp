import User from "../models/User.js";
import Channel from '../models/Channel.js'

export const createChannel = async (req, res) => {
    try {
        const { name, members } = req.body;
        const userId = req.user.id;
        const admin = await User.findById(userId)
        if (!admin)
            return res.status(400).send("Please select Admin");
        const validMembers = await User.find({ _id: { $in: members } })
        if (validMembers.length !== members.length) {
            return res.status(400).send("Some members are not valid users.")
        }

        const newChannel = new Channel({
            name,
            members,
            admin,
        })
        await newChannel.save()
        return res.status(201).json({ channel: newChannel, success: true, message: "channel created" })
    } catch (error) {
        return res.status(201).json({ success: false, message: "channel can't created" })
    }
}

export const getUserChannels = async (req, res) => {
    try {
        const userId = req.user.id;
        const channels = await Channel.find({
            $or: [{ admin: userId }, { members: userId }]
        }).sort({ updatdAt: -1 })//.populate('members', 'name email')
        return res.status(200).json({ channels, success: true, message: "Channels fetched successfully" })
    } catch (error) {
        return res.status(400).json({ success: false, message: "Something went wrong" })
    }
}

export const getChannelMessages = async (req, res) => {
    try {
        const { channelId } = req.body;
        if (!channelId)
            return res.status(400).json({ success: false, message: "Channel Id is required" })
        
        const channel = await Channel.findById(channelId).populate({
            path: 'messages',
            populate: {
                path: 'sender',
                select: 'firstName lastName email _id image'
            }
        })
        if (!channel)
            return res.status(400).json({ success: false, message: "Channel not found" })
        return res.status(200).json({ channel, success: true, message: "Messages fetched successfully" })
    } catch (error) {
        return res.status(400).json({ success: false, message: "Something went wrong" })
    }
}