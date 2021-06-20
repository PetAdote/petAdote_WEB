// Importações.
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { connect } from 'react-redux';  // Responsável por fazer a subscription do nosso Componente React ao Redux Store.

// Utilidades.
import axios from '../helpers/axiosInstance';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import useQuery from '../hooks/useQuery';

// Actions.
import { clearAnnouncements } 
    from '../redux/actions';

// Components.
import { useTheme, useMediaQuery, 
         TextField, Button, Typography,
         Container, Grid, CircularProgress } 
    from '@material-ui/core';

// Inicializações.
const useStyles = makeStyles((theme) => {
    return {
        adoptionValidationContainer: {
            flex: 1,
            padding: '0',
            [theme.breakpoints.down('xs')]: {
                marginTop: `${theme.mixins.toolbar.minHeight}px`,
            },
            [theme.breakpoints.between('455', '600')]: {
                marginTop: `${theme.mixins.toolbar.minHeight - 8}px`,
            }
        },
        formContainer: {
            backgroundColor: 'rgba(255, 255, 255, 0.75)',
            padding: '20px',
            margin: '16px 0',
            border: '1px solid black',
            borderRadius: '10px',
        },
        formInput: {
            padding: '8px 0'
        },
        formButton: {
            width: '100px',
            margin: '8px'
        },
        link: {
            textDecoration: 'none',
            color: '#2b78e4',
            "&:hover": {
                color: '#085394'
            }
        },
    }

});

// Functional Component.
const AdoptionValidationPage = (props) => {

    const { clearAnnouncements } = props;
    const { user } = props.userData;

    // const { codValidacao: qrsecret } = useParams();

    const styles = useStyles();
    const theme = useTheme();
    const { enqueueSnackbar } = useSnackbar();
    const history = useHistory();
    const query = useQuery();

    // const requiredUrlParams = {
    //     candidature: query.get('candidature') || undefined,
    //     code: query.get('code') || undefined
    // }

    const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
    const isAtMinViewPort = useMediaQuery(theme.breakpoints.down('xs'));

    const [candidatureKey, setCandidatureKey] = useState('');
    const [validationCode, setValidationCode] = useState('');

    const [isLoading, setIsLoading] = useState(null);
    const [conclusionError, setConclusionError] = useState('');

    const initialAdoptionStatus = {
        tutorEntregou: false,
        adotanteRecebeu: false
    }
    const [adoptionStatus, setAdoptionStatus] = useState(initialAdoptionStatus);

    const [ConclusionStep, setConclusionStep] = useState(null);

    useEffect(() => {

        // console.log('[AdoptionValidationPage.js] requiredUrlParams:', requiredUrlParams);

        if (!user){
            
            const candidatureKey = query.get('key');
            const validationCode = query.get('code');

            let queryString = new URLSearchParams();
            if (candidatureKey) { queryString.append('key', candidatureKey); }
            if (validationCode) { queryString.append('code', validationCode); }
            
            // history.push('/login');
            history.push('/login', { redirectTo: '/validar/' + (queryString ? '?' + queryString.toString() : '') });

        }

        if (query.get('key')) {
            setCandidatureKey(query.get('key'));
        }

        if (query.get('code')) {
            setValidationCode(query.get('code'));
        }

        // if (qrsecret){
        //     setValidationSecret(qrsecret);
        // }

    }, [user, history, query]);

    const handleValidateAdoption = () => {

        if (!candidatureKey || !validationCode) {
            return enqueueSnackbar('Os campos devem ser preenchidos para continuar', { variant: 'info' });
        }

        setIsLoading(true);

        axios.get('/anuncios/candidaturas/', {
            params: {
                validate: candidatureKey,
                code: validationCode
            }
        })
        .then((response) => {

            setIsLoading(false);

            console.log('[AdoptionValidationPage.js] validate adoption:', response.data);

            if (response.data?.code === 'ADOPTION_COMPLETE'){
                enqueueSnackbar('Parabéns, a adoção do pet foi concluída!', { variant: 'success', autoHideDuration: 20 * 1000 });
                clearAnnouncements();
                history.push(`/usuario/${user.cod_usuario}`);
            }
            if (response.data?.code === 'ANNOUNCER_CONFIRMED'){
                enqueueSnackbar('Você confirmou que entregou o pet. A adoção será concluída quando o adotante confirmar que recebeu o pet.', { variant: 'success', autoHideDuration: 20 * 1000 });
                history.push('/');
            }
            if (response.data?.code === 'CANDIDATE_CONFIRMED'){
                enqueueSnackbar('Você confirmou que recebeu o pet. A adoção será concluída quando o anunciante confirmar que entregou o pet.', { variant: 'success', autoHideDuration: 20 * 1000 });
                history.push('/');
            }

        })
        .catch((error) => {

            setIsLoading(false);
            
            console.log('[AdoptionValidationPage.js] unexpected error @ validate adoption:', error?.response?.data || error?.message);

            const errorMsg = error.response?.data?.error?.mensagem || error.response?.data?.mensagem || 'Falha ao validar a adoção.';

            enqueueSnackbar(errorMsg, { variant: 'error' });
            
        });

    }


    return (
        <Container component="main" maxWidth='xl' className={styles.adoptionValidationContainer}>
            {
            user ?

                isLoading ?
                    <Grid container justify='center' alignItems='center' style={{ height: '100%', padding: '16px' }}>
                        <Grid item className={styles.formContainer}>
                            <CircularProgress />
                        </Grid>
                    </Grid>
                :
                <Grid container justify='center' alignItems='center' style={{ height: '100%', padding: '16px' }}>
                    <Grid item xs={12} sm={12} md={8} lg={6}>

                        <Grid container className={styles.formContainer}>

                            <Grid item xs={12} className={styles.formInput}>
                                <TextField
                                    id="candidature"
                                    name="candidature"
                                    label="Código da candidatura"
                                    type='text'
                                    variant="outlined"
                                    size="small"
                                    value={candidatureKey}
                                    placeholder='Código da candidatura.'
                                    onChange={ (ev) => { setCandidatureKey(ev.target.value) } }
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    fullWidth
                                    required
                                    autoFocus
                                />
                            </Grid>

                            <Grid item xs={12} className={styles.formInput}>
                                <TextField
                                    id="secret"
                                    name="secret"
                                    label="Código de validação"
                                    type='text'
                                    variant="outlined"
                                    size="small"
                                    value={validationCode}
                                    placeholder='Código de validação.'
                                    onChange={ (ev) => { setValidationCode(ev.target.value) } }
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    fullWidth
                                    required
                                    autoFocus
                                />
                            </Grid>

                            <Grid item xs={12} style={{ padding: '4px 8px' }}>
                                <Typography component='p' variant='caption'>
                                    <b>Atenção:</b> Assim que os participantes da adoção confirmarem a entrega ou recepção do animal utilizando o código provido nos Termos de Responsabilidades, o processo de adoção estará concluído. Mantenha o seu documento de Termos de Responsabilidades sempre armazenado em um local seguro.
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Grid container justify='center'>

                                    <Grid item>
                                        <Button
                                            onClick={handleValidateAdoption}
                                            variant='contained'
                                            color='primary'
                                            size='small'
                                            className={styles.formButton}
                                        >
                                            Validar
                                        </Button>
                                    </Grid>

                                    <Grid item>
                                        <Button
                                            onClick={() => { history.push('/') }}
                                            variant='contained'
                                            color='primary'
                                            size='small'
                                            className={styles.formButton}
                                        >
                                            Cancelar
                                        </Button>
                                    </Grid>

                                </Grid>
                            </Grid>

                        </Grid>
                        
                    </Grid>
                </Grid>

            : <></>
            }
        </Container>
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
        clearAnnouncements: () => { return dispatch( clearAnnouncements() ) },
        // clearUser: () => { return dispatch ( clearUser() ) },
        // fetchAnnouncements: (page, limit) => { return dispatch( fetchAnnouncements(page, limit) ) },
        // fetchUser: () => { return dispatch ( fetchUser() ) },
    }
}
 
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AdoptionValidationPage);