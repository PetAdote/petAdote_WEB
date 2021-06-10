// Importações
import { useState, useEffect } from 'react';
import axios from '../helpers/axiosInstance';
import defaultAxios from 'axios';

// Custom Hook.
const usePetListSearch = (petListOwnerId, especie, estadoAdocao, nomePet, page, limit) => {

    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState(null);
    const [hasMore, setHasMore] = useState(false);
    const [error, setError] = useState(null);
    

    useEffect(() => {

        const CancelToken = defaultAxios.CancelToken;
        const source = CancelToken.source();

        axios({
            method: 'GET',
            url: `/usuarios/animais/?getAllFromUser=${petListOwnerId}`,
            params: {
                bySpecie: especie,
                byStatus: estadoAdocao,
                byName: nomePet,
                page: page,
                limit: limit
            },
            cancelToken: source.token
        })
        .then((response) => {

            setIsLoading(false);

            const petList = response.data.animais;

            if (!petList || petList.length === 0){
                if (page > 1) {
                    return setError('PET_LIST_ENDED');
                }
                return setError('PET_LIST_IS_EMPTY');
            }

            if (petList && response.data.avancar_pagina){
                setHasMore(true);
            } else {
                if (hasMore === true) {
                    setHasMore(false);
                }
            }

            setError(null);
            return setData(response.data);

            // console.log('[usePetListSearch] unexpected response:', response);
        })
        .catch((error) => {
            if (defaultAxios.isCancel(error)) {
                console.log('[usePetListSearch] Request canceled.');
                return setError('Request canceled.');
            }

            const errorMessage = error.response?.data?.mensagem || error?.message || '';

            setIsLoading(false);
            setData(null);
            setError(errorMessage);

            console.log('[usePetListSearch] unexpected error:', error.response?.data || error.response || error.message || 'UNKNOWN_ERROR');
        });

        // CleanUp Callback.
        return () => { 
            setError('Request canceled.');
            return source.cancel('[usePetListSearch] Operation canceled by the user.');
        }

    }, [petListOwnerId, especie, estadoAdocao, nomePet, page, limit, hasMore]);

    return { isLoading, data, error, hasMore }

};

// Exportações.
export default usePetListSearch;