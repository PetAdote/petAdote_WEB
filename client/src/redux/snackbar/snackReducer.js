import * as snackbarActionTypes from './snackTypes';

const initialState = {
    isSnackbarOpen: false,
    severity: 'info',
    message: ''
}

const reducer = (state = initialState, action) => {

    switch(action.type){
        case snackbarActionTypes.OPEN_SNACKBAR_ALERT:
            return {
                ...state,
                isSnackbarOpen: true,
                severity: action.severity,
                message: action.message
            }
        case snackbarActionTypes.CLOSE_SNACKBAR_ALERT:
            return initialState;
        default:
            return state;
    }

}

export default reducer;
