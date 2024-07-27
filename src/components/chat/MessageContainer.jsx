import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import moment from "moment";
import fileDownload from "js-file-download";
import { setSelectChatMessages } from "@/slices/chatSlice";
import { getAllMessages } from "../../services/operations/messagesApi";
import { ImFolderOpen } from "react-icons/im";
import { IoMdDownload } from "react-icons/io";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import '../scroll.css';

const MessageContainer = () => {
    const scrollRef = useRef(null);
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.profile);
    const { token } = useSelector(state => state.auth);
    const { selectChatType, selectChatData, selectChatMessages } = useSelector(state => state.chat);

    const [showImage, setShowImage] = useState(false);
    const [image, setImage] = useState({
        url: "",
        name: "",
        public_id: ""
    });
    const handleOnChange = (data) => { setImage((prevData) => ({ ...prevData, ...data})) }
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

    const checkIfImage = (url) => url.match(/\.(jpeg|jpg|gif|png|bmp|tiff|tif|webp|svg|ico|heic|heif)$/) != null;

    const renderContactMessage = (message) => {
        return (
            <>
                <div className={`${message.sender === selectChatData._id ? "text-left" : "text-right"}`}>
                    {message.messageType === "text" && (
                        <div className={`${message.sender !== selectChatData._id ?
                            "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50" :
                            "bg-[#2a2b33]/5 text-white/80 border-white/20"
                            } border inline-block py-1 px-3 rounded my-1 max-w-[50%] break-words`}>
                            {message.content}
                        </div>
                    )}
                    {message.messageType === "file" && (
                        <div className={`${message.sender !== selectChatData._id ?
                            "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50" :
                            "bg-[#2a2b33]/5 text-white/80 border-white/20"
                            } border inline-block py-1 px-3 rounded my-1 max-w-[60%] max-sm:max-w-[90%] break-words `}>
                            {checkIfImage(message.fileUrl.url) ?
                                <div className="cursor-pointer">
                                    <img src={message.fileUrl.url}
                                        alt={message.fileUrl.name}
                                        height={300}
                                        width={300}
                                        className="object-fit"
                                        onClick={() => {
                                            setShowImage(true);
                                            handleOnChange(message.fileUrl)
                                        }}
                                    />
                                </div> :
                                <div className="flex items-center justify-center gap-4 ">
                                    <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                                        <ImFolderOpen />
                                    </span>
                                    <span>{
                                        message.fileUrl.name.length > 20 ?
                                            `${message.fileUrl.name.substring(0, 15)}   ...` : message.fileUrl.name
                                    }</span>
                                    <span
                                        className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                                        onClick={() => fileDownload(message.fileUrl.url, message.fileUrl.name)}
                                    >
                                        <IoMdDownload />
                                    </span>
                                </div>}
                        </div>
                    )}
                    <div className="text-xs text-gray-600">
                        {moment(message.timestamp).format("LT")}
                    </div>
                </div>

                <Dialog open={showImage} onOpenChange={setShowImage} >
                    {/* <DialogTrigger>Open</DialogTrigger> */}
                    <DialogContent className="bg-[#1a1b20] border-none text-white flex flex-col px-12 py-7 rounded-lg">
                        <DialogHeader className="flex flex-col items-center gap-3">
                            <DialogTitle className="text-xl flex gap-5 items-center">
                                <span>{image.name}</span>
                                <span
                                    className="bg-slate-700 p-2 text-2xl rounded-full hover:bg-[#8417ff] cursor-pointer transition-all duration-300"
                                    onClick={() => fileDownload(image.url, image.name)}
                                ><IoMdDownload /> </span>
                            </DialogTitle>
                            {/* <DialogDescription>
                                {moment(message.timestamp).format("LL")}
                            </DialogDescription> */}
                            <div className="flex justify-center ">
                                <img
                                    src={image.url}
                                    alt={image.name}
                                    height={300}
                                    width={300}
                                    className="object-fit shadow-2xl shadow-slate-600 rounded-lg"
                                />
                            </div>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </>
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
