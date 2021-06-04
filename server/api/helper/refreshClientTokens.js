// Importações.
    const { default: axios } = require('axios');

// Exportação.
/**
 * 
 * @returns Atualiza os tokens de acesso da aplicação e retorna o Access Token renovado, para continuar as requisições.
 */
module.exports = () => {
    return axios.post(`http://localhost:3000/autenticacoes/apis/refresh`, {
        refreshToken: process.env.CLIENT_RT
    })
    .then(async (res) => {

        console.log('refreshClientToken Response:', res);

        if (res.status == 200 && res.data?.client_accessToken){
            process.env.CLIENT_AT = res.data.client_accessToken;
            process.env.CLIENT_RT = res.data.client_refreshToken;
            return { accessToken: res.data.client_accessToken };
        } else {
            return res;
        }
        
    })
    .catch((error) => {
        console.log('refreshClientToken error:', error);
        if (error?.response?.data?.error){

            if (error.response.data.error.code === 'INVALID_CLIENT_REFRESH'){
                return 'INVALID_CLIENT_REFRESH';
            }

            if (error.response.data.error.code === 'EXPIRED_CLIENT_REFRESH'){
                // Se o Refresh Token do Cliente estiver expirado, renove-o autenticand-se novamente.
                axios.get(`http://localhost:3000/autenticacoes/apis/login/?cliente=${process.env.MY_REST_APP_ID}&senha=${process.env.MY_REST_APP_PASS}`)
                .then(async (res) => {

                    if (res.status == 200 && res.data?.client_accessToken){
                        process.env.CLIENT_AT = res.data.client_accessToken;
                        process.env.CLIENT_RT = res.data.client_refreshToken;
                        console.log('A aplicação se autenticou na REST Pet Adote novamente, o refresh token estava expirado.');
                        return { accessToken: res.data.client_accessToken };
                    } else {
                        console.error('Não foi possível re-autenticar a aplicação na REST Pet Adote. Recebemos a seguinte resposta...', res);
                        return res;
                    }
                    
                })
                .catch((error) => {
                    console.error('Reautenticacao Cliente - Response Error?', error?.response?.data);
                    console.error('Reautenticacao Cliente - Req Setup Error Message:', error?.message);
                });
            }

            return error.response.data.error
        }

        console.error('Response Error?', error?.response?.data);
        console.error('Req Setup Error Message:', error?.message);
        return error;
        
    });
}