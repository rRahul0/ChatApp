import NewDm from "./NewDm";
import ProfileInfo from "./ProfileInfo";
import { setDmContacts, setChannels } from "../../slices/chatSlice";
import { useSelector, useDispatch } from "react-redux";
import ContactList from "./ContactList";
import { useEffect } from "react";
import { AllContactsDm, AllContacts } from "../../services/operations/contactApi";
import CreateChannel from "./CreateChannel";
import { getChannels } from "../../services/operations/channelApi";
import logo from "../../../public/logo.png"
import '../scroll.css'

const ContactsContainer = () => {
    const { dmContacts, channels } = useSelector((state) => state.chat);
    const { token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const fetchedUsers = await AllContactsDm(token);
                // console.log("Fetched users", fetchedUsers);
                dispatch(setDmContacts(fetchedUsers));
            } catch (error) {
                console.error("Failed to fetch users", error);
            }
        };
        const fetchChannels = async () => {
            try {
                const fetchedChannels = await getChannels(token);
                // console.log("Fetched Channels", fetchedChannels);
                dispatch(setChannels(fetchedChannels));
            } catch (error) {
                console.error("Failed to fetch users", error);
            }
        };
        fetchUsers();
        fetchChannels();
    }, []); 

    return (
        <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[22vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full flex flex-col justify-between ">

            <div>

                <div className="pt-3 flex items-center gap-2 pl-10">
                    <img src={logo} alt="logo" className="w-10  " />
                    <span className="text-2xl font-bold text-purple-500">NeoChat</span>
                </div>
                <div className="my-5">
                    <div className="flex items-center justify-between pr-10">
                        <Title title="Direct Messages" />
                        <NewDm />
                    </div>
                    <div className="max-h-[38vh] overflow-y-auto ">
                        <ContactList contacts={dmContacts} isChannel={false} />
                    </div>
                </div>
                <div className="my-5">
                    <div className="flex items-center justify-between pr-10">
                        <Title title="Channels" />
                        <CreateChannel />
                    </div>
                    <div className="max-h-[38vh] overflow-y-auto ">
                        <ContactList contacts={channels} isChannel={true} />
                    </div>
                </div>
            </div>
            <div className="">
                <ProfileInfo />
            </div>
        </div>
    );
};

const Title = ({ title }) => {
    return (
        <div className="uppercase tracking-widest text-neutral-400 text-sm font-light pl-10 text-opacity-90">{title}</div>
    );
};

export default ContactsContainer;
