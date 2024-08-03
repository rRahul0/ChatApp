import {Router} from 'express';
import {auth} from '../middlewares/auth.js';
import { getUserChannels, getChannelMessages } from '../controllers/channel.js';

const channelsRoute = Router();
channelsRoute.get('/get-channels', auth, getUserChannels);
channelsRoute.post('/get-channel-messages', auth, getChannelMessages);
export default channelsRoute;   