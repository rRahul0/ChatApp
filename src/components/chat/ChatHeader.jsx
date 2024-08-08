import { RiCloseFill } from "react-icons/ri";
import { useSelector, useDispatch } from "react-redux";

import { closeChat } from "@/slices/chatSlice";

const ChatHeader = () => {
    const { selectChatData, selectChatType } = useSelector(state => state.chat);
    const dispatch = useDispatch();
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
                        {/* <div>
                            {selectChatType === 'channel' && `${selectChatData.admin}`}
                        </div> */}
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