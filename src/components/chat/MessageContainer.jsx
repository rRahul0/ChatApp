import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef } from "react";
import moment from "moment";
import { setSelectChatMessages } from "@/slices/chatSlice";
import { getAllMessages } from "../../services/operations/messagesApi";
import '../scroll.css';

const MessageContainer = () => {
    const scrollRef = useRef(null);
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.profile);
    const { token } = useSelector(state => state.auth);
    const { selectChatType, selectChatData, selectChatMessages } = useSelector(state => state.chat);

    useEffect(() => {
        const fetchMessages = async () => {
            if (selectChatData._id) {
                if (selectChatType === "contact") {
                    // console.log(selectChatData);
                    const messages = await getAllMessages(selectChatData._id, token);
                    dispatch(setSelectChatMessages(messages));
                }
            }
        };

        fetchMessages();
    }, [selectChatData, selectChatType, token, dispatch]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [selectChatMessages]);

    const renderContactMessage = (message) => {
        return (
            <div className={`${message.sender === selectChatData._id ? "text-left" : "text-right"}`}>
                {message.messageType === "text" && (
                    <div className={`${message.sender !== selectChatData._id ?
                        "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50" :
                        "bg-[#2a2b33]/5 text-white/80 border-white/20"
                    } border inline-block py-1 px-3 rounded my-1 max-w-[50%] break-words`}>
                        {message.content}
                    </div>
                )}
                <div className="text-xs text-gray-600">
                    {moment(message.timestamp).format("LT")}
                </div>
            </div>
        );
    };

    const renderMessages = () => {
        let lastDate = null;
        return selectChatMessages.map((message) => {
            const date = moment(message.timestamp).format("YYYY-MM-DD");
            const showDate = date !== lastDate;
            lastDate = date;
            return (
                <div key={message._id}>
                    {showDate && (
                        <div className="text-center text-gray-500 my-2">
                            {moment(message.timestamp).format('LL')}
                        </div>
                    )}
                    {selectChatType === "contact" && renderContactMessage(message)}
                </div>
            );
        });
    };

    return (
        <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
            {renderMessages()}
            <div ref={scrollRef} />
        </div>
    );
};

export default MessageContainer;
