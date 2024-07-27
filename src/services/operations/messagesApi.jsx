import { apiConnector } from "../apiConnector";
import { useSelector } from "react-redux"
import { MessageEndpoints } from "../apis";

const { GET_MESSAGES, UPLOAD_FILE } = MessageEndpoints

export const getAllMessages = async (user2, token) => {

    try {
        const response = await apiConnector(
            'POST',
            GET_MESSAGES,
            { id: user2 },
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

export const sendFileMessage = async (file, user2) => {
    const { token } = useSelector((state) => state.auth);
    try {
        console.log(file)
        const formData = new FormData();
        formData.append('file', file);
        formData.append('receiver', user2);
        const response = await apiConnector(
            'POST',
            UPLOAD_FILE,
            formData,
            { Authorization: `Bearer ${token}` }
        )
        const { data } = response;
        console.log("SEND FILE MESSAGE API RESPONSE............", response);
        if (!data.success)
            throw new Error(data.message)
        return data.message
    } catch (error) {
        console.log("SEND FILE MESSAGE API ERROR............", error);
    }
}