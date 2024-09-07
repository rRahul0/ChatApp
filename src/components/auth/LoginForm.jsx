

import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { login } from "../../services/operations/authApi";

const guestEmail = import.meta.env.VITE_GUEST_EMAIL
const guestPassword = import.meta.env.VITE_GUEST_PASSWORD

function LoginForm({ admin }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [showPassword, setShowPassword] = useState(false)

  const { email, password } = formData

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }

  const handleOnSubmit = (e) => {
    e.preventDefault()
    dispatch(login(email, password, navigate))
    setFormData({
      email: "",
      password: "",
    })
  }

  return (
    <form
      onSubmit={handleOnSubmit}
      className="mt-6 flex w-full flex-col gap-y-4 "
    >
      <label className="w-full flex flex-col items-start">
        <p className="mb-1 text-[0.875rem] leading-[1.375rem] ">
          Email Address <sup className="text-pink-200">*</sup>
        </p>
        <input
          required
          type="text"
          name="email"
          value={email}
          onChange={handleOnChange}
          placeholder="Enter email address"
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
          className="w-full rounded-[0.5rem] bg-[#141414] p-[12px] focus:bg-[#141414] "
        />
      </label>

      <div>
        <label className="relative flex flex-col items-start">
          <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
            Password <sup className="text-pink-200">*</sup>
          </p>
          <input
            required
            type={showPassword ? "text" : "password"}
            name="password"
            value={password}
            onChange={handleOnChange}
            placeholder="Enter Password"
            style={{
              boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
            }}
            className="w-full rounded-[0.5rem] bg-[#141414] p-[12px] pr-12 text-richblack-5"
          />
          <span
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-[38px] z-[10] cursor-pointer"
          >
            {showPassword ? (
              <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
            ) : (
              <AiOutlineEye fontSize={24} fill="#AFB2BF" />
            )}
          </span>
        </label>
        <Link to="/forgot-password">
          <p className="mt-1 ml-auto max-w-max text-xs text-blue-400">
            Forgot Password
          </p>
        </Link>
      </div>

      <button
        type="submit"
        className="mt-6 rounded-[8px] bg-[#8417ff] text-xl py-[8px] px-[12px] font-medium text-richblack-900"
      >
        Sign In
      </button>
      <button
        onClick={() => {
          console.log("GUEST LOGIN", guestEmail, guestPassword)
          dispatch(login(guestEmail, guestPassword, navigate))
        }}
        className="mt-2 rounded-[8px] bg-[#5c4092] text-xl py-[8px] px-[12px] font-medium text-richblack-900"
      >
        Login as Guest
      </button>
      <p>Don't have account? <Link to="/signup" className="text-blue-500">SignUp</Link></p>

    </form>
  )
}

export default LoginForm