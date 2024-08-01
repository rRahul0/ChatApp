import { FaComments } from 'react-icons/fa'; // Import an icon from react-icons

const EmptyChatContainer = () => {
    return (
        <div className="flex-1 md:bg-[#1c1d25] md:flex flex-col justify-center items-center hidden text-center p-8 duration-1000 transition-all ">
            <FaComments className="text-6xl text-gray-500 mb-4" /> {/* Icon */}
            <h2 className="text-2xl text-white font-semibold mb-2">No Chat Selected</h2>
            <p className="text-gray-400">
                Select a conversation or start a new chat to see messages here.
            </p>
        </div>
    );
}

export default EmptyChatContainer;


