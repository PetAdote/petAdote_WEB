// Importações
    // Framework.
    import React from 'react';
    import ReactDOM from 'react-dom';

    // Styles.
    import './styles/index.css';

    // Componentes.
    import App from './App';  // Root Component.

    // Silent Refresh.
    import { store } from './redux/store';
    import { fetchUser, clearUser } from './redux/actions';

    import axios from './helpers/axiosInstance';

axios.get('http://localhost:4000/auth/refresh', {
    withCredentials: true
})
.then((response) => {

    if (response.data?.renewed_accessToken){

        // Definindo o Access Token do Usuário na memória (Ficará salvo no cabeçalho das próximas requisições com essa instância do axios).
        axios.defaults.headers.common = {
            'Authorization': `Bearer ${response.data.renewed_accessToken}`
        }

        // Definindo que de agora em diante as requisições enviarão o httpOnly Cookie com o Refresh Token.
        // axios.defaults.withCredentials = true;  

        // console.log('Authorization Header and httpOnly Cookie has been set up.');
        // console.log(console.log(axios.defaults.headers));

        // Despachando a Action para capturar e armazenar os dados do usuário na Redux Store.
        const userData = store.getState().user;

        if (!userData.user){
            // Se por algum motivo, acontecer a renovação do jwt de um usuário e ele não possuir os dados de usuário no local storage, faça a captura dos dados do usuário.
            store.dispatch( fetchUser() );  
        }
        
        return console.log('Acesso do usuário renovado com sucesso');
    }

    if (response.data === 'USER_REFRESH_NOT_FOUND'){
        // A chamada ao back-end em "/auth/refresh" apresentou que o usuário não possui nenhum indício de uma autenticação persistida.
        // Ou nunca se autenticou. Ou não desejou persistir a autenticação, fechou o navegador e entrou novamente no web app.
        // Ou algo deu errado em "/auth/refresh", ou ainda... O refresh token estava inválido.

        if (window.location.pathname !== '/login'){     
            store.dispatch( clearUser() );  // Se qualquer um dos casos acima aconteceu, reinicie a State "user".
            window.location.replace('/login');  // Redirecione-o para "/login".
        }
        
        return console.log('O usuário não tem uma autenticação iniciada.');
        
    }

    console.log('Unexpected Silent Refresh Response @ index.js: ', response);

})
.catch((error) => {

    console.log(error.response || error.message || error);

    // const errorMessage = error.message || '';
    // return dispatch( fetchUserFailure(errorMessage) );

});

// store.dispatch(fetchUser()); 
/* Tenta adquirir os dados do usuário na primeira renderização do sistema.
 Essa Action acaba desencadeando uma série de verificações para renovar os 
 tokens JWT do usuário, caso ele já tenha se autenticado na aplicação préviamente
 e ainda possua o httpOnly cookie contendo o refresh token dele.
 
 Chamar essa verificação aqui permite a verificação e atualização automática do usuário e seus dados 
 em todas as rotas do sistema.
 */

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);