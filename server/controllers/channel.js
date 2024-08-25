import User from "../models/User.js";
import Channel from '../models/Channel.js'
import Message from '../models/Message.js'
import Cryptr from 'cryptr';
import { config } from 'dotenv';

config();
const cryptr = new Cryptr(`${process.env.CRYPTR_SECRET}`);

export const getUserChannels = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId)
            .populate({
                path: 'channels',
                populate: {
                    path: 'lastMessage',
                    model: 'Message',
                    populate: {
                        path: 'sender',
                        select: 'firstName lastName image'
                    }
                },

            })
            .exec();

        if (!user || !user.channels) {
            return res.status(400).json({ success: false, message: "Channels not found" });
        }

        const decryptedChannels = user.channels.map((channel) => {
            if (channel.lastMessage) {
                const msg = channel.lastMessage;
                // console.log(msg)
                if (msg.content) {
                    channel.lastMsg = cryptr.decrypt(msg.content);
                } else if (msg.fileUrl) {
                    channel.lastMsg = {
                        url: cryptr.decrypt(msg.fileUrl.url),
                        public_id: cryptr.decrypt(msg.fileUrl.public_id),
                    };
                }

                channel.lastMsgBy = msg.sender;
                channel.updatedAt = msg.updatedAt;
            }

            return {
                _id: channel._id,
                name: channel.name,
                members: channel.members,
                lastMsg: channel.lastMsg,
                lastMsgBy: channel.lastMsgBy,
                updatedAt: channel.updatedAt,
                image: channel.image,
            };
        });

        return res.status(200).json({ channels: decryptedChannels, success: true, message: "Channels fetched successfully" });
    } catch (error) {
        // console.log(error);
        return res.status(400).json({ success: false, message: "Something went wrong" });
    }
};


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
            // try {
            if (msg.content) msg.content = cryptr.decrypt(msg.content);
            else {
                msg.fileUrl.url = cryptr.decrypt(msg.fileUrl.url);
                msg.fileUrl.public_id = cryptr.decrypt(msg.fileUrl.public_id);
            }
            // } catch (e) {
            //     console.log(e)
            // }
            return msg;

        })
        // console.log(channelMsg)
        messages.messages = channelMsg;
        if (!channelMsg)
            return res.status(400).json({ success: false, message: "Channel not found" })
        return res.status(200).json({ channel: messages, success: true, message: "Messages fetched successfully" })
    } catch (error) {
        return res.status(400).json({ success: false, message: "Something went wrong" })
    }
}