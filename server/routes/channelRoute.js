import {Router} from 'express';
import {auth} from '../middlewares/auth.js';
import { createChannel, getUserChannels } from '../controllers/channel.js';

const channelsRoute = Router();
channelsRoute.post('/create-channel', auth, createChannel);
channelsRoute.get('/get-channels', auth, getUserChannels);
export default channelsRoute;   