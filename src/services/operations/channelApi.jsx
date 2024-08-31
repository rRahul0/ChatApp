import { apiConnector } from "../apiConnector";
import { ChannelEndpoints } from '../apis'
const { CREATE_CHANNEL, GET_CHANNELS } = ChannelEndpoints

export const createChannel = async (channelName, selectedContacts, token) => {
    try {
        const response = await apiConnector(
            'POST',
            CREATE_CHANNEL,
            { channelName, selectedContacts },
            {
                'Authorization': `Bearer ${token}`,
            }
        )
        const { data } = response;
        console.log("CREATE CHANNEL API RESPONSE............", response);
        if (!data.success)
            throw new Error(data.message)
        return data.data
    }
    catch (error) {
        console.log("CREATE CHANNEL API ERROR............", error);
    }
}

export const getChannels = async (token) => {
    try {
        const response = await apiConnector(
            'GET',
            GET_CHANNELS,
            {},
            { 'Authorization': `Bearer ${token}` }
        )
        if (!response.data.success)
            throw new Error(data.message)

        const { channels } = response.data;
        // console.log("GET CHANNELS API RESPONSE............", channels);
        
        return channels
    }
    catch (error) {
        console.log("GET CHANNELS API ERROR............", error);
    }
}