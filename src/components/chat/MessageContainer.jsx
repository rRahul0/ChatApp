import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import moment from "moment";
import { setSelectChatMessages, setDownload } from "../../slices/chatSlice";
import { getAllMessages, getChannelMessages } from "../../services/operations/messagesApi";
import { ImFolderOpen } from "react-icons/im";
import { IoMdDownload } from "react-icons/io";
import { BiLoaderAlt } from "react-icons/bi";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import '../scroll.css';
import '../../App.css';

const MessageContainer = () => {
    const scrollRef = useRef(null);
    const modalRef = useRef(null);
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.profile);
    const { token } = useSelector(state => state.auth);
    const { selectChatType, selectChatData, selectChatMessages, isDownload } = useSelector(state => state.chat);

    const [showImage, setShowImage] = useState(false);


    const [image, setImage] = useState({
        url: "",
        name: "",
        public_id: ""
    });
    const handleOnChange = (data) => { setImage((prevData) => ({ ...prevData, ...data })) }
    useEffect(() => {
        const fetchMessages = async () => {
            if (selectChatData._id) {
                if (selectChatType === "contact") {
                    // console.log(selectChatData);
                    const messages = await getAllMessages(selectChatData.chatId, token);
                    dispatch(setSelectChatMessages(messages));
                }
            }
        };
        const fetchChannelMessages = async () => {
            if (selectChatData._id) {
                const messages = await getChannelMessages(selectChatData._id, token);
                // console.log(messages);
                dispatch(setSelectChatMessages(messages));
            }
        };
        if (selectChatType === "channel") {
            fetchChannelMessages()
        } else {
            fetchMessages();
        }
    }, [selectChatData, selectChatType, dispatch, token]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [selectChatMessages]);

    const fileDownload = async (url, name) => {
        const urlBlob = window.URL.createObjectURL(await fetch(url).then(r => r.blob()));
        const aTag = document.createElement('a');
        aTag.href = urlBlob;
        aTag.setAttribute('download', name);
        document.body.appendChild(aTag);
        aTag.click();
        aTag.remove();
        window.URL.revokeObjectURL(urlBlob);
    }

    const checkIfImage = (name) => name.match(/\.(jpeg|jpg|gif|png|bmp|tiff|tif|webp|svg|ico|heic|heif)$/) != null;
    const formatMessageTime = (timestamp) => {
        return moment(timestamp).format("hh:mm A");
    };


    // console.log(selectChatMessages);

    const renderContactMessage = (message) => {
        return (
            <>
                <div className={`${message.sender === selectChatData._id ? "text-left" : "text-right"}`}>
                    <div className="relative group">
                        {message.messageType === "text" && (
                            <div className={`${message.sender !== selectChatData._id ?
                                "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50" :
                                "bg-[#2a2b33]/5 text-white/80 border-white/20"
                                } border inline-block py-1 px-3 rounded my-1 max-w-[50%] break-words`}>
                                {message.content.length > 20 ? `${message.content.substring(0, 15)}   ...` : message.content}
                            </div>
                        )}
                        {message.messageType === "file" && (
                            <div className={`${message.sender !== selectChatData._id ?
                                "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50" :
                                "bg-[#2a2b33]/5 text-white/80 border-white/20"
                                } border inline-block py-1 px-3 rounded my-1 max-w-[60%] max-sm:max-w-[90%] break-words`}>
                                {checkIfImage(message.fileUrl.name) ?
                                    <div className="cursor-pointer">
                                        <img src={message?.fileUrl?.url}
                                            alt={message?.fileUrl?.name}
                                            height={300}
                                            width={300}
                                            className="object-fit"
                                            onClick={() => {
                                                setShowImage(true);
                                                handleOnChange(message.fileUrl);
                                            }}
                                        />
                                    </div> :
                                    <div className="flex items-center justify-center gap-4">
                                        <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                                            <ImFolderOpen />
                                        </span>
                                        <span>
                                            {message.fileUrl.name.length > 20 ?
                                                `${message.fileUrl.name.substring(0, 15)}   ...` : message.fileUrl.name}
                                        </span>
                                        <span
                                            className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                                            onClick={() => {
                                                dispatch(setDownload(true));
                                                fileDownload(message.fileUrl.url, message.fileUrl.name);
                                                dispatch(setDownload(false));
                                            }}
                                            disabled={isDownload}
                                        >
                                            {isDownload ?
                                                <BiLoaderAlt className='text-2xl text-neutral-300 loader font-extrabold' /> :
                                                <IoMdDownload />
                                            }
                                        </span>
                                    </div>}
                            </div>
                        )}

                        
                        {/* Options Pop-up */}
                        {/* {showOptionsFor === message._id && (
                            <div
                                ref={modalRef}
                                className="absolute right-0 -top-[200%] py-2 w-28 bg-white rounded-md shadow-xl z-20">
                                <span
                                    className="block mx-2 rounded px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 cursor-pointer"
                                    onClick={() => {
                                        setShowEdit(true);
                                    }}
                                >
                                    Edit
                                </span>
                                <span
                                    className="block  mx-2 rounded px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 cursor-pointer"
                                    onClick={() => {
                                        setShowDelete(true);
                                    }}
                                >
                                    Delete
                                </span>
                            </div>
                        )} */}
                    </div>

                    <div className="text-xs text-gray-600">
                        {formatMessageTime(message.createdAt)}
                    </div>
                </div>


                <Dialog open={showImage} onOpenChange={setShowImage}>
                    <DialogContent className="bg-[#1a1b20] border-none text-white flex flex-col px-12 py-7 rounded-lg">
                        <DialogHeader className="flex flex-col items-center gap-3">
                            <DialogTitle className="text-xl flex gap-5 items-center">
                                <span>{image.name}</span>
                                <span
                                    className="bg-slate-700 p-2 text-2xl rounded-full hover:bg-[#8417ff] cursor-pointer transition-all duration-300"
                                    onClick={() => {
                                        dispatch(setDownload(true));
                                        fileDownload(image.url, image.name);
                                        dispatch(setDownload(false));
                                    }}
                                    disabled={isDownload}
                                >
                                    {isDownload ?
                                        <BiLoaderAlt className='text-2xl text-neutral-300 loader font-extrabold' /> :
                                        <IoMdDownload />
                                    }
                                </span>
                            </DialogTitle>
                            <div className="flex justify-center">
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


    const renderChannelMessage = (message) => {
        return (
            <>
                <div className={`relative mt-5 ${message.sender._id !== user._id ? "text-left" : "text-right"}`}>
                    <div className="relative group ">
                        {message.messageType === "text" && (
                            <div className={`${message.sender._id === user._id ?
                                "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50" :
                                "bg-[#2a2b33]/5 text-white/80 border-white/20"
                                } border inline-block py-1 px-3 rounded my-1 max-w-[50%] break-words ml-9`}>
                                {message.content.length > 15 ? `${message.content.substring(0, 15)}   ...` : message.content}
                            </div>
                        )}
                        {message.messageType === "file" && (
                            <div className={`${message.sender._id === user._id ?
                                "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50" :
                                "bg-[#2a2b33]/5 text-white/80 border-white/20"
                                } border inline-block py-1 px-3 rounded my-1 max-w-[60%] max-sm:max-w-[90%] break-words`}>
                                {checkIfImage(message.fileUrl.url) ?
                                    <div className="cursor-pointer">
                                        <img src={message.fileUrl.url}
                                            alt={message.fileUrl.name}
                                            height={300}
                                            width={300}
                                            className="object-fit"
                                            onClick={() => {
                                                setShowImage(true);
                                                handleOnChange(message.fileUrl);
                                            }}
                                        />
                                    </div> :
                                    <div className="flex items-center justify-center gap-4">
                                        <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                                            <ImFolderOpen />
                                        </span>
                                        <span>
                                            {message.fileUrl.name.length > 20 ?
                                                `${message.fileUrl.name.substring(0, 15)}   ...` : message.fileUrl.name}
                                        </span>
                                        <span
                                            className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                                            onClick={() => {
                                                dispatch(setDownload(true));
                                                fileDownload(message.fileUrl.url, message.fileUrl.name);
                                                dispatch(setDownload(false));
                                            }}
                                            disabled={isDownload}
                                        >
                                            {isDownload ?
                                                <BiLoaderAlt className='text-2xl text-neutral-300 loader font-extrabold' /> :
                                                <IoMdDownload />
                                            }
                                        </span>
                                    </div>}
                            </div>
                        )}
                    </div>

                    {/* Timestamps and avatars */}
                    {message.sender._id !== user._id ? (
                        <div className="flex items-center justify-start gap-3 text-xs text-gray-600">
                            <Avatar className="w-6 h-6 object-cover rounded-full">
                                <AvatarImage
                                    src={message.sender.image.url}
                                    alt={message.sender.firstName}
                                    className="object-cover w-full h-full rounded-full"
                                />
                                <AvatarFallback
                                    className="w-6 h-6 object-cover rounded-full uppercase text-lg"
                                    alt={message.sender.firstName}
                                >
                                    {message.sender.firstName[0]}
                                </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-white/60">{message.sender.firstName} {message.sender.lastName}</span>
                            <span className="text-xs text-white/60">{formatMessageTime(message.createdAt)}</span>
                        </div>
                    ) : (
                        <div className="text-xs mt-1 text-white/60">
                            {formatMessageTime(message.createdAt)}
                        </div>
                    )}
                </div>
            </>
        );
    };

    const renderMessages = () => {
        let lastDate = null;
        // console.log(selectChatMessages);
        // console.log(typeof new Date().getDate())
        // const time = new Date().getDate()
        return selectChatMessages?.map((message) => {
            const date = moment(message.updatedAt).format("YYYY-MM-DD");
            // console.log(message)
            const showDate = date !== lastDate;
            lastDate = date;
            return (
                <div key={message._id}>
                    {showDate && (
                        <div className="text-center text-gray-500 my-2">
                            {/* {console.log(time===Number(message.timestamp.split('T')[0].split("-")[2]))} */}
                            {/* {time == message?.timestamp.split('T')[0].split("-")[2] ? "": moment(message?.timestamp).format('LL')} */}
                            {moment(message.updatedAt).format("LL")}
                        </div>
                    )}
                    {selectChatType === "contact" && renderContactMessage(message)}
                    {selectChatType === "channel" && renderChannelMessage(message)}
                </div>
            );
        });
    };

    return (
        <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[78vw] w-full">
            {renderMessages()}
            <div ref={scrollRef} />
        </div>
    );
};

export default MessageContainer;