import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    selectChatType: null,
    selectChatData: undefined,
    selectChatMessages: [],
    dmContacts: [],
    channels: [],
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
            if (!state.selectChatMessages) {
                state.selectChatMessages = [];
            }
            state.selectChatMessages.push({
                ...message,
                receiver: state.selectChatType === "channel" ? message.receiver : message.receiver._id,
                sender: state.selectChatType === "channel" ? message.sender : message.sender._id,
            });
        },
        setDmContacts(state, action) {
            const newContacts = action.payload
            //Array.isArray(action.payload) ? action.payload : [action.payload];
            const contactMap = new Map(state.dmContacts.map(contact => [contact._id, contact]));
            newContacts.forEach(contact => {
                contactMap.set(contact._id, contact);
            });
            state.dmContacts = Array.from(contactMap.values())
            // state.dmContacts = [action.payload, ...state.dmContacts]
        },
        setChannels(state, value) {
            state.channels = value.payload
        },
        addChannel(state, value) {
            const channels = state.channels
            const data = channels.find(channel => channel._id === value.payload.channelId)
            const index = channels.findIndex(channel => channel._id === value.payload.channelId)
            if (index !== -1 && index !== undefined) {
                channels.splice(index, 1)
                channels.unshift(data)
            }
            state.channels = channels
        },
        sortContacts(state, { payload }) {
            const { userId, sender, receiver } = payload;
            const fromId = sender._id === userId ? receiver._id : sender._id;
                      
            const index = state.dmContacts.findIndex(contact => contact._id === fromId);
                      
            if (index !== -1) {
              const [contact] = state.dmContacts.splice(index, 1);
              state.dmContacts.unshift(contact);
            } else {
              state.dmContacts.unshift(sender._id === userId ? receiver : sender);
            }
        }
          
    }
});

export const {
    setSelectChatType,
    setSelectChatData,
    setSelectChatMessages,
    closeChat,
    addMessage,
    setDmContacts,
    setChannels,
    addChannel,
    sortContacts
} = chatSlice.actions;
export default chatSlice.reducer;