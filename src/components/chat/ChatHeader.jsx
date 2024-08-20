import React, { useEffect, useState } from "react";
import { RiCloseFill } from "react-icons/ri";
import { useSelector, useDispatch } from "react-redux";
import { closeChat } from "@/slices/chatSlice";
import { useSocket } from "../../context/SocketContext";

const ChatHeader = () => {
    const { selectChatData, selectChatType, isOnline } = useSelector(state => state.chat);
    const dispatch = useDispatch();
    const socket = useSocket();
    const { user } = useSelector(state => state.profile);

    // const [isUserOnline, setIsUserOnline] = useState(false);

    useEffect(() => {
        // Function to check if the selected chat user is online
        const checkUserOnlineStatus = () => {
            // console.log(selectChatData)
            socket.emit("is_user_online", user._id, selectChatData._id)

        };

        // Check the online status every 10 seconds
        const intervalId = setInterval(checkUserOnlineStatus, 5000);

        // Initial check when component mounts
        checkUserOnlineStatus();

        // Clear interval on component unmount
        return () => clearInterval(intervalId);
    }, [socket, selectChatData, user, isOnline]);

    return (
        <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-5 sm:px-20 ">
            <div className="flex gap-5 items-center w-full justify-between ">
                <div className="flex gap-3 items-center justify-center ">
                    <div>
                        <img
                            src={selectChatData?.image?.url}
                            alt="profile"
                            className="w-12 h-12 rounded-full"
                        />
                    </div>
                    <div className="flex flex-col items-start">
                        <div>
                            {selectChatType === 'contact' &&
                                selectChatData?.firstName ?
                                (`${selectChatData?.firstName} ${selectChatData?.lastName}`)
                                : selectChatData?.email}
                            {selectChatType === 'channel' && `${selectChatData?.name}`}
                        </div>
                        {selectChatType==='contact' &&
                            <div className={`text-sm ${!isOnline ? "text-neutral-500" : "text-green-600"}`}>
                                {isOnline ? "Online" : "Offline"}
                            </div>
                        }
                    </div>
                </div>
                <div className="flex items-center justify-center gap-5 ">
                    <button
                        className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all "
                        onClick={() => dispatch(closeChat())}
                    >
                        <RiCloseFill className="text-3xl" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChatHeader;
