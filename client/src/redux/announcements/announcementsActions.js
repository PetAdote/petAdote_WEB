import * as announcementsActionTypes from './announcementsTypes';
import { openSnackbar } from '../actions';
import axios from '../../helpers/axiosInstance';

// Action Creators.
export const fetchAnnouncementsRequest = () => {
    return {
        type: announcementsActionTypes.FETCH_ANNOUNCEMENTS_REQUEST
    }
}

export const fetchAnnouncementsSuccess = (requestResponse) => {
    return {
        type: announcementsActionTypes.FETCH_ANNOUNCEMENTS_SUCCESS,
        payload: requestResponse
    }
}

export const fetchAnnouncementsFailure = (error) => {
    return {
        type: announcementsActionTypes.FETCH_ANNOUNCEMENTS_FAILURE,
        payload: error
    }
}

export const clearAnnouncements = () => {
    return {
        type: announcementsActionTypes.CLEAR_ANNOUNCEMENTS
    }
}

// Async Action Creators.
export const fetchAnnouncements = (page, limit = 10) => {

    return async (dispatch) => {

        dispatch( fetchAnnouncementsRequest() );

        await axios.get(`/anuncios/?getAll=open&activeOwner=1&page=${page}&limit=${limit}`)
        .then((response) => {

            // console.log('RESPONSE:', response);

            const announcements = response.data?.anuncios;

            // console.log('ANNOUNCEMENTS:', announcements);

            if (!announcements || announcements.length === 0){
                if (page > 1){
                    return dispatch( fetchAnnouncementsFailure('ANNOUNCEMENTS_LIST_ENDED') );
                }
                return dispatch( fetchAnnouncementsFailure('ANNOUNCEMENTS_ARE_EMPTY') );
            } else {

                return dispatch( fetchAnnouncementsSuccess(response.data) );
            }

        })
        .catch((error) => {

            console.log('ERROR:', error.response || error?.message );

            const errorMessage = error.response?.data?.mensagem || error?.message || '';

            if (error.response?.data?.mensagem){
                dispatch( openSnackbar(error.response.data.mensagem, 'info') );
            }
            return dispatch( fetchAnnouncementsFailure(errorMessage) );

        });

    }

}