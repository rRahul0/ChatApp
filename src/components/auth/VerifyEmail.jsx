import React, { useEffect, useState } from 'react';
import OTPInput from 'react-otp-input';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { sendOtp, signUp } from '../../services/operations/authApi';
import { FaArrowAltCircleLeft } from "react-icons/fa";
import Loader from '../common/Loader';
import { RxCountdownTimer } from "react-icons/rx";

export default function VerifyEmail() {
    const [otp, setOtp] = useState("");
    const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { signupData, loading } = useSelector((state) => state.auth);
    
    useEffect(() => {
        if (!signupData) {
            navigate("/signup");
        }
    }, []);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
        } = signupData;
        dispatch(signUp(
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            otp,
            navigate
        ));
    };

    const handleResendOtp = () => {
        dispatch(sendOtp(signupData.email, navigate));
        setTimeLeft(120); // Reset the timer to 2 minutes
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    return (
        <div className='text-white h-screen flex justify-center items-center bg-[#2a2b33] '>
            {
                loading ? (<Loader />) :
                    (
                        <div className='w-full sm:w-[450px] h-[400px] flex flex-col gap-6 p-5 sm:p-4 lg:p-8 rounded-2xl bg-[#181a20] shadow-xl shadow-slate-600'>
                            <h1 className='font-semibold text-3xl text-richblack-5'>Verify email</h1>
                            <p className='text-richblack-100 text-[1.125rem] leading-[1.625rem] my-4'>
                                A verification code has been sent to you. Enter the code below
                            </p>
                            <form onSubmit={handleSubmit} className=''>
                                <OTPInput
                                    value={otp}
                                    onChange={setOtp}
                                    numInputs={4}
                                    renderSeparator={<span>{"  "}</span>}
                                    renderInput={(props) => <input {...props}
                                        placeholder='-'
                                        style={{
                                            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                                        }}
                                        className="w-[40px] sm:w-[45px] lg:w-[50px] bg-black/40 border-0 rounded-[0.5rem] text-richblack-5 aspect-square text-center focus:border-0 focus:outline-2 focus:outline-[#8417ff]" />}
                                    containerStyle={{
                                        justifyContent: "space-between",
                                        gap: "0 2px",
                                    }}
                                />
                                
                                <button
                                    type="submit"
                                    className="w-full mt-6 rounded-[8px] bg-[#8417ff] py-[8px] px-[12px] font-medium text-richblack-900"
                                >Verify email</button>
                            </form>
                            <div className='mt-6 flex items-center justify-between p-2 sm:p-0'>
                                <div>
                                    <Link to="/login" className='text-richblack-5 flex items-center gap-x-2'>
                                        <FaArrowAltCircleLeft />
                                        <p>Back to login</p>
                                    </Link>
                                </div>
                                <div
                                    className={`text-blue-100 flex items-center gap-2 ${timeLeft > 0 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                    onClick={timeLeft === 0 ? handleResendOtp : null}
                                >
                                    <RxCountdownTimer />
                                    {timeLeft > 0 ? `Resend in ${formatTime(timeLeft)}` : 'Resend it'}
                                </div>
                            </div>
                        </div>
                    )
            }
        </div>
    )
}
