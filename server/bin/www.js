// Importações.
    const http = require('http');
    const requestListeners = require('../index');

    // Utilidades.
    const axios = require('axios').default;

// Configurações do HTTP Server.
    const port = process.env.PORT || 4000;
    const server = http.createServer(requestListeners);

// Inicialização do HTTP Server.
    server.listen(port, '127.0.0.1', () => {
        console.log(`React's Back-End Server running @ "http://localhost:${port}".`);

        axios.get(`http://127.0.0.1:3000/autenticacoes/apis/login/?cliente=${process.env.MY_REST_APP_ID}&senha=${process.env.MY_REST_APP_PASS}`)
        .then(async (res) => {

            if (res.status == 200 && res.data?.client_accessToken){
                process.env.CLIENT_AT = res.data.client_accessToken;
                process.env.CLIENT_RT = res.data.client_refreshToken;
                console.log('A aplicação está autenticada na REST Pet Adote.');
            } else {
                console.error('Não foi possível autenticar a aplicação na REST Pet Adote. Recebemos a seguinte resposta...', res);
            }
            
        })
        .catch((error) => {
            console.error('Response Error?', error?.response?.data);
            // console.error('Response Error Data:', error?.response?.data);
            // console.error('Response Error Status:', error?.response?.status);
            // console.error('Response Error Headers:', error?.response?.headers);
            // console.error('Request Error?', error?.request);
            console.error('Req Setup Error Message:', error?.message);
            // console.error('Error Configs:', error?.config);

            // next(error?.response?.data || error?.message);
        });
        
    });
