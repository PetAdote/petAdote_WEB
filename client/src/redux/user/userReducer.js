import * as userActionTypes from './userTypes';

const initialState = {
    loading: false,
    user: null,
    error: ''
}

const reducer = (state = initialState, action) => {

    switch(action.type){
        case userActionTypes.FETCH_USER_REQUEST:
            return {
                ...state,
                loading: true
            }
        case userActionTypes.FETCH_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                user: action.payload,
                error: ''
            }
        case userActionTypes.FETCH_USER_FAILURE:
            return {
                ...state,
                loading: false,
                user: null,
                error: action.payload
            }
        case userActionTypes.CLEAR_USER:
            return {
                ...state,
                user: null
            }
        default: 
            return state;
    }

}

export default reducer;