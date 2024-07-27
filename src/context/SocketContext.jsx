const BASE_URL = import.meta.env.VITE_BACKEND_URL

import React, { createContext, useContext, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addMessage } from "../slices/chatSlice";
import io from "socket.io-client";

export const socketContext = createContext(null);

export const useSocket = () => {
    return useContext(socketContext);
}

export const SocketProvider = ({ children }) => {
    const dispatch = useDispatch();
    const socket = useRef(null);
    const { user } = useSelector(state => state.profile);
    const { selectChatData, selectChatType } = useSelector(state => state.chat);

    useEffect(() => {
        if (user) {
            socket.current = io(BASE_URL, {
                withCredentials: true,
                query: { userId: user._id },
            });

            socket.current.on("connect", () => {
                console.log("connected to socket server");
            });

            socket.current.on("receive-message", message => {               
                if (selectChatType != null &&
                    (selectChatData?._id === message?.sender?._id ||
                        selectChatData?._id === message?.receiver?._id)) {
                    dispatch(addMessage(message));
                }
            });

            return () => {
                if (socket.current) {
                    socket.current.disconnect();
                }
            };
        }
    }, [user, selectChatData, selectChatType, dispatch]);

    return (
        <socketContext.Provider value={socket.current}>
            {children}
        </socketContext.Provider>
    );
}

export default SocketProvider;
