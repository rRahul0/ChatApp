import { apiConnector } from "../apiConnector";
import { ProfileEndpoints } from "../apis";

const { UPDATE_PROFILE, UPDATE_NAME } = ProfileEndpoints;

export const updateProfile = async (formData, token) => {
    try {
        const response = await apiConnector(
            'PATCH',
            UPDATE_PROFILE,
            formData,
            {
                "Content-Type": "multipart/form-data",
                'Authorization': `Bearer ${token}`,
            }
        )
        const { data } = response;
        console.log("UPDATE PROFILE API RESPONSE............", response);
        if (!data.success)
            throw new Error(data.message)
        return data.image
    } catch (error) {
        console.log("UPDATE PROFILE API ERROR............", error);
    }
}

export const updateName = async (formData, token) => {
    try {
        const response = await apiConnector(
            'PATCH',
            UPDATE_NAME,
            formData,
            {
                'Authorization': `Bearer ${token}`,
            }
        )
        const { data } = response;
        console.log("UPDATE NAME API RESPONSE............", response);
        if (!data.success)
            throw new Error(data.message)
        return data.user;
    }
    catch (error) {
        console.log("UPDATE NAME API ERROR............", error);
    }
}