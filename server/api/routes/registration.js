// Importações.
    const express = require('express');
    const router = express.Router();

    // Utilidades.
    const axios = require('../helper/axiosInstance');

// Rotas.
router.post('/', async (req, res, next) => {

    const {
        email, senha, confirma_senha,
        primeiro_nome, sobrenome, data_nascimento, cpf, telefone, descricao,
        cep, logradouro, bairro, cidade, uf, numero, complemento
    } = req.body

    axios.post('/contas', {
        email,
        senha,
        confirma_senha,

        primeiro_nome,
        sobrenome,
        data_nascimento,
        cpf,
        telefone,
        descricao: descricao || undefined,

        cep,
        logradouro,
        bairro,
        cidade,
        uf,
        numero,
        complemento: complemento || undefined
    }, {
        headers: {
            'Authorization': `Bearer ${process.env.CLIENT_AT}`
        }
    })
    .then((response) => {

        console.log('[registration.js] Cadastro iniciado, resultado...');
        console.log(response?.data || response);

        if (response.data.cod_usuario){
            return res.status(200).send('SUCCESS');
        }

    })
    .catch((error) => {

        // Retornando as Validações...
        console.log('[registration.js] Cadastro iniciado...');
        if (error.response?.data?.code){
            return res.status(error.response?.status || 500).send(error.response?.data);
        }

        console.log('[registration.js] erro desconhecido...');
        console.log(error.response?.data || error.response || error.message || error);

    });

});

// Exportações.
module.exports = router;