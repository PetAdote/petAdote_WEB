import * as petsActionTypes from './petsTypes';

const initialState = {
    loading: false,
    pets: null,
    hasMore: false,
    error: ''
}

const reducer = (state = initialState, action) => {

    switch(action.type){
        case petsActionTypes.FETCH_PETS_REQUEST: 
            return {
                ...state,
                loading: true
            }

        case petsActionTypes.FETCH_PETS_SUCCESS:

            console.log('[petsReducer] payload:', action.payload.animais);

            let refreshedPayload = state.pets || action.payload.animais;
            let duplicates = [];

            if (state.pets){

                action.payload.animais.forEach((newPet, newPetIndex) => {
                    state.pets.forEach((pet) => {
                        if (newPet.cod_animal === pet.cod_animal){
                            duplicates.push(newPetIndex);
                        }
                    });
                });

                action.payload.animais.forEach((pet, index) => {
                    if (!duplicates.includes(index)){
                        refreshedPayload.push(pet);
                    }
                });
            }

            console.log('[petsReducer] refreshedPayload:', refreshedPayload);

            return {
                ...state,
                loading: false,
                pets: refreshedPayload,
                hasMore: action.payload.avancar_pagina ? true : false,
                error: ''
            };

        case petsActionTypes.FETCH_PETS_FAILURE:
            return {
                ...state,
                loading: false,
                hasMore: false,
                error: action.payload
            }
        case petsActionTypes.CLEAR_PETS:
            return state = initialState;
        default:
            return state;
    }

}

export default reducer;