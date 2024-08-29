import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { FaPlus } from "react-icons/fa";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { setSelectChatData, setSelectChatMessages, setSelectChatType, closeChat } from "@/slices/chatSlice";
import { searchContacts } from "@/services/operations/contactApi";

const NewDm = () => {
    const { selectChatData, selectChatType } = useSelector((state) => state.chat);
    const { token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [openNewContactModal, setOpenNewContactModal] = useState(false);
    const [searchedContact, setSearchedContact] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const searchContact = async (item) => {
        const user = await searchContacts(item, token);
        setSearchedContact(user);
    }

    //Debounce Effect
    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchTerm) searchContact(searchTerm);
            else setSearchedContact([]);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    const selectNewContact = async (contact) => {
        setOpenNewContactModal(false);

        // setSelectChatMessages([]);
        dispatch(setSelectChatType('contact'));
        dispatch(setSelectChatData(contact));
        setSearchedContact([]);
        // console.log("contact", contact);
            
    }
    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <FaPlus
                            className="text-neutral-500 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
                            onClick={() => setOpenNewContactModal(true)}
                        />
                    </TooltipTrigger>
                    <TooltipContent
                        className="bg-[#1b1c1e] border-none mb-2 p-3 text-white ">
                        Select new Contact
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal} >
                {/* <DialogTrigger>Open</DialogTrigger> */}
                <DialogContent className="bg-[#181920] border-none text-white max-sm:w-[85%] rounded-md  sm:w-[400px] h-[400px] flex flex-col ">
                    <DialogHeader>
                        <DialogTitle>Please Select a Contact</DialogTitle>
                        <DialogDescription>

                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <Input
                            placeholder="Search for a contact"
                            className="bg-[#2c2e3b] border-none p-6 rounded-lg"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <ScrollArea className="h-[250px] flex-1 mt-5">
                        <div className="flex flex-col gap-5 ">
                            {searchedContact?.map((contact) => (
                                <div
                                    onClick={() => selectNewContact(contact)}
                                    key={contact?._id}
                                    className="flex items-center gap-3 cursor-pointer">
                                    <div>
                                        <img src={contact?.image?.url} alt="profile" className="w-12 h-12 rounded-full" />
                                    </div>
                                    <div className="flex flex-col ">
                                        <span>
                                            {
                                                contact.firstName && contact.lastName ?
                                                    `${contact.firstName} ${contact.lastName}` : contact.email
                                            }
                                        </span>
                                        <span className="text-xs">{contact?.email}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                    {searchedContact?.length <= 0 && (
                        <div className="text-opacity-80 text-white absolute top-[50%] lg:text-4xl text-3xl transition-all duration-300 text-center">
                            <h3 className="poppins-medium">
                                Hi
                                <span className="text-purple-500">! </span>search new
                                <span className="text-purple-500"> contacts. </span>
                            </h3>
                        </div>
                    )}
                </DialogContent>
            </Dialog>


        </>
    );
}

export default NewDm;