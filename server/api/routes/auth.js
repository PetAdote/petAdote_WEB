// Importações.
    
    const express = require('express');
    const router = express.Router();

    // Utilidades.
    const axios = require('../helper/axiosInstance');
    const jwt = require('jsonwebtoken');

    // const { default: axios } = require('axios');
    // const refreshCT = require('../helper/refreshClientTokens');

    // axios.interceptors.response.use(null, (error) => {
    //     // Um interceptor é uma espécie de middleware que verifica a resposta de sucesso ou falha antes dos blocos .then ou .catch...
    //     // Permitindo que verificações e validações ocorram antes da requisição ser concluída ao fim.

    //     console.log('Error received on request');

    //     if (error.response.data.code === 'ACCESS_NOT_ALLOWED'){

    //         // 'refreshCT()' é um helper que renova os Tokens de Acesso do Cliente.
    //         return refreshCT()
    //         .then((result) => {   // Se o bloco .then retornar a request da axios, a requisição será reiniciada.
    //             console.log('Axios Interceptors, Refresh Client Token Helper Result:', result);
    //             // Atualiza os cabeçalhos de configuração da requisição...
    //             error.config.headers.authorization = `Bearer ${process.env.CLIENT_AT}`
    //             return axios.request(error.config); // Retorna a configuração renovada para a requisição.
    //         });
    //     }

    //     return Promise.reject(error);  // Se não retornou "axios.request(newConfig)" --- O erro é exibido no .catch da requisição.

    // });

    // axios.interceptors.request.use((config) => {
    //     console.log(`${config.method.toUpperCase()} request sent to ${config.url} at ${new Date().toLocaleDateString()}`);
    //     return config;
    // }, (error) => {
    //     return Promise.reject(error);
    // })

// Rotas.
router.post('/login', async (req, res, next) => {

    const { email, password } = req.body;

    if (!email || !password){
        return res.status(400).send('EMPTY_FIELDS');
    }

    axios.post('http://localhost:3000/autenticacoes/usuarios/login', {
        email: email,
        senha: password
    }, {
        headers: {
            'Authorization': `Bearer ${process.env.CLIENT_AT}`
        }
    })
    .then((response) => {
        if (response.data){
            // Contém os Tokens JWT do usuário (Access/Refresh).
            // console.log('Response Data: ', response.data);

            // Capturando a data de expiração do Token para o httpOnly Cookie.
            const decodedRefresh = jwt.decode(response.data.user_refreshToken || response.data.inactiveUser_refreshToken);
            const now = new Date().getTime();
            const then = new Date(decodedRefresh.exp * 1000).getTime();
            const timeDifInMs = (then - now);
            const tokenExpirationDate = new Date(new Date().getTime() + timeDifInMs)
            // Fim da captura da data de expiração do Token para o httpOnly Cookie.

            return res.status(200)
            .cookie(
                "auth_refresh",
                response.data.user_refreshToken || response.data.inactiveUser_refreshToken, 
                {
                    sameSite: 'strict',
                    path: '/',
                    expires: tokenExpirationDate,
                    httpOnly: true,
                    // secure: true // O cookie só será passado via https.
                }
            )
            .send(response.data);
            
        } else {
            console.log('Response Status: ', response.status);
        }
    })
    .catch((error) => {
        console.log('Error Message: ', error?.message);
        
        if (error.response?.data){
            console.log('Error Response Data: ', error.response.data);
            return res.status(400).send(error.response.data);
        } else if (error.request) {
            console.log('Request Error: ', error.request);
        } else {
            console.log(error);
        }
        
    });

    // return res.status(200).send('Usuário logado?');

    // Essa rota enviará alguns cookies para o navegador do usuário.
    // return res.status(200)
    //     .cookie(
    //         "Name",
    //         "My name as value in the httpOnly Cookie", 
    //         {
    //             sameSite: 'strict',
    //             path: '/',
    //             expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    //             httpOnly: true,
    //             // secure: true // O cookie só será passado via https.
    //         }
    //     )
    //     .send('Cookie starting.');

});

router.get('/logout', async (req, res, next) => {

    // console.log(req.headers.authorization.split(' ')[1]);

    // console.log('Client AT:', process.env.CLIENT_AT);
    // console.log('Client RT:', process.env.CLIENT_RT);
    // console.log('User AT:', req.headers.authorization.split(' ')[1]);
    // console.log('\nUser RT:', req.cookies.auth_refresh);

    // return res.status(200).send('Token Verifications to Logout...');
    // -------------------------------------------------------------

    let userAccessToken = undefined;

    if (req.headers?.authorization){
        userAccessToken = req.headers.authorization.split(' ')[1];
        // console.log('\nAuthLogoutAccToken:', userAccessToken);
    }

    if ( !(userAccessToken && req.cookies.auth_refresh) ){
        return res.status(401).send('USER_NOT_AUTHENTICATED');
    }

    // console.log(userAccessToken);
    // return res.status(200).send('Oi');

    axios.delete('http://localhost:3000/autenticacoes/usuarios/logout', {
        headers: {
            'Authorization': `Bearer ${userAccessToken}`
        },
        data: {
            refreshToken: req.cookies.auth_refresh
        }
        // userAuthRefresh: `${req.cookies.auth_refresh}`
    })
    .then((response) => {
        if (response?.status === 200){

            // Usuário desconectado e Refresh Token descartado com sucesso!
            // Descartando os Cookies...
            return res.status(200)
                .clearCookie("auth_refresh")
                .send('USER_DISCONNECTED_SUCCESSFULLY');    // Mensagem enviada para o front quando o usuário for desconectado com sucesso... Despache "clearUser()" para a Redux Store.
            
        } 

        return console.log(response);
    })
    .catch((error) => {
        console.log('Error Message: ', error?.message);
        
        if (error.response?.data){
            console.log('Error Response Data: ', error.response.data);
        } else if (error.request) {
            console.log('Request Error: ', error.request);
        } else {
            console.log(error);
        }
        
    });

    // --------------------------------------------------------

    // Essa rota removerá um Cookie específico do usuário.
    // return res.status(200)
    //     .clearCookie("auth_refresh")
    //     .send('Thank you, I ate the cookie you gave me.');

});

router.get('/verify', async (req, res, next) => {

    // Chamada para a comunicação direta entre o Front-end e a REST (Renovação direta dos Tokens)...
    // A renovação silenciosa acontecerá por meio do Middleware "validate_userTokens".
    // Acontecerá via interceptors das requisições do front-end.

    const renewed_accessToken = req.headers.authorization?.split(' ')[1];
    const renewed_refreshToken = req.cookies.auth_refresh;

    console.log('[auth/verify] - Os tokens foram renovados pelo middleware de renovação.');

    return res.status(200).json({
        renewed_accessToken,
        renewed_refreshToken
    });

    // ---------------------------------------------------------------------------------------------------------------------------------
    // console.log('MIDDLEWARE VALIDATE USER TOKEN...');
    // console.log('\nAuthorization Header: ', req.headers.authorization?.split(' ')[1]);
    // console.log('\nRefresh Cookie: ', req.cookies.auth_refresh);

    // if (!req.cookies.auth_refresh){
    //     // Se a requisição não tiver o auth_refresh, o usuário possivelmente não se autenticou ainda.
    //     console.log('\n[authVerify - validate_userTokens] Requisição de um usuário não autenticado, ou que está iniciando a autenticação.');
    //     return res.status(401).send('UNAUTHENTICATED_USER_REQUEST');
    // }


    // if (req.headers.authorization){
    //     // Se a requisição do usuário já apresenta o httpOnly Cookie e possui um authorization header... 
    //     // Verifique se o AccessToken está expirado...
    //     // Se estiver expirado, a renovação acontecerá...
    //     // Se não estiver expirado, simplesmente continue a requisição...
    //     const decodedUserAT = jwt.decode(req.headers.authorization.split(' ')[1]);

    //     const now = new Date().getTime();
    //     const UserATExpInMS = new Date(decodedUserAT.exp * 1000).getTime();

    //     if (now < UserATExpInMS){
    //         console.log('\n[authVerify - validate_userTokens] O token de acesso do usuário ainda é válido!');
    //         return res.status(200).send('VALID_USER_REQUEST');
    //     }
    // }
    
    // console.log('\n[authVerify - validate_userTokens] O token de acesso do usuário está expirado, renovando...');

    // const refreshedTokens = await axios.post(`http://127.0.0.1:3000/autenticacoes/usuarios/refresh`, {
    //     refreshToken: req.cookies.auth_refresh
    // }, {
    //     headers: {
    //         'Authorization': `Bearer ${process.env.CLIENT_AT}`  // O responsável pela renovação da autenticação do usuário é o cliente, portanto o auth do cliente deve ser passado nessa requisição.
    //     }
    // })
    // .then((response) => {
    //     if (response?.data){
    //         return response.data;   // Deverá conter os Tokens (Access/Refresh) do usuário.
    //     }
    //     return 'FAILED_TO_REFRESH_USER';
    // })
    // .catch((error) => {
    //     if (error?.response?.data){

    //         if (error.response.data.code === 'INVALID_USER_REFRESH'){
    //             return 'INVALID_USER_REFRESH';
    //         }

    //         if (error.response.data.code === 'EXPIRED_USER_REFRESH'){
    //             return 'EXPIRED_USER_REFRESH';
    //         }

    //         return error.response.data
    //     }

    //     console.error('Response Error?', error?.response?.data);
    //     console.error('Req Setup Error Message:', error?.message);
    //     return error;

    // });

    // if (refreshedTokens === 'FAILED_TO_REFRESH_USER' || refreshedTokens.error){
    //     // console.log('REFRESHED TOKENS:', refreshedTokens);

    //     console.log('\n[validate_userTokens] Por algum motivo não foi possível renovar os JWTs do Usuário...');

    //     return res.status(500)
    //     .clearCookie("auth_refresh")
    //     .send('FAILED_TO_REFRESH');       // Se não foi possível renovar os JWTs do usuário, enviará essa mensagem para o front. Trate ela nos interceptors do front, despachando "clearUser()" para a Redux Store.

    //     // return res.status(500).send('Algo deu errado ao renovar o acesso do usuário.');
    // }

    // const { user_accessToken, user_refreshToken } = refreshedTokens;
    // const { inactiveUser_accessToken, inactiveUser_refreshToken } = refreshedTokens;

    // // Início da renovação dos cabeçalhos de requisição e httpOnly Cookie.
    //     // Renova os dados do Access Token e o httpOnly Cookie para a continuação dessa requisição.
    //         // Será feita pelo interceptor...

    //         // req.headers.authorization = `Bearer ${user_accessToken || inactiveUser_accessToken}`
    //         // req.cookies.auth_refresh = user_refreshToken || inactiveUser_refreshToken;

    //     // Renova o Access Token para as próximas requisições...    
    //         // Será feita pelo interceptor...

    //         // res.setHeader('Authorization', user_accessToken || inactiveUser_accessToken);

    //     // Capturando a data de expiração do Token para o httpOnly Cookie.
    //         const decodedRefresh = jwt.decode(user_refreshToken || inactiveUser_refreshToken);
    //         const now = new Date().getTime();
    //         const then = new Date(decodedRefresh.exp * 1000).getTime();
    //         const timeDifInMs = (then - now);
    //         const tokenExpirationDate = new Date(new Date().getTime() + timeDifInMs)
    //     // Fim da captura da data de expiração do Token para o httpOnly Cookie.

    //     // Atualiza o httpOnly cookie com o Refresh Token renovado para as próximas requisições.
    //         return res.status(200)
    //         .cookie(
    //             "auth_refresh",
    //             user_refreshToken || inactiveUser_refreshToken, 
    //             {
    //                 sameSite: 'strict',
    //                 path: '/',
    //                 expires: tokenExpirationDate,
    //                 httpOnly: true,
    //                 // secure: true // O cookie só será passado via https.
    //             }
    //         ).json(refreshedTokens);
    // Fim da renovação do cabeçalho de requisições e httpOnly Cookie.

    // Quando a resposta da requisição for enviada depois desse Middleware, essas alterações entrarão em efeito.

    // console.log('Usuário renovado, passando requisição adiante...');
    // console.log('\nNovos headers...');
    // console.log('\nAuthorization Header: ', req.headers.authorization?.split(' ')[1]);
    // console.log('\nRefresh Cookie: ', req.cookies.auth_refresh);

    // ---------------------------------------------------------------------------------------------------------------------------------

    // return res.status(200).send('Cookie data: ' + req.cookies.Name);

});

// Exportações.
module.exports = router;