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
        const routeRegistration = require('./api/routes/registration');

// Middlewares iniciais.
    app.use(checkRequester);
    app.use(logger('dev'));

    app.use(
        cors({
            credentials: true,                  // Se withCredentials for passado
            origin: ['http://localhost:4001', 'http://web-petadote.ddns.net:4001']     // A request origin tem que ser válida (e nesse caso, só receberemos requests do domínio do nosso próprio front-end).

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

    app.use('/registration', routeRegistration);

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