import axios from '../../helpers/axiosInstance';
import * as userActionTypes from './userTypes';


// Action Creators.
export const fetchUserRequest = () => {
    return {
        type: userActionTypes.FETCH_USER_REQUEST
    }
}

export const fetchUserSuccess = (user) => {
    // Vamos passar "user" para a Reducer alterar a Storage de acordo com a Action Type.

    return {
        type: userActionTypes.FETCH_USER_SUCCESS,
        payload: user
    }
}

export const fetchUserFailure = (error) => {
    return {
        type: userActionTypes.FETCH_USER_FAILURE,
        payload: error
    }
}

export const clearUser = () => {
    return {
        type: userActionTypes.CLEAR_USER
    }
}

// Async Action Creators.
export const fetchUser = () => {
    
    return (dispatch) => {

        dispatch( fetchUserRequest() );

        axios.get('http://localhost:3000/usuarios/?get=self')
        .then((response) => {

            const user = response.data?.usuario
            dispatch( fetchUserSuccess(user) );

        })
        .catch((error) => {

            const errorMessage = error.message || '';
            dispatch( fetchUserFailure(errorMessage) );

        });
        
    }

}
