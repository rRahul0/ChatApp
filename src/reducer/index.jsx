import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import profileReducer from '../slices/profileSlice';
import chatReducer from '../slices/chatSlice';

const rootReducer = combineReducers({
    auth: authReducer,
    profile: profileReducer,
    chat: chatReducer,
})
export default rootReducer;