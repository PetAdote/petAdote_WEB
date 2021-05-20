// Importações.
import axios from 'axios';

import { store } from '../redux/store';
import { clearUser } from '../redux/actions'

// Configurações básicas.
    const axiosInstance = axios.create();

    axiosInstance.interceptors.response.use(null, (error) => {

        const { code } = error?.response?.data;

        // console.log('Error axiosInstance Front-End:', error.response);

        if (code === 'EXPIRED_USER_AUTH' || code === 'AUTH_HEADER_NOT_SENT'){

            return axiosInstance.get('http://localhost:4000/auth/verify', {
                withCredentials: true
            })
            .then((response) => {
                if (response.data){
                    
                    console.log('Os tokens do usuário foram renovados...'/*, response.data*/);

                    // Se o usuário não possuia a Authorization no cabeçalho das requisições,
                    // mas teve os Tokens renovados, ele já estava logado...
                    // Aplique Authorization no cabeçalho das próximas requisições com essa instância do axios.
                    axiosInstance.defaults.headers['Authorization'] = `Bearer ${response.data.renewed_accessToken}`;

                    error.config.headers['Authorization'] = `Bearer ${response.data.renewed_accessToken}`;
                    return axiosInstance.request(error.config);

                }

                return Promise.reject(new Error('Algo inesperado aconteceu ao renovar os tokens expirados do usuário.', response));

            })
            .catch((error) => {

                if (error){
                    // Se qualquer erro detectado pelo middleware do back-end impossibilitar a renovação do usuário...
                    // console.log('[axiosInstance - Front-End Catch] - ', error?.response || error?.message);
                    // console.log('Não foi possível renovar os tokens do usuário. Os dados do usuário serão removidos do local storage.');
                    console.log('Front AxiosInstance:', error?.response?.data || error?.message);
                    
                    return Promise.reject( store.dispatch( clearUser() ) );
                }

            })
        }

        return Promise.reject(error);

    })

// Exportações.
export default axiosInstance;