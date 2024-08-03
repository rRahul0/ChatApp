import { apiConnector } from "../apiConnector";
import { MessageEndpoints, ChannelEndpoints } from "../apis";

const {GET_CHANNEL_MESSAGES} = ChannelEndpoints
const { GET_MESSAGES, UPLOAD_FILE } = MessageEndpoints

export const getAllMessages = async (chatId, token) => {

    try {
        const response = await apiConnector(
            'POST',
            GET_MESSAGES,
            { chatId },
            { Authorization: `Bearer ${token}` }
        )
        const { data } = response;
        if (!data.success)
            throw new Error(data.message)

        // console.log("GET MESSAGES API RESPONSE............", response);

        return data.messages
    } catch (error) {
        console.log("GET MESSAGES API ERROR............", error);
        // return []
    }
}

export const sendFileMessage = async (formData, token) => {
    try {
        const response = await apiConnector(
            'POST',
            UPLOAD_FILE,
            formData,
            {
                "Content-Type": "multipart/form-data",
                'Authorization': `Bearer ${token}`,
              }
        )
        const { data } = response;
        // console.log("SEND FILE MESSAGE API RESPONSE............", response);
        if (!data.success)
            throw new Error(data.message)
        return data.data
    } catch (error) {
        console.log("SEND FILE MESSAGE API ERROR............", error);
    }
}

export const getChannelMessages = async (channelId, token) => {
    try {
        const response = await apiConnector(
            'POST',
            GET_CHANNEL_MESSAGES,
            { channelId },
            { Authorization: `Bearer ${token}` }
        )
        const { data } = response;
        if (!data.success)
            throw new Error(data.message)

        // console.log("GET CHANNEL MESSAGES API RESPONSE............", response);

        return data.channel.messages
    } catch (error) {
        console.log("GET CHANNEL MESSAGES API ERROR............", error);
        // return []
    }
}
    