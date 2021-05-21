// Importações.
const { default: axios } = require('axios');

    // Utilidades para os Interceptors.
    const refreshClientTokens = require('./refreshClientTokens');
    const refreshUserTokens = require('./refreshUserTokens_stash');

// Configurações básicas.

    /**
     * @default axiosInstance = axios.create({
     *      baseURL: 'http://localhost:3000'    // Essa instância, por padrão realizará chamadas na REST API.
     * });
     * @summary Quando for chamar end-points de outros domínios, declare o domínio nas configurações do axios alterando a propriedade "baseURL". O exemplo abaixo é equivalente à "axios.get("http://localhost:4000/auth/refresh") ".
     * @example axios.get('/todos/1', { 
     *      baseURL: 'https://jsonplaceholder.typicode.com'
     * });
     */
    const axiosInstance = axios.create({
        baseURL: 'http://localhost:3000'
    });     // Cria uma instância personalizada do axios.
            // Atenção, não atribua nenhuma configuração padrão além dos interceptors nessa instância.
            // Se não todos os usuários do sistema serão afetados, pois o server utiliza essa instância de forma global.
    
    axiosInstance.interceptors.response.use(null, (error) => {
        // Um interceptor é uma espécie de middleware que verifica a resposta de sucesso ou falha antes dos blocos .then ou .catch...
        // Permitindo que verificações e validações ocorram antes da requisição ser concluída ao fim.

        // console.log('Error received on request');
        // console.log(error.response.data);

        const { code } = error.response.data;
        
        // Se o Access Token da Aplicação expirar...
        if (code === 'EXPIRED_CLIENT_AUTH'){

            // 'refreshClientTokens()' é um helper que renova os Tokens e retorna o Token de Acesso do Cliente.
            return refreshClientTokens()
            .then((result) => { 
                // Se retornar o accessToken, a renovação aconteceu... Caso contrário, algo deu errado.

                // console.log('Axios Interceptors, Refresh Client Token Helper Result:', result);
                
                console.log('[ClientAuth Silent Refresh] A auth da aplicação expirou, iniciando renovação!');

                // Atualiza os cabeçalhos de configuração dessa requisição específica...
                if (result.accessToken){
                    error.config.headers.authorization = `Bearer ${result.accessToken}`;
                    return axios.request(error.config); // Retorna a configuração renovada para a requisição.
                }
                
                if (result === 'INVALID_CLIENT_REFRESH'){
                    return Promise.reject(new Error('O refresh token passado para a função de renovação é inválido.'));
                }

                return Promise.reject(new Error('Algo deu errado ao renovar o Token do Cliente.')); // erros desconhecidos.
                
            });
            
        }

        // Se o Access Token de um Usuário da Aplicação expirou, algo está muito errado, envie um alerta...
        if (code === 'EXPIRED_USER_AUTH'){

            // 'refreshUserTokens(refreshToken)' é um helper que recebe o refreshToken contido no httpOnly Cookie da requisição, 
            //  renova os Tokens e retorna o Token de Acesso do Usuário da aplicação renovado.

            console.error('[server_axiosInstance] A AUTENTICAÇÃO DO USUÁRIO EXPIROU!');
            console.error(error.config);
            
            // console.log('[UserAuth Silent Refresh] A auth do usuário expirou! Vamos super renová-la!');

            // return refreshUserTokens(error.config.userAuthRefresh)  // <-- Sim: É gambiarra hahaha.
            // .then((result) => {

            //     if (result.user_accessToken){
            //         error.config.headers.authorization = `Bearer ${result.user_accessToken}`;
            //         return axios.request(error.config);
            //     }

            //     if (result === 'INVALID_USER_REFRESH'){
            //         return Promise.reject(new Error('O refresh token passado para a função de renovação do usuário parece ser inválido.'));
            //     }

            //     return result

            // })

        }

        return Promise.reject(error);  // Se não retornou "axios.request(newConfig)" --- O erro é exibido no .catch da requisição.

    });

// Exportação.
module.exports = axiosInstance;
