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
        
        // addMessage(state, action) {
        //     const message = action.payload;

        //     // Create a new message object with the required fields
        //     const newMessage = {
        //         ...message,
        //         receiver: state.selectChatType === "channel" ? message.receiver : message.receiver._id,
        //         sender: state.selectChatType === "channel" ? message.sender : message.sender._id,
        //     };

        //     // Check if the message already exists in the state
        //     const messageExists = state.selectChatMessages.some(existingMessage => 
        //         existingMessage._id === message._id // Assuming _id is the unique identifier
        //         || (existingMessage.sender === newMessage.sender && 
        //             existingMessage.receiver === newMessage.receiver && 
        //             existingMessage.timestamp === newMessage.timestamp) // Adjust based on your message structure
        //     );

        //     // If the message does not exist, push it to the state
        //     if (!messageExists) {
        //         state.selectChatMessages.push(newMessage);
        //     }
        // },
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
            // const userId = value.payload.user._id
            // const fromId =value.payload.message.sender._id===userId?
            //  value.payload.message.receiver._id : value.payload.message.sender._id

            //  const fromData = value.payload.message.sender._id===userId?
            //  value.payload.message.receiver : value.payload.message.sender

            // const contacts= state.dmContacts
            const data = channels.find(channel => channel._id === value.payload._id)
            // const index = contacts.indexOf(data)
            const index = channels.findIndex(channel => channel._id === value.payload.channelId)
            console.log(index, data, channels)

            if (index !== -1 && index !== undefined) {
                console.log("in if block")
                channels.splice(index, 1)
                channels.unshift(data)
            }
            state.channels = channels
        },
        sortContacts(state, value) {
            const userId = value.payload.user._id
            const fromId = value.payload.message.sender._id === userId ?
                value.payload.message.receiver._id : value.payload.message.sender._id

            const fromData = value.payload.message.sender._id === userId ?
                value.payload.message.receiver : value.payload.message.sender

            const contacts = state.dmContacts
            const data = contacts.find(contact => contact._id === fromId)
            // const index = contacts.indexOf(data)
            const index = contacts.findIndex(contact => contact._id === fromId)
            console.log(index, data, fromData, fromId, userId)

            if (index !== -1 && index !== undefined) {
                console.log("in if block")
                contacts.splice(index, 1)
                contacts.unshift(data)
            } else {
                console.log("in elsex block")
                contacts.unshift(fromData)
            }
            state.dmContacts = contacts
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