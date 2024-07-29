import React, { useRef, useState } from 'react';
import { GrAttachment } from 'react-icons/gr';
import { IoSend } from 'react-icons/io5';
import { RiEmojiStickerLine } from 'react-icons/ri';
import { useSelector } from 'react-redux';
import EmojiPicker from 'emoji-picker-react';
import useOnClickOutside from '@/hooks/useOnClickOutside';
import { sendFileMessage as sendFile } from '../../services/operations/messagesApi';
import { useSocket } from '../../context/SocketContext';

const MessageBar = () => {
    const socket = useSocket();
    const { user } = useSelector(state => state.profile);
    const { token } = useSelector(state => state.auth);
    const { selectChatType, selectChatData } = useSelector(state => state.chat);
    const [message, setMessage] = useState("");
    const emojiRef = useRef(null);
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
    const fileInputRef = useRef(null);

    const handleSendMessage = async () => {
        const messagePayload = selectChatType === "contact" ? {
            sender: user._id,
            content: message,
            receiver: selectChatData._id,
            messageType: "text",
        } : {
            receiver: selectChatData._id,
            message,
            channel: selectChatData._id
        };

        socket.emit("send-message", messagePayload);
        setMessage("");
    };

    const handleAddEmoji = (e) => {
        setMessage(prevMessage => prevMessage + e.emoji);
    };

    const handleFileUpload = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    async function uploadFile(file, receiver) {
        try {
            const formData = new FormData();
            if (!file) return;
            formData.append('file', file);
            formData.append('receiver', receiver);

            const response = await sendFile(formData, token);
            // console.log(response);
            if (selectChatType === "contact") {
                socket.emit("send-message", response);
            }
            // console.log(response);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    }

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        await uploadFile(file, selectChatData._id);

    };

    useOnClickOutside(emojiRef, () => setEmojiPickerOpen(false));

    return (
        <div className="max-sm:w-full w-[90%] h-[10vh] bg-[#1c1d25] flex justify-center items-center mx-auto mb-6 sm:gap-6 gap-3 px-2 sm:px-5">
            <div className="max-sm:w-[82%] flex-1 flex bg-[#2a2b33] items-center gap-1 sm:gap-5 pr-5 rounded-md">
                <input
                    type="text"
                    placeholder="Type a message"
                    className="flex-1 py-3 max-sm:pl-2 sm:p-5 bg-transparent focus:border-none focus:outline-none"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button
                    onClick={handleFileUpload}
                    className="text-neutral-100 focus:border-none focus:outline-none focus:text-white duration-300 transition-all ">
                    <GrAttachment className="text-2xl text-neutral-500" />
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                />
                <div className="relative">
                    <button
                        className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all'
                        onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}
                    >
                        <RiEmojiStickerLine className="text-2xl text-neutral-500" />
                    </button>
                    {emojiPickerOpen && (
                        <div className='absolute bottom-16 right-0' ref={emojiRef}>
                            <EmojiPicker
                                theme='dark'
                                onEmojiClick={handleAddEmoji}
                                autoFocusSearch={false}
                            />
                        </div>
                    )}
                </div>

            </div>
            <button
                className="max-sm:max-w-[20%] bg-[#8417ff] rounded-full flex items-center justify-center p-3 sm:p-5 hover:bg-[#741bda] focus:bg-[#741bda] focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
                onClick={handleSendMessage}
            >
                <IoSend className="text-2xl text-neutral-300" />
            </button>
        </div>
    );
};

export default MessageBar;
