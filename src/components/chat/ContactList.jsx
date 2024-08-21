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
    // console.log(dmContacts)
    const handleClick = (contact) => {
        socket.emit("is_user_online", user._id, contact._id);
        dispatch(setSelectChatType(isChannel ? "channel" : "contact"));
        dispatch(setSelectChatData(contact));
        if (selectChatData && selectChatData?._id !== contact._id) dispatch(setSelectChatMessages([]));
    }


    return (
        <div className='mt-5'>
            {contacts?.map((contact, index) => (
                <div
                    key={contact._id}
                    onClick={() => handleClick(contact)}
                    className={`my-1 cursor-pointer ${selectChatData?._id === contact._id ? 'bg-[#8417ff] text-[#8417ff]' : 'hover:bg-[#f1f1f111] hover:text-[#f1f1f111]'} transition-all duration-300`}
                >
                    <div className={`flex py-2 px-8 gap-5 items-center justify-start text-neutral-300 
                        ${selectChatData?._id === contact?._id ? ' bg-[#8417ff]' : 'bg-[#2a2b33]'}`}>
                        {!isChannel && (
                            <div className='w-full flex'>
                                <img src={contact?.image?.url} alt='profile' className='w-10 h-10 rounded-full border-2' />
                                <div className='w-full flex justify-between'>
                                    <div className='ml-3 flex flex-col items-start '>
                                        <div className='text-white text-lg font-semibold'>
                                            {
                                                contact.firstName.length + contact.lastName.length > 11 ?
                                                    (contact.firstName + " " + contact.lastName).slice(0, 11) + " ..." :
                                                    contact.firstName + " " + contact.lastName
                                            }
                                        </div>
                                        <div className='text-[#E0E0E0] text-sm'>
                                            {typeof dmContacts[index].lastMessage === 'string' ?
                                                (dmContacts[index].lastMessage.length > 18 ?
                                                    dmContacts[index].lastMessage.slice(0, 15) + ' ...' :
                                                    dmContacts[index].lastMessage) :
                                                <IoFolderOpenSharp />
                                            }
                                        </div>
                                    </div>
                                    <div className='text-neutral-400 text-sm flex items-center'>
                                        {moment(dmContacts[index].msgTime).format('h:mm A')}
                                    </div>
                                </div>
                            </div>
                        )}
                        {isChannel && (
                            <div className='flex'>
                                <div className='w-10 h-10 rounded-full bg-[#2f303b] flex items-center justify-center'>
                                    <span>#</span>
                                </div>
                                <div className='ml-4 flex items-center'>
                                    <div className='text-white text-lg font-semibold'>{contact.name || "Channel"}</div>
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
