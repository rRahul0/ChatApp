import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    selectChatType: null,
    selectChatData: undefined,
    selectChatMessages: [],
    dmContacts: [],
}


const chatSlice = createSlice({
    name: 'chat',
    initialState: initialState,
    reducers: {
        setSelectChatType(state, value) {
            state.selectChatType = value.payload;
        },
        setSelectChatData(state, value) {
            state.selectChatData = value.payload;
        },
        setSelectChatMessages(state, value) {
            state.selectChatMessages = value.payload;
        },
        closeChat(state) {
            state.selectChatType = null;
            state.selectChatData = null;
            state.selectChatMessages = [];
        },
        addMessage(state, value) {
            state.selectChatMessages = [...state.selectChatMessages,
            {
                ...value.payload,
                receiver: state.selectChatType === "channel" ? value.payload.receiver : value.payload.receiver._id,
                sender: state.selectChatType === "channel" ? value.payload.sender : value.payload.sender._id,

            }];
        },
        setDmContacts(state, value) {
            state.dmContacts = value.payload;
        },
    }
})

export const { setSelectChatType, setSelectChatData, setSelectChatMessages, closeChat, addMessage, setDmContacts } = chatSlice.actions;
export default chatSlice.reducer;