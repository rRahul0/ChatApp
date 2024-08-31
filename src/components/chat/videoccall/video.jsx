import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSocket } from "../../../context/SocketContext";


const Video = ({data}) => {
    const socket = useSocket();
    const [call, setCall] = useState(false);
    const toggleCallModal = () => setCall(!call);
    const createCall = () => {
        toggleCallModal();
        socket.emit("create-call", {userId: data._id});
    }
    return (
        <>
            <div
                className="cursor-pointer border rounded-full px-2 py-0.5 "
                onClick={createCall}>
                V
            </div>
            <Dialog open={call} onOpenChange={toggleCallModal} >
                <DialogTitle>
                    <DialogHeader>
                    </DialogHeader>
                </DialogTitle>
                <DialogContent className="bg-[#181920]">
                    <div className="flex gap-5 justify-center items-center">
                        <button
                            className="bg-red-500 text-white px-3 py-1 rounded-md"
                            onClick={toggleCallModal}
                        >
                            Cancel
                        </button>
                        <button
                            className="bg-green-500 text-white px-3 py-1 rounded-md"
                            onClick={toggleCallModal}
                        >
                            Call
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default Video;