import ChatContainer from "../components/chat/ChatContainer";
import ContactsContainer from "../components/chat/ContactsContainer";
import EmptyChatContainer from "../components/chat/EmptyChatContainer";

import { useSelector } from "react-redux";

const Chat = () => {
    const { selectChatType, selectChatData } = useSelector(state => state.chat);
    return ( 
        <div className="flex h-[100vh] text-white overflow-hidden ">
            <ContactsContainer />
            {selectChatType === null ? <EmptyChatContainer /> : <ChatContainer />}
        </div>
     );
}
 
export default Chat;