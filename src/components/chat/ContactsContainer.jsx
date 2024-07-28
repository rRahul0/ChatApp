import NewDm from "./NewDm";
import ProfileInfo from "./ProfileInfo";
import { setDmContacts } from "../../slices/chatSlice";
import { useSelector, useDispatch } from "react-redux";
import ContactList from "./ContactList";
import { useEffect } from "react";
import { AllContactsDm } from "../../services/operations/contactApi";
import CreateChannel from "./CreateChannel";


const ContactsContainer = () => {
    const { dmContacts } = useSelector((state) => state.chat);
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

        fetchUsers();
    }, []); // Only re-run if dispatch changes

    return (
        <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full flex flex-col justify-between">
            <div>
                <div className="pt-3">logo chat app</div>
                <div className="my-5">
                    <div className="flex items-center justify-between pr-10">
                        <Title title="Direct Messages" />
                        <NewDm />
                    </div>
                    <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
                        <ContactList contacts={dmContacts} isChannel={false} />
                    </div>
                </div>
                <div className="my-5">
                    <div className="flex items-center justify-between pr-10">
                        <Title title="Channels" />
                        <CreateChannel />
                    </div>
                </div>
            </div>
            <ProfileInfo />
        </div>
    );
};

const Title = ({ title }) => {
    return (
        <div className="uppercase tracking-widest text-neutral-400 text-sm font-light pl-10 text-opacity-90">{title}</div>
    );
};

export default ContactsContainer;
