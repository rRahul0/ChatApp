import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    selectChatType: null,
    selectChatData: undefined,
    selectChatMessages: [],
    dmContacts: [],
}

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setSelectChatType(state, action) {
            state.selectChatType = action.payload;
        },
        setSelectChatData(state, action) {
            state.selectChatData = action.payload;
        },
        setSelectChatMessages(state, action) {
            state.selectChatMessages = action.payload;
        },
        closeChat(state) {
            state.selectChatType = null;
            state.selectChatData = null;
            state.selectChatMessages = [];
        },
        addMessage(state, action) {
            const message = action.payload;
            state.selectChatMessages.push({
                ...message,
                receiver: state.selectChatType === "channel" ? message.receiver : message.receiver._id,
                sender: state.selectChatType === "channel" ? message.sender : message.sender._id,
            });
        },
        setDmContacts(state, action) {
            const newContacts = Array.isArray(action.payload) ? action.payload : [action.payload];
            const contactMap = new Map(state.dmContacts.map(contact => [contact._id, contact]));
            
            newContacts.forEach(contact => {
                contactMap.set(contact._id, contact);
            });

            state.dmContacts = Array.from(contactMap.values()).sort(
                (a, b) => (b.lastMessageTimestamp || 0) - (a.lastMessageTimestamp || 0)
            );
        },
    }
});

export const { setSelectChatType, setSelectChatData, setSelectChatMessages, closeChat, addMessage, setDmContacts } = chatSlice.actions;
export default chatSlice.reducer;