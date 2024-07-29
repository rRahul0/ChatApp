import {Router} from 'express';
import { getMessages, uploadFile } from '../controllers/messages.js';
import {auth} from '../middlewares/auth.js';
import Message from '../models/Message.js';

const deleteMany = async (req, res) => {
    try {
        const data = await Message.deleteMany(req.body)
        res.status(200).json({data, message: 'All messages deleted successfully'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}
const messagesRoute = Router();
messagesRoute.post('/get-all-messages', auth, getMessages);
messagesRoute.post('/upload-file', auth, uploadFile);
messagesRoute.post('/dlt', deleteMany);



export default messagesRoute;   