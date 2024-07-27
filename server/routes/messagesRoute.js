import {Router} from 'express';
import { getMessages, uploadFile } from '../controllers/messages.js';
import {auth} from '../middlewares/auth.js';

const messagesRoute = Router();
messagesRoute.post('/get-all-messages', auth, getMessages);
messagesRoute.post('/upload-file', auth, uploadFile);

export default messagesRoute;   