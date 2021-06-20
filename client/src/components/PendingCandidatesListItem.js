// Importações.
import { useState } from 'react';
import {  Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// Utilidades.
import axios from '../helpers/axiosInstance';
import { makeStyles }
    from '@material-ui/core/styles';

import { useSnackbar } from 'notistack';

// Actions.
// import { fetchUser }
//     from '../redux/actions';

// Componentes.
import { 
         Grid, Typography, IconButton, Button } 
    from '@material-ui/core';

// import { Close, Visibility, VisibilityOff }
//     from '@material-ui/icons';

import UserAvatar from './UserAvatar';

import CandidatureApprovalDialog from './CandidatureApprovalDialog';

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
            width: '80px',
            margin: '8px'
        },
        selectableImg: {
            boxShadow: '0px 0px 5px 0px grey',
            borderRadius: '4px',
            border: '2px solid white',
            minWidth: '150px',
            maxWidth: '150px',
            minHeight: '150px',
            maxHeight: '150px',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        link: {
            textDecoration: 'none',
            color: '#2b78e4',
            "&:hover": {
                color: '#085394',
                cursor: 'pointer'
            }
        },
        approveBtn: {
            width: '80px',
            margin: '8px',
            backgroundColor: 'forestgreen',
            '&:hover': {
                backgroundColor: 'green'
            },
            [theme.breakpoints.up('sm')]: {
                width: '150px'
            }

        },
        rejectBtn: {
            width: '80px',
            margin: '8px',
            backgroundColor: 'grey',
            '&:hover': {
                backgroundColor: 'dimgrey'
            },
            [theme.breakpoints.up('sm')]: {
                width: '150px'
            }
        }
        
    }
});

// Functional Component.
const PendingCandidatesListItem = (props) => {

    const { candidatureData, clearList, setApprovedCandidatureData, setCandidatesDialogLoading} = props;

    const [openApprovalDialog, setOpenApprovalDialog] = useState(false);
    const [approvalDialogDecision, setApprovalDialogDecision] = useState(null);

    const styles = useStyles();
    // const theme = useTheme();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    // const history = useHistory();

    // const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
    // const isAtMinViewPort = useMediaQuery(theme.breakpoints.down('xs'));

    // const mobileStyleForButtons = {
    //     minWidth: '100%',
    //     margin: '8px 0'
    // }

    const handleOpenApprovalDialog = () => {
        setOpenApprovalDialog(true);
    }

    const handleCloseApprovalDialog = (newDecision) => {
        setOpenApprovalDialog(false);

        if (newDecision === 'ADOPTION_LOCATION_IS_SET'){

            setCandidatesDialogLoading(true);

            axios.patch(`/anuncios/candidaturas/${candidatureData.cod_candidatura}`, {
                estado_candidatura: 'Aprovada'
            })
            .then((response) => {
                console.log('[PendingCandidatesListItem.js] candidature approved:', response.data);

                enqueueSnackbar('A candidatura foi aprovada!', { variant: 'success', autoHideDuration: 20 * 1000 });
                clearList();
                setApprovedCandidatureData({ ...candidatureData, data_modificacao: response.data?.candidatura?.data_modificacao });
                setCandidatesDialogLoading(false);
            })
            .catch((error) => {

                console.log('[PendingCandidatesListItem.js] unexpected error @ approve candidature:', error?.response?.data || error?.message);

                const errorMsg = error.response?.data?.error?.mensagem || error.response?.data?.mensagem || 'Falha ao aprovar uma candidatura.';

                enqueueSnackbar(errorMsg, { variant: 'error' });
                setCandidatesDialogLoading(false);

            });

        }

        if (newDecision){
            setApprovalDialogDecision(newDecision);
        }
    }

    const handleApproveCandidature = () => {
        // console.log('Código usuário aprovado:', candidatureData.candidato.cod_usuario);
        // console.log('[PendingCandidatesListItem.js] props:', props);

        enqueueSnackbar('É necessário configurar o local de encontro.', {
            variant: 'info',
            action: (key) => (
                <>
                    <Button size="small" onClick={ () => { handleOpenApprovalDialog(); closeSnackbar(key) } }>
                        Okay!
                    </Button>
                    <Button size="small" onClick={ () => { closeSnackbar(key) } }>
                        Cancelar
                    </Button>
                </>
            ),
            persist: true
        });

        // const approveCandidature = (snackKey) => {

        //     axios.patch(`/anuncios/candidaturas/${candidatureData.cod_candidatura}`, {
        //         estado_candidatura: 'Aprovada'
        //     })
        //     .then((response) => {
        //         console.log('[PendingCandidatesListItem.js] candidature approved:', response.data);

        //         closeSnackbar(snackKey);
        //         enqueueSnackbar('A candidatura foi aprovada!', { variant: 'success' });
        //         clearList();
        //         setApprovedCandidatureData(candidatureData);
        //     })
        //     .catch((error) => {

        //         console.log('[PendingCandidatesListItem.js] unexpected error @ approve candidature:', error?.response?.data || error?.message);

        //         const errorMsg = error.response?.data?.error?.mensagem || error.response?.data?.mensagem || 'Falha ao aprovar uma candidatura.';

        //         closeSnackbar(snackKey);
        //         enqueueSnackbar(errorMsg, { variant: 'error' });

        //     });

        // }
        
    }

    const handleRejectCandidature = () => {
        // console.log('Código usuário rejeitado:', candidatureData.candidato.cod_usuario);

        enqueueSnackbar('Deseja realmente rejeitar a candidatura?', {
            variant: 'warning',
            action: (key) => (
                <>
                    <Button size="small" onClick={ () => { rejectCandidature(key) } }>
                        'Sim'
                    </Button>
                    <Button size="small" onClick={ () => { closeSnackbar(key) } }>
                        'Não'
                    </Button>
                </>
            ),
            persist: true
        });

        const rejectCandidature = (snackKey) => {

            axios.patch(`/anuncios/candidaturas/${candidatureData.cod_candidatura}`, {
                estado_candidatura: 'Rejeitada'
            })
            .then((response) => {
                console.log('[PendingCandidatesListItem.js] candidature rejected:', response.data);

                closeSnackbar(snackKey);
                enqueueSnackbar('A candidatura foi rejeitada.', { variant: 'success' });
                clearList();
            })
            .catch((error) => {

                console.log('[PendingCandidatesListItem.js] unexpected error @ reject candidature:', error?.response?.data || error?.message);

                const errorMsg = error.response?.data?.error?.mensagem || error.response?.data?.mensagem || 'Falha ao rejeitar uma candidatura.';

                closeSnackbar(snackKey);
                enqueueSnackbar(errorMsg, { variant: 'error' });
    
            });

        }

    }

    return (
        // <Grid item xs={12} style={{ padding: '16px 0', borderBottom: '1px solid lightgrey'}}>
            // <Grid container>
        <>
                <Grid item xs={4} style={{ display: 'flex', alignItems: 'center', overflow: 'auto', padding: '0 8px' }} >
                    <Grid container>

                        <Grid item xs={12} component={Link} to={`/usuario/${candidatureData.candidato.cod_usuario}`} style={{ textAlign: 'center' }}>
                            <IconButton size='small'>
                                <UserAvatar
                                    user={candidatureData.candidato}
                                    avatarUrl={candidatureData.candidato.download_foto_candidato.split(' ')[1]}
                                    width='80px'
                                    height='80px'
                                    badgesWidth='15px'
                                    badgesHeight='15px'
                                    customStyle={{
                                        boxShadow: '0px 0px 8px 0px grey',
                                    }}
                                    showOngBadge
                                />
                            </IconButton>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography component='p' variant='subtitle2' align='center'> Data cadidatura </Typography>
                            <Typography component='p' variant='subtitle2' align='center'>
                                {new Date(candidatureData.data_criacao).toLocaleString()}
                            </Typography>
                        </Grid>

                    </Grid>
                </Grid>

                <Grid item xs={8} >
                    <Grid container justify='center' alignItems='center' style={{ height: '100%', padding: '0 8px' }}>

                        <Grid item xs={12} style={{ padding: '8px 0', wordBreak: 'break-all' }}>
                            <Typography component='h2' variant='h5' align='center'>
                                {candidatureData.candidato.primeiro_nome + ' ' + candidatureData.candidato.sobrenome}
                            </Typography>
                        </Grid>

                        <Grid item>
                            <Button
                                onClick={handleApproveCandidature}
                                size="small"
                                color="primary"
                                variant="contained"
                                className={styles.approveBtn}
                            >
                                Aprovar
                            </Button>
                        </Grid>

                        <Grid item>
                            <Button
                                onClick={handleRejectCandidature}
                                size="small"
                                color="primary"
                                variant="contained"
                                className={styles.rejectBtn}
                            >
                                Rejeitar
                            </Button>
                        </Grid>

                    </Grid>
                </Grid>

            <CandidatureApprovalDialog 
                keepMounted
                openDialog={openApprovalDialog}
                closeDialog={handleCloseApprovalDialog}
                candidatureData={candidatureData}
            />

        </>
            // </Grid>
        // </Grid>
    );
}

PendingCandidatesListItem.propTypes = {
    candidatureData: PropTypes.object.isRequired,
    clearList: PropTypes.func.isRequired
    // userAddressData: PropTypes.object.isRequired,
    // setUserAddressData: PropTypes.func.isRequired
}

// Exportações.
export default PendingCandidatesListItem;