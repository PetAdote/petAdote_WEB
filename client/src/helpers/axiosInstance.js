// Importações.
import axios from 'axios';

import { store } from '../redux/store';
import { clearUser } from '../redux/actions'

// Configurações básicas.

    /**
     * @default axiosInstance = axios.create({
     *      baseURL: 'http://localhost:3000'    // Essa instância, por padrão realizará chamadas na REST API.
     * });
     * @summary Quando for chamar end-points de outros domínios, declare o domínio nas configurações do axios alterando a propriedade "baseURL". O exemplo abaixo é equivalente à "axios.get("http://localhost:4000/auth/refresh") ".
     * @example axios.get('/auth/refresh', { 
     *      baseURL: 'http://localhost:4000'
     * });
     */
    const axiosInstance = axios.create({
        baseURL: 'http://localhost:3000'    // Essa instância, por padrão realizará chamadas na REST API.
    });

    axiosInstance.interceptors.response.use(null, (error) => {

        const { code } = error?.response?.data;

        console.log('Error axiosInstance Front-End:', error.response);

        if (code === 'EXPIRED_USER_AUTH' || code === 'AUTH_HEADER_NOT_SENT'){

            return axiosInstance.get('/auth/refresh', {
                baseURL: 'http://localhost:4000',           // Domínio do Back-end da aplicação.
                withCredentials: true   // Envia os cookies httpOnly contendo o refreshToken do usuário.
            })
            .then((response) => {
                if (response.data.renewed_accessToken){ // Retorna os tokens renovados do usuário após verificação do back-end.
                    
                    console.log('Os tokens do usuário foram renovados...', response.data);

                    // Se o usuário não possuia a Authorization no cabeçalho das requisições,
                    // mas teve os Tokens renovados, ele já estava logado...
                    // Aplique Authorization no cabeçalho das próximas requisições com essa instância do axios.
                    axiosInstance.defaults.headers.common = { 'Authorization': `Bearer ${response.data.renewed_accessToken}` };
                    console.log('axiosInstance DH:', axiosInstance.defaults.headers);
                    console.log('errConfig', error.config);

                    error.config.headers['Authorization'] = `Bearer ${response.data.renewed_accessToken}`;
                    return axiosInstance.request(error.config); // action "fetchUser()"; finaliza o processo de renovação do usuário no front-end.

                }
                
                console.log('Front AxiosInstance - Resposta inesperada ao renovar os tokens de acesso:', response);

                if (response.data === 'USER_REFRESH_NOT_FOUND'){
                    console.log('O refresh do usuário não foi recebido no servidor de autenticação. Desconectando o usuário.');
                    return Promise.reject( store.dispatch( clearUser() ) );
                }

                return Promise.reject( new Error('Algo inesperado aconteceu ao renovar os tokens expirados do usuário.') );

            })
            .catch((error) => {

                if (error){
                    // Se qualquer erro detectado pelo middleware do back-end impossibilitar a renovação do usuário...
                    // console.log('[axiosInstance - Front-End Catch] - ', error?.response || error?.message);
                    // console.log('Não foi possível renovar os tokens do usuário. Os dados do usuário serão removidos do local storage.');
                    console.log('Front AxiosInstance catchBlock:', error?.response?.data || error?.message);
                    console.log('Error details: ', error.response);
                    if (error.response?.data?.code === 'RESOURCE_NOT_FOUND'){
                        return Promise.reject( new Error(error.response.data.mensagem || 'UNKNOWN_ERROR') );
                    }
                    
                    return Promise.reject( new Error(error.response || error.message) );
                }

            })
        }

        if (error.response.data === 'FAILED_TO_REFRESH'){
            console.log('Não foi possível renovar o acesso do usuário, talvez ele se autenticou em outra aplicação Pet Adote.');
            return Promise.reject( store.dispatch( clearUser() ) );
        }

        // console.log('Front AxiosInstance - Erro inesperado:', error.response);
        return Promise.reject(error);

    })

// Exportações.
export default axiosInstance;