// Importações.
import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// Utilidades.
import axios from '../helpers/axiosInstance';
// import { Link, useHistory } from 'react-router-dom';
import { makeStyles }
    from '@material-ui/core/styles';

import { useSnackbar } from 'notistack';

// Actions.
// import {  }
//     from '../redux/actions';

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
        }
        
    }
});

// Functional Component.
const UserAccDataDialog = (props) => {

    const { openDialog, closeDialog } = props;
    const { user } = props.userData;

    const styles = useStyles();
    const theme = useTheme();
    const { enqueueSnackbar } = useSnackbar();

    const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
    const isAtMinViewPort = useMediaQuery(theme.breakpoints.down('xs'));

    const initialAccData = {
        password: '',
        passwordConfirm: ''
    };

    const [newAccData, setNewAccData] = useState(initialAccData);
    const [showPassword, setShowPassword] = useState(false);

    const handleClose = (newDecision) => {
        if (newDecision) {
            closeDialog(newDecision);
        }

        closeDialog();
    }

    // const handleEntering = () => {
        // Se for necessário executar algo quando o dialog aparece, faça aqui.
    // }

    const handleUpdateAcc = () => {
        console.log(newAccData);

        if (JSON.stringify(initialAccData) !== JSON.stringify(newAccData)){
            axios.patch(`/contas/${user.cod_usuario}`, {
                senha: newAccData.password !== '' ? newAccData.password || undefined : undefined,
                confirma_senha: newAccData.passwordConfirm !== '' ? newAccData.passwordConfirm || undefined : undefined,
            })
            .then((response) => {
                if (response.data){
                    console.log(response.data);

                    enqueueSnackbar('Senha alterada com sucesso!', { variant: 'success' });
                    setNewAccData(initialAccData);
                    handleClose();
                }
            })
            .catch((error) => {
                console.log(error.response?.data || error.response || error.message || 'UNKNOWN_ERROR' );

                const errorMsg = error.response?.data?.error?.mensagem || error.response?.data?.mensagem || 'Falha ao atualizar as credenciais.';

                enqueueSnackbar(errorMsg, { variant: 'warning' });
            });
        }
        
    }

    const handleClear = () => {
        setNewAccData(initialAccData);
    }

    const handleGoBackAndClear = () => {
        setNewAccData(initialAccData);
        handleClose();
    }

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
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
            // onEntering={handleEntering}
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
                                <Typography component='h1' variant='h6' align='center'>Conta</Typography>
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
                            id="password"
                            name="password"
                            label="Senha"
                            type={showPassword ? 'text' : 'password'}
                            variant="outlined"
                            size="small"
                            value={newAccData.password}
                            onChange={ (ev) => { setNewAccData({ ...newAccData, password: ev.target.value }) } }
                            InputLabelProps={{
                                shrink: true
                            }}
                            InputProps={{
                                endAdornment:
                                    <IconButton onClick={handleClickShowPassword} tabIndex='-1' >
                                        {showPassword ? <Visibility /> : <VisibilityOff /> }
                                    </IconButton>
                            }}
                            fullWidth
                            autoFocus
                            required
                        />
                    </Grid>

                    <Grid item xs={12} className={styles.formInput}>
                        <TextField
                            id="passwordConfirm"
                            name="passwordConfirm"
                            label="Confirme sua senha"
                            type={showPassword ? 'text' : 'password'}
                            variant="outlined"
                            size="small"
                            value={newAccData.passwordConfirm}
                            onChange={ (ev) => { setNewAccData({ ...newAccData, passwordConfirm: ev.target.value }) } }
                            InputLabelProps={{
                                shrink: true
                            }}
                            InputProps={{
                                endAdornment: 
                                    <IconButton onClick={handleClickShowPassword} tabIndex='-1' >
                                        {showPassword ? <Visibility /> : <VisibilityOff /> }
                                    </IconButton>
                            }}
                            fullWidth
                            required
                        />
                    </Grid>

                    <Grid item xs={12} style={{ padding: '4px 8px' }}>
                        <Typography component='p' variant='caption'>
                            ⚠️ <b>Atenção:</b> Ao <b>salvar</b> sua senha será alterada imediatamente. Utilize a nova senha na sua próxima autenticação.
                        </Typography>
                    </Grid>

                </Grid>

            </DialogContent>

            <DialogActions >
                
                <Grid container justify='center'>
                    <Grid item xs={ isAtMinViewPort ? 12 : false } style={{ textAlign:  isAtMinViewPort ? 'center' : 'start' }}>
                        <Button 
                            onClick={handleUpdateAcc}
                            // disabled={activeStep === 0}
                            variant='contained'
                            color='primary'
                            size='small'
                            className={styles.formButton}
                            style={ isAtMinViewPort ? mobileStyleForButtons : {} }
                        >
                            Salvar
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

UserAccDataDialog.propTypes = {
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
        // fetchUser: () => { return dispatch ( fetchUser() ) },
    }
}

// Exportações.
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserAccDataDialog);