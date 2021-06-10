import { combineReducers } from 'redux';

import userReducer from './user/userReducer';
import snackReducer from './snackbar/snackReducer';
import announcementsReducer from './announcements/announcementsReducer';
import petsReducer from './pets/petsReducer';

const rootReducer = combineReducers({
    user: userReducer,
    snackAlert: snackReducer,
    announcements: announcementsReducer,
    pets: petsReducer,
});

export default rootReducer;