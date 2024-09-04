import {Router} from 'express';
import {signUp, login, sendOtp, resetPasswordToken, resetPassword} from '../controllers/auth.js';

const authRoute = Router();
authRoute.post('/signup', signUp);
authRoute.post('/login', login);
authRoute.post('/sendotp', sendOtp);
authRoute.post('/reset-password-token', resetPasswordToken)
authRoute.post('/reset-password', resetPassword)
export default authRoute;