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
            $or: [ { admin: userId }, { members: userId }]
        }).sort({updatdAt:-1})//.populate('members', 'name email')
        return res.status(200).json({ channels,success:true, message: "Channels fetched successfully" })
    } catch (error) {
        return res.status(400).json({ success:false, message: "Something went wrong" })
    }
}