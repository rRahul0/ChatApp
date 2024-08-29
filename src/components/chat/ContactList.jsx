import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectChatData, setSelectChatType, setSelectChatMessages } from '@/slices/chatSlice';
import { useSocket } from '../../context/SocketContext';
import moment from 'moment';
import { IoFolderOpenSharp } from "react-icons/io5";

const ContactList = ({ contacts, isChannel }) => {
    const { user } = useSelector((state) => state.profile);
    const { selectChatData, selectChatType, dmContacts } = useSelector((state) => state.chat);
    const dispatch = useDispatch();
    const socket = useSocket();
    // if (isChannel) console.log(contacts)
    const handleClick = (contact) => {
        socket.emit("is_user_online", user._id, contact._id);
        dispatch(setSelectChatType(isChannel ? "channel" : "contact"));
        dispatch(setSelectChatData(contact));
        if (selectChatData && selectChatData?._id !== contact._id) dispatch(setSelectChatMessages([]));
    }
    const formatMessageTime = (timestamp) => {
        const msgTime = moment(timestamp);
        const now = moment();
        const oneDayAgo = now.clone().subtract(1, 'days');
        const oneYearAgo = now.clone().subtract(1, 'years');

        let formattedTime;

        if (msgTime.isAfter(oneDayAgo)) {
            formattedTime = msgTime.fromNow();
        } else if (msgTime.isAfter(oneYearAgo)) {
            formattedTime = msgTime.format('h:mm A');
        } else {
            formattedTime = msgTime.format('D MMM YYYY');
        }

        return formattedTime;
    }
    // console.log(contacts)

    return (
        <div className='mt-5'>
            {contacts?.map((contact, index) => (
                <div
                    key={contact._id}
                    onClick={() => handleClick(contact)}
                    className={`my-1 cursor-pointer ${selectChatData?._id === contact._id ? 'bg-[#8417ff] text-[#8417ff]' : 'hover:bg-[#f1f1f111] hover:text-[#f1f1f111]'} transition-all duration-300`}
                >
                    <div className={`w-full flex py-2 px-4 gap-5 items-center justify-start text-neutral-300 
                        ${selectChatData?._id === contact?._id ? ' bg-[#5d1da6]' : 'bg-[#2a2b33]'}`}>
                        {!isChannel && (
                            <div className='w-full flex'>
                                <img src={contact?.image?.url} alt='profile' className='w-10 h-10 rounded-full border-2' />
                                <div className='w-full flex justify-between'>
                                    <div className='w-full ml-3 flex flex-col items-start '>
                                        <div className='text-white text-lg font-semibold'>
                                            {
                                                contact.firstName.length + contact.lastName.length > 20 ?
                                                    (contact.firstName + " " + contact.lastName).slice(0, 20) + " ..." :
                                                    contact.firstName + " " + contact.lastName
                                            }
                                        </div>
                                        <div className='w-full text-[#E0E0E0] text-sm flex justify-between '>
                                            <p>{dmContacts[index]?.lastMessage ? (
                                                typeof dmContacts[index].lastMessage === 'string' ?
                                                    (dmContacts[index].lastMessage.length > 18 ?
                                                        dmContacts[index].lastMessage.slice(0, 15) + ' ...' :
                                                        dmContacts[index].lastMessage) :
                                                    <IoFolderOpenSharp />
                                            ) : ''}</p>
                                            <div className='text-neutral-400 text-sm flex items-center'>
                                                {dmContacts[index]?.lastMessage && formatMessageTime(dmContacts[index].msgTime)}
                                            </div>

                                        </div>
                                    </div>

                                </div>
                            </div>
                        )}
                        {isChannel && (
                            <div className='w-full flex items-center '>
                                <div className='w-12 h-10 rounded-full bg-[#2f303b] flex items-center justify-center'>
                                    <span>#</span>
                                </div>
                                <div className='w-full ml-4 flex flex-col items-start'>
                                    <div className='text-white text-lg font-semibold'>
                                        {contact.name || "Channel"}
                                    </div>
                                    <div className='w-full'>
                                        {contact.lastMsg && contact.lastMsgBy && (
                                            <div className='w-full flex items-center justify-between text-gray-400 text-sm '>
                                                <div>
                                                    <span className='font-semibold flex items-center'>{contact.lastMsgBy.firstName + " : "}{
                                                        typeof contact?.lastMsg === 'string' ?
                                                            (contact.lastMsg.length > 18 ?
                                                                " " + contact.lastMsg.slice(0, 15) + ' ...' :
                                                                contact.lastMsg) :
                                                            <IoFolderOpenSharp className='w-10 h-4' />
                                                    }</span>
                                                </div>
                                                <div className='ml-1 text-xs'>
                                                    {formatMessageTime(contact.updatedAt)}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ContactList;
