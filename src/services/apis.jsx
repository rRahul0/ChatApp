const BASE_URL = import.meta.env.VITE_BACKEND_URL + '/api/v1'


export const AuthEndpoints = {
    LOGIN_API: BASE_URL + "/auth/login",
    SIGNUP_API: BASE_URL + "/auth/signup",
}

export const ContactEndpoints = {
    SEARCH_CONTACTS: BASE_URL + "/contacts/search-contacts",
    GET_CONTACTS_DM: BASE_URL + "/contacts/get-contacts-dm",
    GET_ALL_CONTACTS: BASE_URL + "/contacts/get-all-contacts",
}

export const MessageEndpoints = {
    GET_MESSAGES: BASE_URL + "/messages/get-all-messages",
    UPLOAD_FILE: BASE_URL + "/messages/upload-file",
}

export const ChannelEndpoints = {
    CREATE_CHANNEL: BASE_URL + "/channels/create-channel",
    GET_CHANNELS: BASE_URL + "/channels/get-channels",
    GET_CHANNEL_MESSAGES: BASE_URL + "/channels/get-channel-messages",
}
