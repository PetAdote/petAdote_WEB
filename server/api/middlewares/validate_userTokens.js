// Importações...
    const jwt = require('jsonwebtoken');
    const axios = require('../helper/axiosInstance');


// Exportação...
/**
 * 
 * @description Middleware que realização a renovação silenciosa dos Tokens JWT (Access/Refresh) do Usuário, caso o Access Token esteja expirado. A renovação ocorre sempre que uma requisição do usuário é enviada ao back-end, atualizando os cabeçalhos da requisição (atual e futura) e o httpOnly cookie contendo o Refresh Token do usuário, caso necessário.
 */
module.exports = async (req, res, next) => {

    // console.log('MIDDLEWARE VALIDATE USER TOKEN...');
    // console.log('\nAuthorization Header: ', req.headers.authorization?.split(' ')[1]);
    // console.log('\nRefresh Cookie: ', req.cookies.auth_refresh);

    if (!req.cookies.auth_refresh){
        // Se a requisição não tiver o auth_refresh, o usuário possivelmente não se autenticou ainda.
        console.log('\n[validate_userTokens] Requisição de um usuário não autenticado.');

        if (req.url === '/auth/login'){ 
            // Se o usuário está se autenticando... Vá adiante.
            console.log('[validate_userTokens] O usuário está iniciando a autenticação.')
            return next();
        }

        return res.status(202).send('USER_REFRESH_NOT_FOUND'); // 202 - Accepted - A requisição foi aceita, podendo ou não ser processada. - Processamos com "USER_AUTH_NOT_FOUND".
    }

    // console.log(req.headers);

    if (req.headers.authorization){
        // Se a requisição do usuário já apresenta o httpOnly Cookie e possui um authorization header... 
        // Verifique se o AccessToken está expirado...
        // Se estiver expirado, a renovação acontecerá...
        // Se não estiver expirado, simplesmente continue a requisição...
        const decodedUserAT = jwt.decode(req.headers.authorization.split(' ')[1]);

        const now = new Date().getTime();
        const UserATExpInMS = new Date(decodedUserAT.exp * 1000).getTime();

        if (now < UserATExpInMS){
            console.log('\n[validate_userTokens] O token de acesso do usuário ainda é válido! Continuando requisição...');
            return next();
        } else {
            console.log('\n[validate_userTokens] O token de acesso do usuário não é mais válido! Renovando JWTs antes de continuar a requisição...');
        }
    }
    
    if (!req.headers.authorization){
        // A requisição não apresentou os cabeçalhos de autorização com o access token mas o usuário possui um refresh token (httpOnly Cookie), ou seja, estava autenticado anteriormente. Renovando JWTs antes de continuar a requisição...
        console.log('\n[validate_userTokens] A requisição possui apenas um httpOnly Cookie apresentando o refresh token. Iniciando tentativa de renovação dos JWTs antes de continuar a requisição...');
    }

    const refreshedTokens = await axios.post(`/autenticacoes/usuarios/refresh`, {
        refreshToken: req.cookies.auth_refresh
    }, {
        headers: {
            'Authorization': `Bearer ${process.env.CLIENT_AT}`  // O responsável pela renovação da autenticação do usuário é o cliente, portanto o auth do cliente deve ser passado nessa requisição.
        }
    })
    .then((response) => {
        if (response?.data){
            return response.data;   // Deverá conter os Tokens (Access/Refresh) do usuário.
        }
        return 'FAILED_TO_REFRESH_USER';
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

    if (refreshedTokens === 'FAILED_TO_REFRESH_USER' || refreshedTokens.error){
        // console.log('REFRESHED TOKENS:', refreshedTokens);

        console.log('\n[validate_userTokens] Por algum motivo não foi possível renovar os JWTs do Usuário...');

        return res.status(500)
        .clearCookie("auth_refresh")
        .send('FAILED_TO_REFRESH');       // Se não foi possível renovar os JWTs do usuário, enviará essa mensagem para o front. Trate ela nos interceptors do front, despachando "clearUser()" para a Redux Store.

        // return res.status(500).send('Algo deu errado ao renovar o acesso do usuário.');
    }

    const { user_accessToken, user_refreshToken } = refreshedTokens;
    const { inactiveUser_accessToken, inactiveUser_refreshToken } = refreshedTokens;

    // Início da renovação dos cabeçalhos de requisição e httpOnly Cookie.
        // Renova os dados do Access Token e o httpOnly Cookie para a continuação dessa requisição.
            req.headers.authorization = `Bearer ${user_accessToken || inactiveUser_accessToken}`
            req.cookies.auth_refresh = user_refreshToken || inactiveUser_refreshToken;

        // Renova o Access Token para as próximas requisições...    
            res.setHeader('Authorization', user_accessToken || inactiveUser_accessToken);

        // Configurando a persistência da autenticação do usuário com base na opção "Lembrar autenticação".
        
            // Capturando a data de expiração do Token para o httpOnly Cookie.
            const decodedRefresh = jwt.decode(user_refreshToken || inactiveUser_refreshToken);
            const now = new Date().getTime();
            const then = new Date(decodedRefresh.exp * 1000).getTime();
            const timeDifInMs = (then - now);
            const tokenExpirationDate = req.cookies.remember ? new Date(new Date().getTime() + timeDifInMs) : null;
                // Se ao logar, o usuário especificou que quer persistir a autenticação...
                // Mantenha controle da data de expiração do Refresh Token no httpOnly cookie.
                // Caso contrário, null = session only cookie.
            // Fim da captura da data de expiração do Token para o httpOnly Cookie.
            
        // Fim das configurações de persistência de autenticação do usuário.

        // Atualiza o httpOnly Cookie que contém o Refresh Token, renovando-o para as próximas requisições.
            res.cookie(
                "auth_refresh",
                user_refreshToken || inactiveUser_refreshToken, 
                {
                    sameSite: 'strict',
                    path: '/',
                    expires: tokenExpirationDate,
                    httpOnly: true,
                    // secure: true // O cookie só será passado via https.
                }
            );
        // Fim da atualização do httpOnly Cookie que contém o Refresh Token.

        // Verifica se o cookie de persistencia da autenticação do usuário foi enviado para atualizá-lo.
            if (req.cookies.remember){
                res.cookie(
                    'remember',
                    'true',
                    {
                        sameSite: 'strict',
                        path: '/',
                        expires: tokenExpirationDate,
                        httpOnly: true,
                        // secure: true // O cookie só será passado via https.
                    }
                );
            }
        // Fim da verificação do cookie de persistencia da autenticação do usuário

    // Fim da renovação do cabeçalho de requisições e httpOnly Cookie.

    // Quando a resposta da requisição for enviada depois desse Middleware, essas alterações entrarão em efeito.

    // console.log('Usuário renovado, passando requisição adiante...');
    // console.log('\nNovos headers...');
    // console.log('\nAuthorization Header: ', req.headers.authorization?.split(' ')[1]);
    // console.log('\nRefresh Cookie: ', req.cookies.auth_refresh);

    next();
}