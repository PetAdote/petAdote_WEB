// Importações.

    // Framework.
        const express = require('express');
        const app = express();

    // Middlewares.
        const cors = require('cors');
        const validateUserToken = require('./api/middlewares/validate_userTokens');

    // Utilidades.
        const axios = require('axios').default;
        const logger = require('morgan');
        const checkRequester = require('./api/middlewares/check_requester');
        const cookieParser = require('cookie-parser');

    // Agrupamento de Rotas.
        const routeAuth = require('./api/routes/auth');

// Middlewares iniciais.
    app.use(checkRequester);
    app.use(logger('dev'));

    app.use(
        cors({
            credentials: true,                  // Se withCredentials for passado
            origin: 'http://localhost:4001'     // A request origin tem que ser válida (e nesse caso, só receberemos requests do domínio do nosso próprio front-end).

            // credentials permite a análise e transição de cookies nas requests/responses.
            // O front-end deve informar que a requisição será feita com credentials, e o server deve aceitar essas credentials.
            
            // Assim os cookies podem ser trocados entre front-end e back-end. Se isso não for especificado, cookies não serão recebidos pelo back-end.

        })
    );

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    app.use(cookieParser());    // Configuração do httpOnly Cookie para a autenticação dos usuários.

    app.use(validateUserToken);
    

// Rotas agrupadas.
    app.get('/favicon.ico', (req, res) => { return res.status(204); });

    app.use('/auth', routeAuth);

    // Exemplos de Criação - Remoção - Verificação de httpOnly Cookies.
    // app.get('/auth/login', async (req, res, next) => {

    //     // Essa rota enviará alguns cookies para o navegador do usuário.
    //     return res.status(200)
    //         .cookie(
    //             "Name",
    //             "My name as value in the httpOnly Cookie", 
    //             {
    //                 sameSite: 'strict',
    //                 path: '/',
    //                 expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    //                 httpOnly: true,
    //                 // secure: true // O cookie só será passado via https.
    //             }
    //         )
    //         .send('Cookie starting.');

    // });

    // app.get('/auth/logout', async (req, res, next) => {

    //     // Essa rota removerá um Cookie específico do usuário.
    //     return res.status(200)
    //         .clearCookie("Name")
    //         .send('Removing cookie.');

    // });

    // app.get('/auth/verify', (req, res, next) => {

    //     return res.status(200).send('Cookie data: ' + req.cookies.Name);

    // });
    // Fim dos exemplos de Criação - Remoção - Verificação de httpOnly Cookies.


    app.get('/', async (req, res, next) => {

        // let client_tokens = await axios.get('http://127.0.0.1:3000/autenticacoes/apis/login/?cliente=3&senha=petRest')
        // .then(async (res) => {
        //     // console.log(res.status);
        //     // console.log(res.data);
        //     if (res.status === 200 && res.data.client_accessToken){
        //         return res.data;
        //     }
        // })
        // .catch((error) => {
        //     // console.log('Response Error?', error?.response);
        //     // console.log('Response Error Data:', error?.response?.data);
        //     // console.log('Response Error Status:', error?.response?.status);
        //     // console.log('Response Error Headers:', error?.response?.headers);
        //     // console.log('Request Error?', error?.request);
        //     // console.log('Req Setup Error Message:', error?.message);
        //     // console.log('Error Configs:', error?.config);

        //     next(error?.response?.data || error?.message);
        // });

        // let user_tokens = await axios.post('http://localhost:3000/autenticacoes/usuarios/login', {
        //     email: 'sistema.petadote@gmail.com',
        //     senha: 'Senha1'
        // }, {
        //     headers: {
        //         'Authorization': `Bearer ${client_tokens.client_accessToken}`
        //     }
        // })
        // .then(async (res) => {
        //     if (res.status === 200){
        //         if (res.data.cod_usuario){
        //             return res.data;
        //         }
        //     }
        // })
        // .catch((error) => {

        //     next(error?.response?.data || error?.message);
            
        // });

        // let loggedUser_data = await axios.get(`http://localhost:3000/usuarios/${user_tokens.cod_usuario}`, {
        //     headers: {
        //         'Authorization': `Bearer ${user_tokens.user_accessToken || user_tokens.inactiveUser_accessToken}`
        //     }
        // })
        // .then(async (res) => {
        //     if (res.status === 200){
        //         if (res.data){
        //             return res.data;
        //         }
        //     }
        // })
        // .catch((error) => {

        //     next(error?.response?.data || error?.message);
            
        // });

        // if (loggedUser_data){
        //     return res.status(200).json(loggedUser_data);
        // }

    });

// Middlewares de tratamento de erros.
    app.use((req, res, next) => {
        const error = new Error('Recurso não encontrado.');
        error.status = 404;
        error.code = 'RESOURCE_NOT_FOUND';

        next(error);
    });

    app.use((error, req, res, next) => {
        console.error('Um erro inesperado aconteceu!', error);

        req.pause();
        res.status(error.status || 500);

        return res.json({
            error
        });
    });

module.exports = app;