import * as announcementsActionTypes from './announcementsTypes';

const initialState = {
    loading: false,
    announcements: null,
    hasMore: false,
    error: ''
}

const reducer = (state = initialState, action) => {

    switch(action.type){
        case announcementsActionTypes.FETCH_ANNOUNCEMENTS_REQUEST:
            return {
                ...state,
                loading: true
            }
        case announcementsActionTypes.FETCH_ANNOUNCEMENTS_SUCCESS:

            let filteredAnnouncementsPayload = state.announcements || action.payload.anuncios;
            let duplicates = [];

            if (state.announcements){

                action.payload.anuncios.forEach((newAnnouncement, newAnnouncementIndex) => {
                    state.announcements.forEach((announcement) => {
                        
                        if(newAnnouncement.cod_anuncio === announcement.cod_anuncio){
                            // console.log(`duplicate @ index: [${newAnnouncementIndex}]`);
                            duplicates.push(newAnnouncementIndex);
                        }
                        
                    });
                });

                action.payload.anuncios.forEach( (announcement, index) => {

                    if (!duplicates.includes(index)){
                        filteredAnnouncementsPayload.push(announcement);
                    }

                });

                // console.log('UNIQUE?:', action.payload);

            };

            return {
                ...state,
                loading: false,
                announcements: filteredAnnouncementsPayload,
                hasMore: action.payload.avancar_pagina ? true : false,
                error: ''
            }

        case announcementsActionTypes.FETCH_ANNOUNCEMENTS_FAILURE:
            return {
                ...state,
                loading: false,
                hasMore: false,
                error: action.payload
            }
        default: 
            return state;
    }

}

export default reducer;