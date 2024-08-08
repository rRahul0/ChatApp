import User from "../models/User.js";
import Channel from '../models/Channel.js'

export const getUserChannels = async (req, res) => {
    try {
        const userId = req.user.id;
        const channels = await User.findById(userId)
        .populate("channels", "image name")
        .sort({ updatedAt: -1 })
        .exec();


        if (!channels)
            return res.status(400).json({ success: false, message: "Channels not found" })

        return res.status(200).json({ channels:channels.channels, success: true, message: "Channels fetched successfully" })
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