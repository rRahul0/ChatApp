import User from "../models/User.js";
import Channel from '../models/Channel.js'
import Cryptr from 'cryptr';
import { config } from 'dotenv';

config();
const cryptr = new Cryptr(`${process.env.CRYPTR_SECRET}`);

export const getUserChannels = async (req, res) => {
    try {
        const userId = req.user.id;
        const channels = await User.findById(userId)
            .populate("channels", "image name")
            .sort({ updatedAt: -1 })
            .exec();


        if (!channels)
            return res.status(400).json({ success: false, message: "Channels not found" })

        return res.status(200).json({ channels: channels.channels, success: true, message: "Channels fetched successfully" })
    } catch (error) {
        return res.status(400).json({ success: false, message: "Something went wrong" })
    }
}

export const getChannelMessages = async (req, res) => {
    try {
        const { channelId } = req.body;
        if (!channelId)
            return res.status(400).json({ success: false, message: "Channel Id is required" })

        const messages = await Channel.findById(channelId).populate({
            path: 'messages',
            populate: {
                path: 'sender',
                select: 'firstName lastName email _id image'
            }
        })
        // console.log(messages)
        if (!messages)
            return res.status(400).json({ success: false, message: "Messages not found" })
        const channelMsg = messages.messages.map((msg) => {
            try {
                if (msg.content) msg.content = cryptr.decrypt(msg.content);
                if (msg.fileUrl) {
                    msg.fileUrl.url = cryptr.decrypt(msg.fileUrl.url);
                    msg.fileUrl.public_id = cryptr.decrypt(msg.fileUrl.public_id);
                }
            } catch (e) {
                console.log(e)
            }
            return msg;

        })
        // console.log(channelMsg)
        messages.messages = channelMsg;
        if (!channelMsg)
            return res.status(400).json({ success: false, message: "Channel not found" })
        return res.status(200).json({ channel:messages, success: true, message: "Messages fetched successfully" })
    } catch (error) {
        return res.status(400).json({ success: false, message: "Something went wrong" })
    }
}