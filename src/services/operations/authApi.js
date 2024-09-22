import { toast } from "react-hot-toast"
import { AuthEndpoints } from "../apis"
import { setLoading } from "../../slices/authSlice"
import { apiConnector } from "../apiConnector"
import { setToken } from "../../slices/authSlice"
import { setUser } from "../../slices/profileSlice"



const { LOGIN_API, SIGNUP_API, SENDOTP_API, RESETPASSTOKEN_API, RESETPASSWORD_API } = AuthEndpoints

export function sendOtp(email, navigate) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true))
        try {
            const response = await apiConnector("POST", SENDOTP_API, { email })
            // console.log("SENDOTP API RESPONSE............", response)


            if (!response.data.success) throw new Error(response.data.message)

            toast.success("OTP Sent Successfully")
            navigate("/verify-email")
        } catch (error) {
            console.log("SENDOTP API ERROR............", error)
            toast.error("Could Not Send OTP")
        }
        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}

export function signUp(
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    otp,
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
                otp,
            })

            // console.log("SIGNUP API RESPONSE............", response)

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

            // console.log("LOGIN API RESPONSE............", response)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            toast.success("Login Successful")
            dispatch(setToken(response.data.token))
            dispatch(setUser(response.data.user))
            localStorage.setItem("token", JSON.stringify(response.data.token))
            localStorage.setItem("user", JSON.stringify(response.data.user))

            navigate("/")
        } catch (error) {
            console.log("LOGIN API ERROR............", error)
            toast.error(error.response.data.message)
        }
        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}

export function getPasswordResetToken(email, setEmailSent) {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const response = await apiConnector("POST", RESETPASSTOKEN_API, {
                email,
            })

            console.log("RESETPASSTOKEN RESPONSE............", response);

            if (!response.data.success) {
                throw new Error(response.data.message);
            }
            // toast.dismiss(toastId);
            toast.success("Reset Email Sent");
            setEmailSent(true);
        } catch (error) {
            console.log("RESETPASSTOKEN ERROR............", error);
            // toast.dismiss(toastId);
            toast.error("Failed To Send Reset Email");
        }
        dispatch(setLoading(false));
    }
}
export function resetPassword(password, confirmPassword, token, navigate) {
    // const navigate=useNavigate();
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true))
        try {

            const response = await apiConnector("POST", RESETPASSWORD_API, {
                password,
                confirmPassword,
                token,
            })

            console.log("RESETPASSWORD RESPONSE............", response)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            toast.success("Password Reset Successfully")
            navigate("/login")
        } catch (error) {
            console.log("RESETPASSWORD ERROR............", error)
            toast.error("Failed To Reset Password")
        }
        toast.dismiss(toastId)
        dispatch(setLoading(false))
    }
}

export function logout(navigate, token) {
    return async (dispatch) => {
        try{
        //clear cookies
        const response = await apiConnector("GET", AuthEndpoints.LOGOUT_API, null, { 'Authorization': `Bearer ${token}` }) 
        console.log("LOGOUT API RESPONSE............", response)
        if (!response.data.success) {
            throw new Error(response.data.message)
        }
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        dispatch(setToken(null))
        dispatch(setUser(null))
        navigate("/login")
        } catch (error) {
            console.log("LOGOUT API ERROR............", error)
            toast.error("Failed To Logout")
        }
    }
}