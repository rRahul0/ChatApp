import { useSelector } from "react-redux";
import { apiConnector } from "../apiConnector";
import { ContactEndpoints } from "../apis";

const { SEARCH_CONTACTS, GET_CONTACTS_DM } = ContactEndpoints;

export async function searchContacts(search, token) {
    try {
        const response = await apiConnector(
            "POST",
            SEARCH_CONTACTS,
            { search },
            { Authorization: `Bearer ${token}` }
        );

        // console.log("SEARCH CONTACTS API RESPONSE............", response);

        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        const {user} = response.data
        // console.log("SEARCH CONTACTS API RESPONSE............", user);
        return user;
    } catch (error) {
        console.log("SEARCH CONTACTS API ERROR............", error);
    }
}

export async function AllContactsDm(token){
    // const { token } = useSelector((state) => state.auth);
    const { GET_CONTACTS_DM } = ContactEndpoints;
    try {
        const response = await apiConnector(
            "GET",
            GET_CONTACTS_DM,
            {},
            { Authorization: `Bearer ${token}` }
        );
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        const { users } = response.data;
        // console.log("GET CONTACTS DM API RESPONSE............", response);
        return users;
    } catch (error) {
        console.log("GET CONTACTS DM API ERROR............", error);
    }
}