import axios from '../../helpers/axiosInstance';
import * as userActionTypes from './userTypes';


// Action Creators.
export const fetchUserRequest = () => {
    return {
        type: userActionTypes.FETCH_USER_REQUEST
    }
}

export const fetchUserSuccess = (user) => {
    // Vamos passar "user" para a Reducer alterar a Storage de acordo com a Action Type.

    return {
        type: userActionTypes.FETCH_USER_SUCCESS,
        payload: user
    }
}

export const fetchUserFailure = (error) => {
    return {
        type: userActionTypes.FETCH_USER_FAILURE,
        payload: error
    }
}

export const clearUser = () => {
    return {
        type: userActionTypes.CLEAR_USER
    }
}

// Async Action Creators.
export const fetchUser = () => {

    // Remember me - Checkbox logic.
    // Se a state "user" possuirá uma propriedade "remember".

    // Se a state "user" já possuir a propriedade "user" definida, independente do estado de "remember", significa que o usuário já estava autenticado e usando o App, renove os JWT.
    // Se a state "user" não possuir a propriedade "user" definida (usuário deslogou ou nunca logou) e "remember" é falso, não renove a sessão do usuário. Caso "remember" for verdadeiro, renove.

    // [+] Para resolver o problema da chamada inicial entregando o erro inicial da renovação dos tokens, crie uma rota específica para essa renovação no back-end.
    // No momento, um middleware no back-end faz a verificação do cookie http do usuário, e retorna os tokens para a chamada "auth/verify", que é chamada pelo interceptor do axios do front-end.

    // Ou seja... Ao chamar a rest com "?get=self" nesse momento, não temos a authorization, isso causa o erro exibido no console.

    // Se fizermos uma chamada para uma rota no nosso back-end, que faça todo o tratamento de refresh do usuário ( temos que apresentar o httpOnly cookie do usuário ).
    // E essa rota chamar a REST em "?get=self", receber o erro, tratar o erro (mesmo tratamento do interceptor do axios front-end),
    // depois realizar o que o middleware de verificação do cookieHttp faz para receber as chaves renovadas de auth do usuário,
    // e utilizá-las para chamar novamente "?get=self" porém agora efetivamente recebendo os dados do usuário 
    // pois apresentamos as chaves de autenticação e por fim retornando com os dados do usuário.

    // Assim, não teremos o erro sendo apresentado para o front-end e nossa Reducer receberá os dados do usuário.

    // Observação, a verificação da propriedade "remember" da state "user" acontecerá logo antes da dispatch( fetchUserSuccess(user) );

    // [++] A solução apresentada acima não é válida, mas se aproximou do da solução real... O problema do "erro inicial" aconteceu por
    // vários motivos, o primeiro sendo o fato de estarmos chamando a action "fetchUser()" ao enviar a primeira página http para o usuário.
    // O segundo é que fetchUsers deveria apenas buscar usuários, e não realizar o silent refresh quando é chamado, mas sim, só no caso que falhar com
    // a mensagem EXPIRED_USER_AUTH ou AUTH_HEADER_NOT_SENT...
    // Resolvemos ao remover o trabalho de realizar a renovação dessa Action.
    // E utilizar a instância do axios do front-end para fazer uma chamada inicial diretamente para o back-end (que possui o middleware que realiza de 
    // fato a renovação dos JWTs do usuário, retornando-os para o front, onde é possível definir os JWTs renovados como padrão para as futuras requisições
    // que utilizarem essa instância do axios como meio de comunicação).

    // -----------------------------
    
    return (dispatch) => {

        dispatch( fetchUserRequest() );

        // axios.get('http://localhost:4000/auth/refresh', {
        //     withCredentials: true
        // })
        // .then((response) => {

        //     // console.log('[userActions/fetchUser] - Dados recebidos...', response)

        //     const user = response.data?.usuario;
        //     if (user){
        //         return dispatch( fetchUserSuccess(user) );
        //     } 
              
        //     // console.log('[userActions/fetchUser]: ', response?.data);

        // })
        // .catch((error) => {

        //     const errorMessage = error.message || '';
        //     return dispatch( fetchUserFailure(errorMessage) );

        // });

        axios.get('/usuarios/?get=self')
        .then((response) => {

            const user = response.data?.usuario
            dispatch( fetchUserSuccess(user) );

        })
        .catch((error) => {

            const errorMessage = error.message || '';
            dispatch( fetchUserFailure(errorMessage) );

        });
        
    }

}
