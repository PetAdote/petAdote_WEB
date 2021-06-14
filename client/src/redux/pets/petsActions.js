import * as petsActionTypes from './petsTypes'
import { openSnackbar } from '../actions';
import axios from '../../helpers/axiosInstance';

// Action Creators.
export const fetchPetsRequest = () => {
    return {
        type: petsActionTypes.FETCH_PETS_REQUEST
    }
}

export const fetchPetsSuccess = (requestResponse) => {
    return {
        type: petsActionTypes.FETCH_PETS_SUCCESS,
        payload: requestResponse
    }
}

export const fetchPetsFailure = (error) => {
    return {
        type: petsActionTypes.FETCH_PETS_FAILURE,
        payload: error
    }
}

export const clearPets = () => {
    return {
        type: petsActionTypes.CLEAR_PETS
    }
}

// Async Action Creators.
export const fetchPets = ({
    ownerId,
    filters = { 
        bySpecie: undefined,
        byStatus: undefined,
        byName: undefined
    },
    page = 1,
    limit = 10,
}={}) => {

    return (dispatch) => {

        dispatch( fetchPetsRequest() );

        axios.get(`/usuarios/animais/?getAllFromUser=${ownerId}`, {
            params: {
                bySpecie: filters.bySpecie,
                byStatus: filters.byStatus,
                byName: filters.byName,
                page: page,
                limit: limit
            }
        })
        .then((response) => {

            const pets = response.data?.animais;

            if (!pets || pets.length === 0){
                if (page > 1){
                    return dispatch( fetchPetsFailure('PETS_LIST_ENDED') );
                }
                return dispatch( fetchPetsFailure('PETS_LIST_IS_EMPTY') );
            } else {
                return dispatch( fetchPetsSuccess(response.data) );
            }

        })
        .catch((error) => {

            const errorMsg = error?.response?.data?.mensagem || error?.message || 'UNKNOWN_ERROR';

            if (error.response?.data?.mensagem){
                return dispatch( openSnackbar(error.response.data.mensagem, 'info') );
            }

            console.log('[petsActions] unexpected error:', error?.response || error?.message );
            return dispatch( fetchPetsFailure(errorMsg) );

        });

    }

}