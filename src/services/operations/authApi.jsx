import { toast } from "react-hot-toast"
import { AuthEndpoints } from "../apis"
import { setLoading } from "../../slices/authSlice"
import {apiConnector} from "../apiConnector"
import { setToken } from "../../slices/authSlice"
import { setUser } from "../../slices/profileSlice"



const { LOGIN_API, SIGNUP_API } = AuthEndpoints

export function signUp(
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    navigate
) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true))
        try {
            const response = await apiConnector("POST", SIGNUP_API, {
                firstName,
                lastName,
                email,
                password: confirmPassword,
            })

            console.log("SIGNUP API RESPONSE............", response)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            toast.success("Signup Successful")
            navigate("/login")
        } catch (error) {
            console.log("SIGNUP API ERROR............", error)
            toast.error("Signup Failed")
            navigate("/signup")
        }
        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}

export function login(email, password, navigate) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true))
        try {
            const response = await apiConnector("POST", LOGIN_API, { email, password })

            console.log("LOGIN API RESPONSE............", response)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            toast.success("Login Successful")
            dispatch(setToken(response.data.token))
            dispatch(setUser(response.data.user))
            localStorage.setItem("data", JSON.stringify({ token: response.data.token, expire: Date.now() + 1000 * 60 * 60 * 24 * 7 }))
            localStorage.setItem("user", JSON.stringify(response.data.user))
            
            navigate("/")
        } catch (error) {
            console.log("LOGIN API ERROR............", error)
            toast.error(error.message)
        }
        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}

export function logout(navigate) {
    return async (dispatch) => {
        localStorage.removeItem("data")
        localStorage.removeItem("user")
        dispatch(setToken(null))
        dispatch(setUser(null))
        navigate("/login")
    }
}