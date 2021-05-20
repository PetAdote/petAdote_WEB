// Importações
  // Framework.
    import React from 'react';
    import ReactDOM from 'react-dom';

  // Styles.
    import './styles/index.css';

  // Componentes.
    import App from './App';  // Root Component.

import { store } from './redux/store';
import { fetchUser } from './redux/actions';

store.dispatch(fetchUser());  
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