// Importações.
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';  // Responsável por fazer a subscription do nosso Componente React ao Redux Store.
import axios from '../helpers/axiosInstance';

import { makeStyles } from '@material-ui/core/styles';

// Actions.
import { clearUser } from '../redux/actions';

// My Components.
// ...

// MUI Components.
import {
    CssBaseline,
    Container,
    Grid,
    Typography,
    Button,
    Avatar
} from '@material-ui/core'


// Functional Component.
const Home = (props) => {

    const styles = useStyles();

    const history = useHistory();

    const { user } = props.userData;

    // const [lastUserState, setLastUserState] = useState(user);
       /* Não podemos usar diretamente "user" na tela, pois "user" pode sofrer alterações...
        Essas alterações causam o erro "Cannot update during an existing state transition..." sinalizando
        que um loop infinito pode ocorrer. 
        Afinal se a função de renderização está gerenciando sua própria state, esse tipo de erro pode acontecer.
        Apesar disso (nesse caso em particular, não acontecia, o console apenas avisava que algo estáva errado.)
        Para resolver o aviso, foi necessário utilizar a aproximação acima, que "copia" a state gerenciada
        pela Redux Store para uma State Local do componente via "useState".

        * Encontrei outra solução... O problema acima era causado pela atualização dos dados da reducer "user"
          utilizando a action "fetchUser" no ciclo de renderizações desse mesmo componente.

          Eu estava utilizando essa chamada, que atualizava os dados do usuário e seus tokens de acesso
          na aplicação de forma pouco proveitosa (funcionava, mas mal hahaha).

          Agora ela é chamada na primeira renderização de qualquer página do sistema, no 
          entry-point do front-end... "index.js".
       */

    const { clearUser } = props;

    useEffect(() => {

        // fetchUser();

        if (!user){
            history.push('/login');
            // return ( null );    // JSX Vazio se User não estiver definido.
        }

    }, [user, history])


    const handleLogout = (ev) => {

        axios.get('http://localhost:4000/auth/logout', {
            withCredentials: true
        })
        .then((response) => {
            
            if (response.data === 'USER_DISCONNECTED_SUCCESSFULLY'){
                delete axios.defaults.headers.common['Authorization'];
                axios.defaults.withCredentials = false;
                clearUser();
                history.push('/login');
            }

            console.log(response.data);
            
        })
        // .then((result) => {
        //     console.log('aaaa');
        // })
        .catch((error) => {
            console.log(error?.response?.data || error?.message);
        });

    }

    

    return ( 
    <> 
    { user ?
        <Grid container component="main" className={styles.root}>
            <CssBaseline />
            <Grid item xs={9} sm={9} md={9} lg={9}>
                <Container className={styles.paper} >
                    <Grid container spacing={2} justify='center'>
                        <Grid item xs={12}>
                            <Typography component='h1' variant='h4' align='center'>Hello World</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography component='p' align='center'>But more importantly... Hello <b>{ user.primeiro_nome }</b> 😉</Typography>
                        </Grid>
                        <Grid item xs={12}>

                            <Grid container spacing={2} style={{
                                backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25))',
                                borderRadius: '20px',
                                
                            }}>
                                <Grid item xs={12}>
                                    <Typography component='h2' variant='h5' align='center'>{ user.primeiro_nome + ' ' + user.sobrenome }</Typography>
                                </Grid>
                                <Grid item xs={5}>
                                    <Avatar 
                                        src={ user.download_avatar } 
                                        style={{
                                            width: '150px',
                                            height: '150px'
                                        }}
                                        variant='circular'
                                    />
                                </Grid>
                                <Grid item xs={7}>
                                    <Typography component='p'>
                                        { user.descricao }
                                    </Typography>
                                </Grid>
                            </Grid>

                        </Grid>
                        <Grid item xs={3}>
                            <Button
                                type='button'
                                variant='contained'
                                onClick={ () => { handleLogout() } }
                                color='secondary'
                                fullWidth
                            >
                                Sair
                            </Button>
                        </Grid>
                    </Grid>
                </Container>
            </Grid>
        </Grid>
    : null }
    </>
    );
}

const useStyles = makeStyles((theme) => {

    return {
        root: {
            height: '100vh',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://source.unsplash.com/random)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundAttachment: 'fixed',
            backgroundPosition: 'center',
        },
        paper: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.75)',
            padding: '20px',
            border: '1px solid black',
            borderRadius: '10px',
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%'
        },
        input: {
            color: 'black',
        },
        inputBorder: {
            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                borderColor: "black"
            },
            "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                borderColor: "green"
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "black"
            },
            "& .MuiOutlinedInput-input": {
                color: "black"
            },
            "&:hover .MuiOutlinedInput-input": {
                color: "green"
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": {
                color: "black"
            },
            "& .MuiInputLabel-outlined": {
                color: "black"
            },
            "&:hover .MuiInputLabel-outlined": {
                color: "green"
            },
            "& .MuiInputLabel-outlined.Mui-focused": {
                color: "black"
            }
        }
    }

});

const mapStateToProps = (state) => {
    return {
        userData: state.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        clearUser: () => { return dispatch ( clearUser() ) },
        // fetchUser: () => { return dispatch ( fetchUser() ) },
    }
}
 
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);
