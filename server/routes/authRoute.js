import {Router} from 'express';
import {signUp, login} from '../controllers/auth.js';

const authRoute = Router();
authRoute.post('/signup', signUp);
authRoute.post('/login', login);

export default authRoute;