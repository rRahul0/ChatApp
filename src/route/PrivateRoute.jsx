import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
    const { token } = useSelector((state) => state.auth);
    if (token === null) return <Navigate to="/login" />;
    return children;
}
