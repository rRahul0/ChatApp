import ChatHeader from "@/components/chat/ChatHeader";
import MessageBar from "@/components/chat/MessageBar";
import MessageContainer from "@/components/chat/MessageContainer";

const ChatContainer = () => {
    return (
        <div className="fixed sm:pb-10 top-0 h-[100vh] w-[100vw] bg-[#1c1d25] flex flex-col md:static md:flex-1 ">
            <ChatHeader />
            <MessageContainer />
            <MessageBar />
        </div>
    );
}

export default ChatContainer;