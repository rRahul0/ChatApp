import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectChatData, setSelectChatType, setSelectChatMessages } from '@/slices/chatSlice';



const ContactList = ({ contacts, isChannel }) => {
    // console.log("contacts", contacts);

    const { selectChatData, selectChatType, dmContacts } = useSelector((state) => state.chat);
    const dispatch = useDispatch();
    const handleClick = (contact) => {
        dispatch(setSelectChatType(isChannel ? "channel" : "contact"));
        dispatch(setSelectChatData(contact));
        if (selectChatData && selectChatData?._id !== contact._id) dispatch(setSelectChatMessages([]));
    }
    return (<div className='mt-5'>
        {contacts?.map((contact) => (
            <div
                key={contact._id}
                onClick={() => handleClick(contact)}
                className={`my-1 cursor-pointer ${selectChatData?._id === contact._id ? 'bg-[#8417ff] text-[#8417ff]' : 'hover:bg-[#f1f1f111] hover:text-[#f1f1f111]'} transition-all duration-300`}>
                {/* <img src={contact.profilePic} alt='profile' className='w-10 h-10 rounded-full' /> */}
                {/* <div className='ml-4'>
                    <div className='text-white'>{contact.username}</div>
                    <div className='text-neutral-400 text-sm'>{contact.email}</div>
                </div> */}
                <div className={`flex py-2 pl-10 gap-5 items-center justify-start text-neutral-300 
                    ${selectChatData?._id === contact._id ? ' bg-[#8417ff]' : 'bg-[#2a2b33]'}
                    `}>
                    {
                        !isChannel &&
                        (
                            <div className='flex '>
                                <img src={contact.image.url} alt='profile' className='w-10 h-10 rounded-full border-2' />
                                <div className='ml-4 flex items-center'>
                                    <div className='text-white text-lg font-semibold'>{contact.firstName} {contact.lastName}</div>
                                    {/* <div className='text-neutral-400 text-sm'>{contact.email}</div> */}
                                </div>
                            </div>
                        )
                    }{
                        isChannel && <div className='w-10 h-10 rounded-full bg-[#2f303b] flex items-center justify-center'>
                            {isChannel ?
                                <span>#{contact.name}</span> : <span>{contact.firstName} {contact.lastName}</span>
                            }
                        </div>
                    }
                </div>

            </div>)
        )}
    </div>);
}

export default ContactList;