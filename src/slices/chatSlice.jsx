import { createSlice } from '@reduxjs/toolkit'

function safeStringify(obj, seen = new Set()) {
    return JSON.stringify(obj, function(_, value) {
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) return;
            seen.add(value);
        }
        return value;
    });
}

const initialState = {
    isOnline: false,
    selectChatType: null,
    selectChatData: undefined,
    selectChatMessages: [],
    dmContacts: [],
    channels: [],
    notifications:[],
}

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {

        setOnlineUsers(state, action) {
            state.isOnline = action.payload;
        },
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

            const newContacts = Array.isArray(action.payload) ? action.payload : [action.payload];
            const contactMap = new Map(state.dmContacts.map(contact => [contact._id, contact]));
            newContacts.forEach(contact => {
                contactMap.set(contact._id, contact);
            });
            state.dmContacts = Array.from(contactMap.values())
        },
        updateDmContacts(state, action) {
            const { message, userId } = action.payload;
            const fromId = message.sender._id === userId ? message.receiver._id : message.sender._id;
            const index = state.dmContacts.findIndex(contact => contact._id.toString() === fromId.toString());
            if (index !== -1) {
                const contact = state.dmContacts[index];
                contact.lastMessage = message.content?message.content: null;
                contact.msgTime = message.updatedAt;
            }
        },
        setChannels(state, value) {
            const sortedChannels = value.payload.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            state.channels = sortedChannels;
        },
        addChannel(state, action) {
            const newChannel = action.payload;
            const index = state.channels.findIndex(channel => channel._id === newChannel.channelId);
        
            if (index !== -1) {
                // If the channel exists, move it to the top
                const channel = { ...state.channels[index] }; // Clone to avoid mutations
                state.channels.splice(index, 1);
                state.channels.unshift(channel);
            } else {
                // If the channel is new, add it to the top
                state.channels.unshift({ ...newChannel }); // Clone to avoid mutations
            }
        },  
        updateChannel(state, action) {
            const message = action.payload
            const channelId = message.channelId
// console.log(message)
            const index = state.channels.findIndex(channel => channel._id === channelId);
            // console.log(index)
            if (index !== -1) {
                const channel = state.channels[index];
                // console.log(channel)
                channel.lastMsg = message.content?message.content:null;
                channel.lastMsgBy = message.sender;
                channel.updatedAt = message.updatedAt;
            }
        },
        sortContacts(state, { payload }) {
            const { userId, sender, receiver } = payload;
            const fromId = sender._id === userId ? receiver._id : sender._id;
        
            const index = state.dmContacts.findIndex(contact => contact._id === fromId);
        
            if (index !== -1) {
                const contact = JSON.parse(safeStringify(state.dmContacts[index])); // Safely clone
                // console.log(contact)
                state.dmContacts.splice(index, 1);
                state.dmContacts.unshift(contact);
            } else {
                const user = JSON.parse(safeStringify(sender._id === userId ? receiver : sender)); // Safely clone
                state.dmContacts.unshift(user);
            }
        },
        addNotifications(state, {payload}){
            const {message} = payload
            state.notifications.push(message)
        },
        removeNotifications(state, {payload}){
            const {senderId} = payload
            state.notifications = state.notifications.filter((notifications)=>notifications.sender!==senderId)
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
    updateDmContacts,
    setChannels,
    addChannel,
    updateChannel,
    sortContacts,
    setOnlineUsers,
} = chatSlice.actions;
export default chatSlice.reducer;