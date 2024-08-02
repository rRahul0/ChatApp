import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { FaPlus } from "react-icons/fa";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { setSelectChatData, setSelectChatMessages, setSelectChatType, closeChat, addChannel } from "@/slices/chatSlice";
// import { searchContacts } from "@/services/operations/contactApi";
import { AllContacts, searchContacts } from "../../services/operations/contactApi";
import { Button } from '../../components/ui/button'
import MultipleSelector from "../ui/MultipleSelector";
import {createChannel} from "../../services/operations/channelApi";
import { useSocket } from "../../context/SocketContext";

const CreateChannel = () => {
    const { selectChatData, selectChatType, channels } = useSelector((state) => state.chat);
    const { token } = useSelector((state) => state.auth);
    const socket = useSocket();
    const { user } = useSelector(state => state.profile);
    const dispatch = useDispatch();
    const [openNewChannelModal, setOpenNewChannelModal] = useState(false);
    const [allContacts, setAllContacts] = useState([])
    const [selectedContacts, setSelectedContacts] = useState([])
    const [channelName, setChannelName] = useState("")

    useEffect(() => {
        const getData = async () => {
            const fetchedUsers = await AllContacts(token);
            setAllContacts(fetchedUsers)
            // console.log(fetchedUsers, allContacts)
        }
        getData()
    }, [])

    const createChannel = async () => {
        if (!channelName || !selectedContacts.length) return;
        if (searchContacts.length === 0) return;
        const members = selectedContacts.map(contact => contact.value);
        socket.emit("create-channel", { channelName, members, admin:user, token });
        // const res = await createChannel(channelName, selectedContacts, token);
        setOpenNewChannelModal(false);
        setChannelName("");
        setSelectedContacts([]);
        // console.log("res", res);
    }
   
    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <FaPlus
                            className="text-neutral-500 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
                            onClick={() => setOpenNewChannelModal(true)}
                        />
                    </TooltipTrigger>
                    <TooltipContent
                        className="bg-[#1b1c1e] border-none mb-2 p-3 text-white ">
                        Create New Channel
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <Dialog open={openNewChannelModal} onOpenChange={setOpenNewChannelModal} >
                <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col rounded-md">
                    <DialogHeader>
                        <DialogTitle>Please fill up the details for new channel.</DialogTitle>
                        <DialogDescription>

                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <Input
                            placeholder="Channel Name"
                            className="bg-[#2c2e3b] border-none p-6 rounded-lg placeholder:text-gray-500 w-full h-12 outline-none text-white"
                            onChange={e => setChannelName(e.target.value)}
                            value={channelName}
                        />
                    </div>
                    <div>
                        <MultipleSelector
                            className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white"
                            defaultOptions={allContacts}
                            placeholder="Search Contacts"
                            value={selectedContacts}
                            onChange={setSelectedContacts}
                            emptyIndicator={
                                <p className="text-center text-lg leading-10 text-gray-600 ">
                                    No Results Found
                                </p>
                            }
                        />
                    </div>
                    <div>
                        <Button 
                        className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300 "
                        onClick={createChannel}
                        >Create Channel</Button>
                    </div>

                </DialogContent>
            </Dialog>


        </>
    );
}

export default CreateChannel;