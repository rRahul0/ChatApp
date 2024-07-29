import {Router} from 'express';
import {searchContacts, getContactsDM, getAllContacts} from '../controllers/contacts.js';
import {auth} from '../middlewares/auth.js';

const contactsRoute = Router();
contactsRoute.post('/search-contacts', auth, searchContacts);
contactsRoute.post('/get-contacts-dm', auth, getContactsDM);
contactsRoute.get('/get-all-contacts', auth, getAllContacts);
export default contactsRoute;   