import {Router} from 'express';
import {signUp, login, sendOtp, resetPasswordToken, resetPassword, reLogin, logout} from '../controllers/auth.js';
import {auth} from '../middlewares/auth.js';

const authRoute = Router();
authRoute.post('/signup', signUp);
authRoute.post('/login', login);
authRoute.post('/sendotp', sendOtp);
authRoute.post('/reset-password-token', resetPasswordToken)
authRoute.post('/reset-password', resetPassword)
authRoute.post('/refresh', reLogin);
authRoute.get('/logout',auth, logout);
export default authRoute;