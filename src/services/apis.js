const BASE_URL = import.meta.env.VITE_BACKEND_URL + '/api/v1'


export const AuthEndpoints = {
    LOGIN_API: BASE_URL + "/auth/login",
    SIGNUP_API: BASE_URL + "/auth/signup",
    SENDOTP_API: BASE_URL + "/auth/sendotp",
    RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
    RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
    REFRESHTOKEN_API: BASE_URL + "/auth/refresh",
    LOGOUT_API: BASE_URL + "/auth/logout",
}

export const ProfileEndpoints = {
    UPDATE_PROFILE: BASE_URL + "/profile/update-profile",
    UPDATE_NAME: BASE_URL + "/profile/update-name",
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
