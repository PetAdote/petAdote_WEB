// Importações.
import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { connect } from 'react-redux';      // Responsável por fazer a subscription do nosso Componente React ao Redux Store.

// Utilidades.
import { makeStyles } from '@material-ui/core/styles';
import axios from '../helpers/axiosInstance';

// Actions.
import { fetchUser, clearUser, openSnackbar }
    from '../redux/actions';

// Components.
import { Grid, Typography, TextField, Button, FormControlLabel, Checkbox}
    from '@material-ui/core';

// Inicializações.
const useStyles = makeStyles((theme) => {
    return {
        mainContainer: {
            flex: 1,
            // marginTop: '65px',   // Quando tiver que levar em consideração o AppBar.
            alignItems: 'center',
            justifyContent: 'center'
        },
        formContainer: {
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
        },
        link: {
            textDecoration: 'none',
            color: '#2b78e4',
            "&:hover": {
                color: '#085394'
            }
        }
    }

});

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
    const { openSnackbar, fetchUser } = props;
    

    useEffect(() => {

        /* Observações sobre a utilização correta da validação automática via front-end dos JWTs de
           acesso do usuário podem ser encontradas no componente [ HomeContainer.js ] e no entry-point
           do front-end [ index.js ]
        */

        if (user?.cod_usuario){
            // const redirectTo = history.location.state?.redirectTo;
            const { redirectTo } = history.location.state || {};
            console.log('RedirectTO', redirectTo);
            if (redirectTo){
                history.push(redirectTo, {});
            } else {
                history.push('/');
            }
        }

        console.log('[LoginContainer.js] router react dom history state:', history);

    }, [user, history]);


    const handleLogin = (ev) => {
        ev.preventDefault();

        console.log('BeforeLogin', axios.defaults.headers.common);

        const {email, password, remember} = credentials;

        axios.post('/auth/login', {
            email,
            password,
            remember
        }, {
            baseURL: 'http://web-petadote.ddns.net:4000',   // Domínio do Back-end da aplicação.
            withCredentials: true
        })
        .then((response) => {

            console.log('LoginContainer:', axios.defaults.headers);
            
            if (response.data?.user_accessToken || response.data?.inactiveUser_accessToken){

                // Definindo o Access Token do Usuário na memória (Ficará salvo no cabeçalho das próximas requisições com essa instância do axios).
                axios.defaults.headers.common = {
                    'Authorization': `Bearer ${response.data.user_accessToken || response.data.inactiveUser_accessToken}`
                }

                console.log('BeforePostLogin: ', response.data);

                console.log('PostLogin', axios.defaults.headers.common);

                // Definindo que de agora em diante as requisições enviarão o httpOnly Cookie com o Refresh Token.
                // axios.defaults.withCredentials = true;  

                // console.log('Authorization Header and httpOnly Cookie has been set up.');
                // console.log(console.log(axios.defaults.headers));

                // Despachando a Action para capturar e armazenar os dados do usuário na Redux Store.
                return fetchUser()
                .then((result) => {
                    console.log(result);
                    console.log('Usuário autenticado com sucesso');
                })
                .catch((error) => {
                    console.log('Algo deu errado ao buscar os dados do usuário:', error);
                })
                // return console.log('Usuário autenticado com sucesso');
            }

            console.log('handleLogin Response:', response);

        })
        .catch((error) => {

            if (error?.response?.data === 'EMPTY_FIELDS'){
                return openSnackbar('Preencha todos os campos!', 'info');
            }

            if (error?.response?.data?.code === 'INVALID_USER_CREDENTIALS'){
                return openSnackbar('Credenciais Inválidas!', 'error');
            }

            console.log(error?.response?.data || error?.message);
        });

    }

    return (
        <>
        { 
            !user ?
                <Grid container component="main" className={styles.mainContainer}>

                    <Grid item xs={9} sm={6} md={6} lg={4} className={styles.formContainer}>

                        <Grid container component="form" spacing={1} justify='center' className={styles.form}>

                            <Grid item xs={12} >
                                <Typography component="h1" variant="h5" align='center'>ENTRAR</Typography>
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
                                        name="rememberMe"
                                        color="primary"
                                    />
                                }
                                label="Lembre-se de mim"
                            />
                            </Grid>
                            <Grid item xs={12}>
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
                            <Grid item xs={12}>
                                <Grid container alignItems='flex-start'>
                                    <Grid item xs>
                                        <Link to="" className={styles.link}>Esqueceu a senha?</Link>
                                    </Grid>
                                    <Grid item >
                                        <Link to="/cadastro" className={styles.link}>Quero me cadastrar</Link>
                                    </Grid>
                                </Grid>
                            </Grid>

                        </Grid> {/* form End */}

                    </Grid> {/* formContainer End */}

                </Grid> /* mainContainer End */
            : null
        }
        </>
    );

}

// Redux Store Mapping.
const mapStateToProps = (state) => {
    return {
        userData: state.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUser: () => { return dispatch( fetchUser() ) },
        clearUser: () => { return dispatch( clearUser() ) },
        openSnackbar: (message, severity) => { return dispatch( openSnackbar(message, severity) ) }
    }
}

// Exportações.
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginContainer);
