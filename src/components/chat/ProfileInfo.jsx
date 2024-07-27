import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { FiEdit2 } from "react-icons/fi";
import { IoLogOut, IoPowerSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../services/operations/authApi";
import toast from "react-hot-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import {Button} from "@/components/ui/button";



const ProfileInfo = () => {
    const { user } = useSelector(state => state.profile);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [openLogoutModal, setOpenLogoutModal] = useState(false);
    const [openEditProfileModal, setOpenEditProfileModal] = useState(false);
    const logOut = () => {
        dispatch(logout(navigate));
        setOpenLogoutModal(false);
        toast.success("Logged out");
    }
    return (
        <>
            <div className="absolutte bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#2a2b33] ">
                <div className="flex gap-3 items-center justify-center ">
                    <div className="w-12 h-12 relative text-white">
                        <img
                            src={user.image.url}
                            alt="mcnbhdf"
                            className="w-full h-full object-cover rounded-full"
                        />
                    </div>
                    <div>
                        {user?.firstName && user?.lastName ?
                            `${user.firstName} ${user.lastName}` : ""}
                    </div>
                </div>
                <div className="flex gap-5 ">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <FiEdit2
                                    className="text-purple-500 text-xl font-medium"
                                    onClick={() => setOpenEditProfileModal(true)}
                                />
                            </TooltipTrigger>
                            <TooltipContent className="bg-[#1c1b1e] border-none text-white">Edit Profile</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <IoLogOut
                                    className="text-red-500 text-xl font-medium"
                                    onClick={()=>setOpenLogoutModal(true)}
                                />
                            </TooltipTrigger>
                            <TooltipContent className="bg-[#1c1b1e] border-none text-white">
                                Logout
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>


                </div>
            </div>
            <Dialog open={openLogoutModal} onOpenChange={setOpenLogoutModal} >
                {/* <DialogTrigger>Open</DialogTrigger> */}
                <DialogContent className="max-sm:w-[70%] sm:max-w-fit bg-[#181920] border-none text-white flex flex-col px-12 py-7 rounded-lg">
                    <DialogHeader className="flex flex-col gap-3">
                        <DialogTitle className="text-xl">Logout ...</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to logout?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-between max-sm:mt-7     sm:mt-2">
                        <Button 
                        className="bg-gray-800 rounded-md hover:scale-90 transition-all duration-300"
                        onClick={()=>setOpenLogoutModal(false)}>Cancel</Button>
                        <Button 
                        className="bg-[#8417ff] rounded-md flex items-center justify-center hover:bg-[#741bda] hover:scale-90 transition-all duration-300"
                        onClick={logOut}>Logout</Button>
                    </div>
                    
                </DialogContent>
            </Dialog>

            <Dialog open={openEditProfileModal} onOpenChange={setOpenEditProfileModal} >
                {/* <DialogTrigger>Open</DialogTrigger> */}
                <DialogContent className="max-sm:w-[70%] sm:max-w-fit bg-[#181920] border-none text-white flex flex-col px-12 py-7 rounded-lg">
                    <DialogHeader className="flex flex-col gap-3">
                        <DialogTitle className="text-xl">Profile</DialogTitle>
                        <DialogDescription>
                            This is your profile page {user?.firstName}
                        </DialogDescription>
                    </DialogHeader>
                    {/* <div className="flex justify-between max-sm:mt-7     sm:mt-2">
                        <Button 
                        className="bg-gray-800 rounded-md hover:scale-90 transition-all duration-300"
                        onClick={()=>setOpenLogoutModal(false)}>Cancel</Button>
                        <Button 
                        className="bg-[#8417ff] rounded-md flex items-center justify-center hover:bg-[#741bda] hover:scale-90 transition-all duration-300"
                        onClick={logOut}>Logout</Button>
                    </div> */}
                    
                </DialogContent>
            </Dialog>
        </>
    );
}

export default ProfileInfo;