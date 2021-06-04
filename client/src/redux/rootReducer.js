import { combineReducers } from 'redux';

import userReducer from './user/userReducer';
import snackReducer from './snackbar/snackReducer';
import announcementsReducer from './announcements/announcementsReducer';

const rootReducer = combineReducers({
    user: userReducer,
    snackAlert: snackReducer,
    announcements: announcementsReducer
});

export default rootReducer;