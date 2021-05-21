/* Esse arquivo só estará aqui nos commits iniciais do projeto, por questão de documentação...
 É uma tentativa de renovação de tokens do usuário que falhou... 
 
 Nela identifiquei que não era possível enviar o Refresh Token do usuário
 (Contido em um httpOnly cookie do front-end, que se comunica apenas com este back-end)
 para a REST API uma vez que a REST aceita apenas um Authorization header na requisição.
 
 Além disso, também seria difícil e talvez impossível atualizar os tokens (Access/Refresh) do usuário
 no front-end quando a resposta da REST chegasse.

 Por isso, implementei o middleware "validate_userTokens", que monitorará todas as requisições
 com condições específicas, que permitirão a verificação e atualização desses dados essenciais
 que permitirão que o usuário, por meio do back-end, acesse os dados da REST API.
 */

// Importações.
const { default: axios } = require('axios');

// Exportação.
/**
 * 
 * @returns Atualiza os tokens de acesso de um usuário e retorna o Access Token renovado, para continuar as requisições.
 */
module.exports = (refreshToken) => {
    return axios.post(`http://127.0.0.1:3000/autenticacoes/usuarios/refresh`, {
        refreshToken: refreshToken
    }, {
        headers: {
            'Authorization': `Bearer ${process.env.CLIENT_AT}`
        }
    })
    .then(async (res) => {

        const user_accessToken = res.data?.user_accessToken || res.data?.inactiveUser_accessToken;

        if (res.status == 200 && user_accessToken){
            return { user_accessToken: user_accessToken };
        } else {
            return res;
        }
        
    })
    .catch((error) => {
        if (error?.response?.data){

            if (error.response.data.code === 'INVALID_USER_REFRESH'){
                return 'INVALID_USER_REFRESH';
            }

            if (error.response.data.code === 'EXPIRED_USER_REFRESH'){
                return 'EXPIRED_USER_REFRESH';
            }

            return error.response.data
        }

        console.error('Response Error?', error?.response?.data);
        console.error('Req Setup Error Message:', error?.message);
        return error;
        
    });
}