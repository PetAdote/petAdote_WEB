// Importações.
import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// Utilidades.
import axios from '../helpers/axiosInstance';
import { useHistory } from 'react-router-dom';
import { makeStyles }
    from '@material-ui/core/styles';

import { useSnackbar } from 'notistack';

// Actions.
import { fetchUser, clearUser }
    from '../redux/actions';

// Componentes.
import { useTheme, useMediaQuery,
         Grid, Dialog, DialogTitle, DialogContent, DialogActions, List,
         ListItem, ListItemIcon, ListItemText, Divider, Typography, IconButton,
         TextField, Button, MenuItem } 
    from '@material-ui/core';

import { Close, Visibility, VisibilityOff }
    from '@material-ui/icons';


// Inicializações.
const useStyles = makeStyles((theme) => {
    return {
        addressDataDialog: {
            width: '800px',
            backgroundColor: 'ghostwhite'
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
                color: '#085394',
                cursor: 'pointer'
            }
        },
        
    }
});

// Functional Component.
const UserAccActivationDialog = (props) => {

    const { openDialog, closeDialog, fetchUser, clearUser } = props;
    const { user } = props.userData;

    const styles = useStyles();
    const theme = useTheme();
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();

    const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
    const isAtMinViewPort = useMediaQuery(theme.breakpoints.down('xs'));

    const initialActivationData = {
        activationToken: ''
    };

    const [newActivationData, setNewActivationData] = useState(initialActivationData);

    const handleClose = (newDecision) => {
        if (newDecision) {
            closeDialog(newDecision);
        }

        closeDialog();
    }

    const handleEntering = () => {
     
        if (!user){
            return handleClose();
        }

        if (user?.esta_ativo === 1){
            return handleClose();
        }

    }

    const handleLogout = async () => {

        await axios.get('/auth/logout', {
            baseURL: 'http://web-petadote.ddns.net:4000',   // Domínio do Back-end da aplicação.
            withCredentials: true
        })
        .then((response) => {
            
            if (response.data === 'USER_DISCONNECTED_SUCCESSFULLY'){
                delete axios.defaults.headers.common['Authorization'];
                axios.defaults.withCredentials = false;
                history.location.state = {};
                history.push('/login');
                clearUser();
            }

            console.log(response.data);
            
        })
        .catch((error) => {
            console.log(error?.response?.data || error?.message);
        });

    }

    const handleActivateAcc = () => {
        // console.log(newActivationData);

        if (JSON.stringify(initialActivationData) !== JSON.stringify(newActivationData)){
            axios.patch(`/contas/ativacao/${newActivationData.activationToken}`)
            .then((response) => {
                if (response.data){
                    console.log(response.data);

                    enqueueSnackbar('Parabéns, sua conta foi ativada com sucesso!', { variant: 'success' });
                    setNewActivationData(initialActivationData);
                    // fetchUser();
                    clearUser();
                    handleClose();
                }
            })
            .catch((error) => {
                console.log(error.response?.data || error.response || error.message || 'UNKNOWN_ERROR' );

                const errorMsg = error.response?.data?.error?.mensagem || error.response?.data?.mensagem || 'Falha ao ativar a conta.';
                const errorCode = error.response?.data?.error?.code || error.response?.data?.code || error.status;

                if (errorCode === 'RESOURCE_NOT_FOUND'){
                    return enqueueSnackbar('Não foi possível enviar o código de ativação.', { variant: 'warning' });
                }

                enqueueSnackbar(errorMsg, { variant: 'warning' });
            });
        }
        
    }

    const handleTokenRequest = () => {

        axios.post(`/contas/ativacao/reenvio/${user.cod_usuario}`)
        .then((response) => {
            if (response.data){
                console.log(response.data);
                
                enqueueSnackbar('Em momentos você receberá o código de ativação.', { variant: 'info' });
            }
        })
        .catch((error) => {
            console.log(error.response?.data || error.response || error.message || 'UNKNOWN_ERROR' );

            const errorMsg = error.response?.data?.error?.mensagem || error.response?.data?.mensagem || 'Falha ao reenviar o código de ativação.';
            const errorCode = error.response?.data?.error?.code || error.response?.data?.code || error.status;

                if (errorCode === 'RESOURCE_NOT_FOUND'){
                    return enqueueSnackbar('Não foi possível enviar o código de ativação.', { variant: 'warning' });
                }

            enqueueSnackbar(errorMsg, { variant: 'warning' });
        });
        
    }

    const handleClear = () => {
        setNewActivationData(initialActivationData);
    }

    const handleGoBackAndClear = () => {
        setNewActivationData(initialActivationData);
        handleClose();
    }

    const mobileStyleForButtons = {
        minWidth: '100%',
        margin: '8px 0'
    }

    return (
        <Dialog
            open={openDialog}
            onClose={
                () => {
                    handleGoBackAndClear();
                }
            }
            onEntering={handleEntering}
            // disableScrollLock={true}
            maxWidth="sm"
            fullScreen={isAtMinViewPort}
            scroll='body'
            aria-labelledby="address-data-dialog"
            classes={{
                paper: styles.addressDataDialog
            }}
            disableBackdropClick
            disableEscapeKeyDown
        >

            <DialogTitle style={{ padding: '8px' }} id="address-data-dialog">
                <Grid container justify='space-between' alignItems='center'>

                    <Grid item xs={11} sm={9} style={{ margin: '0 auto'}}>
                        <Grid container>
                            <Grid item xs={12} style={{ overflow: 'auto', whiteSpace: 'nowrap' }}>
                                <Typography component='h1' variant='h6' align='center'>Ativação</Typography>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={1}>
                        <IconButton size='small' onClick={() => { handleGoBackAndClear() }} >
                            <Close style={{ padding: '4px' }} />
                        </IconButton>
                    </Grid>

                </Grid>
            </DialogTitle>

            <DialogContent style={{ padding: '8px' }} dividers>

                <Grid container>

                    <Grid item xs={12} className={styles.formInput}>
                        <TextField
                            id="accActivation"
                            name="accActivation"
                            label="Cod. Ativação"
                            type="text"
                            variant="outlined"
                            size="small"
                            value={newActivationData.activationToken}
                            onChange={ (ev) => { setNewActivationData({ ...newActivationData, activationToken: ev.target.value }) } }
                            InputLabelProps={{
                                shrink: true
                            }}
                            fullWidth
                            autoFocus
                            required
                        />
                    </Grid>

                    <Grid item xs={12} style={{ padding: '4px 8px' }}>
                        <Typography component='p' variant='caption'>
                            <span 
                                className={styles.link}
                                onClick={handleTokenRequest}
                            >
                                Clique aqui se seu código de ativação expirou.
                            </span>
                        </Typography>
                    </Grid>

                    <Grid item xs={12} style={{ padding: '4px 8px' }}>
                        <Typography component='p' variant='caption'>
                            <b>Dica:</b> O e-mail com o token de ativação pode estar na Caixa de Spam do seu e-mail.
                        </Typography>
                    </Grid>

                    <Grid item xs={12} style={{ padding: '4px 8px' }}>
                        <Typography component='p' variant='caption'>
                            <b>Atenção:</b> Após ativar a sua conta <b>você precisará realizar a autenticação novamente</b>, mas logo após se autenticar, poderá criar anúncios e candidatar-se como um adotante! 🐱🐶 
                        </Typography>
                    </Grid>

                </Grid>

            </DialogContent>

            <DialogActions >
                
                <Grid container justify='center'>
                    <Grid item xs={ isAtMinViewPort ? 12 : false } style={{ textAlign:  isAtMinViewPort ? 'center' : 'start' }}>
                        <Button 
                            onClick={handleActivateAcc}
                            // disabled={activeStep === 0}
                            variant='contained'
                            color='primary'
                            size='small'
                            className={styles.formButton}
                            style={ isAtMinViewPort ? mobileStyleForButtons : {} }
                        >
                            Ativar
                        </Button>
                    </Grid>

                    <Grid item xs={ isAtMinViewPort ? 12 : false } style={{ textAlign:  isAtMinViewPort ? 'center' : 'start' }}>
                        <Button 
                            onClick={handleClear}
                            // disabled={activeStep === 0}
                            variant='contained'
                            color='primary'
                            size='small'
                            className={styles.formButton}
                            style={ isAtMinViewPort ? mobileStyleForButtons : {} }
                        >
                            Limpar
                        </Button>
                    </Grid>

                    <Grid item xs={ isAtMinViewPort ? 12 : false } style={{ textAlign:  isAtMinViewPort ? 'center' : 'start' }}>
                        <Button 
                            onClick={handleGoBackAndClear}
                            // disabled={activeStep === 0}
                            variant='contained'
                            color='primary'
                            size='small'
                            className={styles.formButton}
                            style={ isAtMinViewPort ? mobileStyleForButtons : {} }
                        >
                            Voltar
                        </Button>
                    </Grid>

                </Grid>

            </DialogActions>


        </Dialog>
    );
    
}

UserAccActivationDialog.propTypes = {
    openDialog: PropTypes.bool.isRequired,
    closeDialog: PropTypes.func.isRequired,
    // userAddressData: PropTypes.object.isRequired,
    // setUserAddressData: PropTypes.func.isRequired
}

// Redux Store Mapping.
const mapStateToProps = (state) => {
    return {
        userData: state.user
        // announcementsData: state.announcements
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        // openSnackbar: (message, severity) => { return dispatch( openSnackbar(message, severity) ) }
        // fetchAnnouncements: (page, limit) => { return dispatch( fetchAnnouncements(page, limit) ) },
        fetchUser: () => { return dispatch ( fetchUser() ) },
        clearUser: () => { return dispatch ( clearUser() ) },
    }
}

// Exportações.
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserAccActivationDialog);