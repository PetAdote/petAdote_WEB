// Importações.
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';      // Responsável por fazer a subscription do nosso Componente React ao Redux Store.
import axios from '../helpers/axiosInstance';

import { makeStyles } from '@material-ui/core/styles';

// Actions.
import { fetchUser, clearUser } from '../redux/actions';

// My Components.
// ...

// MUI Components.
import {
    CssBaseline,
    Container,
    Grid,
    Typography,
    TextField,
    Button,
    FormControlLabel,
    Checkbox
} from '@material-ui/core'



// Functional Component.
const LoginContainer = (props) => {

    const styles = useStyles();
    const history = useHistory();

    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
        remember: false
    });

    const { user } = props.userData;
    // const { fetchUser } = props;

    useEffect(() => {

        /* Observações sobre a utilização correta da validação automática via front-end dos JWTs de
           acesso do usuário podem ser encontradas no componente [ HomeContainer.js ] e no entry-point
           do front-end [ index.js ]
        */
        

        // if (!user){
        //     // fetchUser();  // Dispara a verificação da existência de um usuário autenticado e busca seus dados.
        // }

        if (user?.cod_usuario){
            history.push('/');
        }

    }, [user, history])

    const handleLogin = (ev) => {
        ev.preventDefault();

        const {email, password, remember} = credentials;

        axios.post('/auth/login', {
            email,
            password,
            remember
        }, {
            baseURL: 'http://localhost:4000',   // Domínio do Back-end da aplicação.
            withCredentials: true
        })
        .then((response) => {
            
            if (response.data?.user_accessToken || response.data?.inactiveUser_accessToken){

                // Definindo o Access Token do Usuário na memória (Ficará salvo no cabeçalho das próximas requisições com essa instância do axios).
                axios.defaults.headers.common = {
                    'Authorization': `Bearer ${response.data.user_accessToken || response.data.inactiveUser_accessToken}`
                }

                // Definindo que de agora em diante as requisições enviarão o httpOnly Cookie com o Refresh Token.
                // axios.defaults.withCredentials = true;  

                // console.log('Authorization Header and httpOnly Cookie has been set up.');
                // console.log(console.log(axios.defaults.headers));

                // Despachando a Action para capturar e armazenar os dados do usuário na Redux Store.
                props.fetchUser();
                return console.log('Usuário autenticado com sucesso');
            }

            console.log('handleLogin Response:', response);

        })
        .catch((error) => {
            console.log(error?.response?.data || error?.message);
        })

    }

    // const handleLogout = (ev) => {
    //     ev.preventDefault();

    //     axios.get('http://localhost:4000/auth/logout', {
    //         withCredentials: true
    //     })
    //     .then((response) => {
            
    //         if (response.data === 'USER_DISCONNECTED_SUCCESSFULLY'){
    //             delete axios.defaults.headers.common['Authorization'];
    //             axios.defaults.withCredentials = false;
    //             props.clearUser();
    //         }

    //         console.log(response.data);
            
    //     })
    //     .catch((error) => {
    //         console.log(error?.response?.data || error?.message);
    //     })

    // }

    // const handleVerify = (ev) => {
    //     ev.preventDefault();

    //     console.log('Configure o botão que você clicou para disparar testes!');
    //     // Despachando a Action para capturar e armazenar os dados do usuário na Redux Store.
    //     // props.fetchUser();

    // }

    

    return ( 
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Grid container component="main" className={styles.root}>
            <CssBaseline />
            <Grid item xs={9} sm={6} md={6} lg={4}>
                <Container className={styles.paper} >
                    
                    <form className={styles.form} >
                        <Grid container spacing={1} justify='center'>
                            <Grid item xs={12} >
                                <Typography component="h1" variant="h5" align='center'>LOGIN</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="email"
                                    name="email"
                                    label="E-mail"
                                    type='email'
                                    variant="outlined"
                                    className={ styles.inputBorder }
                                    size="small"
                                    value={credentials.email}
                                    onChange={ (ev) => { setCredentials({ ...credentials, email: ev.target.value }) } }
                                    fullWidth
                                    required
                                    autoFocus
                                    autoComplete='email'
                                    
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="password"
                                    name="password"
                                    label="Senha"
                                    type='password'
                                    variant="outlined"
                                    className={ styles.inputBorder }
                                    size="small"
                                    value={credentials.password}
                                    onChange={ (ev) => { setCredentials({ ...credentials, password: ev.target.value }) } }
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                <Checkbox
                                    checked={ credentials.remember }
                                    onChange={ (ev) => { setCredentials({ ...credentials, remember: ev.target.checked }) } }
                                    name="checkedB"
                                    color="primary"
                                />
                                }
                                label="Lembre-se de mim"
                            />
                            </Grid>
                            <Grid item xs={4}>
                                <Button 
                                    variant='contained'
                                    color='primary'
                                    type='submit'
                                    onClick={ (ev) => { handleLogin(ev) } }
                                    fullWidth
                                >
                                    ENTRAR
                                </Button>
                            </Grid>
                            {/* <Grid item xs={4}>
                                <Button 
                                    variant='contained'
                                    color='secondary'
                                    type='submit'
                                    onClick={handleLogout}
                                    fullWidth
                                >
                                    SAIR
                                </Button>
                            </Grid> */}
                            {/* <Grid item xs={4}>
                                <Button 
                                    variant='contained'
                                    color='default'
                                    type='submit'
                                    onClick={handleVerify}
                                    fullWidth
                                >
                                    VERIFICAR
                                </Button>
                            </Grid> */}
                            
                        </Grid>
                    </form>
                </Container>

            </Grid>

            {/* <Grid item xs={12}>
                <Typography variant='h1'>TESTE DE RESPONSIVIDADE</Typography>
            </Grid>

            <Grid item xs={12}>
                <Typography variant='h1'>TESTE DE RESPONSIVIDADE</Typography>
            </Grid>

            <Grid item xs={12}>
                <Typography variant='h1'>TESTE DE RESPONSIVIDADE</Typography>
            </Grid>

            <Grid item xs={12}>
                <Typography variant='h1'>TESTE DE RESPONSIVIDADE</Typography>
            </Grid> */}
            
        </Grid>
        <Grid container component='footer' style={{ backgroundColor: '#2c2b2e' }}>
            <Grid item xs={12}>
                <Typography component="p" align='center' style={{ color: '#e8e8e8' }}>Copyright © Sistemas Pet Adote 2021.</Typography>
            </Grid>
        </Grid>
        </div>
    );
}


const useStyles = makeStyles((theme) => {

    return {
        root: {
            // height: '100vh',

            flex: '1',

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
        fetchUser: () => { return dispatch( fetchUser() ) },
        clearUser: () => { return dispatch( clearUser() ) }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginContainer);
