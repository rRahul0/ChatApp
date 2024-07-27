import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { setToken } from '../slices/authSlice';
import { setUser } from '../slices/profileSlice';
import toast from 'react-hot-toast';

export default function PrivateRoute({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const localStorageData = localStorage.getItem("data");
    const expiry = localStorageData ? JSON.parse(localStorageData)?.expire : null;

    useEffect(() => {
        if (expiry && expiry < Date.now()) {
            toast.error("Session Expired");
            dispatch(setToken(null));
            dispatch(setUser(null));
            navigate('/login'); // Ensure to navigate to login if session expires
        }
    }, [navigate, location]);

    if (token === null) return <Navigate to="/login" />;
    return children;
}
