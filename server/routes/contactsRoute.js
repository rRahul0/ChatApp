import {Router} from 'express';
import {searchContacts, getContactsDM} from '../controllers/contacts.js';
import {auth} from '../middlewares/auth.js';

const contactsRoute = Router();
contactsRoute.post('/search-contacts', auth, searchContacts);
contactsRoute.get('/get-contacts-dm', auth, getContactsDM);
export default contactsRoute;   