const BASE_URL = import.meta.env.VITE_BACKEND_URL + '/api/v1'


export const AuthEndpoints = {
    LOGIN_API: BASE_URL + "/auth/login",
    SIGNUP_API: BASE_URL + "/auth/signup",
}

export const ContactEndpoints = {
    SEARCH_CONTACTS: BASE_URL + "/contacts/search-contacts",
    GET_CONTACTS_DM: BASE_URL + "/contacts/get-contacts-dm",
}

export const MessageEndpoints = {
    GET_MESSAGES: BASE_URL + "/messages/get-all-messages",
    UPLOAD_FILE: BASE_URL + "/messages/upload-file",
}