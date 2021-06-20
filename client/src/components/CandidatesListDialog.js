// Importações.
import { useState, useEffect, useRef, useCallback } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// Utilidades.
import axios from '../helpers/axiosInstance';
// import { Link, useHistory } from 'react-router-dom';
import { makeStyles }
    from '@material-ui/core/styles';

import { useSnackbar } from 'notistack';

// Actions.
import { fetchUser }
    from '../redux/actions';

// Componentes.
import { useTheme, useMediaQuery,
         Grid, Dialog, DialogTitle, DialogContent, DialogActions, List,
         ListItem, ListItemIcon, ListItemText, Divider, Typography, IconButton,
         TextField, Button, MenuItem, Grow, AppBar, Tabs, Tab, CircularProgress } 
    from '@material-ui/core';

import { Close, Visibility, VisibilityOff }
    from '@material-ui/icons';

import UserAvatar from './UserAvatar';

import TabPanel from './TabPanel';

import PendingCandidatesList from './PendingCandidatesList';
import RejectedCandidatesList from './RejectedCandidatesList';

// Inicializações.
const useStyles = makeStyles((theme) => {
    return {
        candidatesListDialog: {
            width: '800px',
            backgroundColor: 'ghostwhite',
            [theme.breakpoints.between('sm', 'lg')]: {
                right: '4px'
            }
        },
        formInput: {
            padding: '8px 0'
        },
        formButton: {
            width: '100px',
            margin: '8px',
            [theme.breakpoints.up('sm')]: {
                width: '150px'
            }
        },
        reconsiderButton: {
            width: '150px',
            margin: '8px',
            backgroundColor: 'grey',
            '&:hover': {
                backgroundColor: 'dimgrey'
            }
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
        contentMenuBarColor: {
            backgroundColor: 'ghostwhite',
        },
        contentMenuBarRoot: {
            boxShadow: '0 4px 4px 0px rgba(0, 0, 0, 0.1)'
        }
        
    }
});

// Functional Component.
const CandidatesListDialog = (props) => {

    const { openDialog, closeDialog, announcementDetails } = props;
    const { user } = props.userData;

    const styles = useStyles();
    const theme = useTheme();
    const { enqueueSnackbar,closeSnackbar } = useSnackbar();

    const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
    const isAtMinViewPort = useMediaQuery(theme.breakpoints.down('xs'));

    const mobileStyleForButtons = {
        minWidth: '100%',
        margin: '8px 0'
    }

    const [isLoading, setIsLoading] = useState(true);
    const [approvedCandidatureData, setApprovedCandidatureData] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    const [tabValue, setTabValue] = useState(0);

    const handleClose = (newDecision) => {
        if (newDecision) {
            return closeDialog(newDecision);
        }

        closeDialog();
    }

    const handleEntering = () => {
     
        if (!user){
            return handleClose();
        }

        axios.get(`/anuncios/candidaturas/`, {
            params: {
                getAll: 'approved',
                fromAnnouncement: announcementDetails.anuncio.cod_anuncio,
                page: 1,
                limit: 10
            }
        })
        .then((response) => {
            if (response.data.candidaturas?.length > 0){
                setApprovedCandidatureData(response.data.candidaturas[0]);
            } else {
                setApprovedCandidatureData(null);
            }

            setIsLoading(false);
        })
        .catch((error) => {

            console.log('[CandidatesListDialog.js] unexpected error @ fetch approved candidature data:', error?.response?.data || error?.message);
    
            const errorMsg = error.response?.data?.error?.mensagem || error.response?.data?.mensagem || 'Falha ao capturar a candidatura aprovada.';

            enqueueSnackbar(errorMsg, { variant: 'warning' });
            setIsLoading(false);

        });

    }

    const handleGoBackAndClear = (newDecision) => {
        setTabValue(0);
        handleClose(newDecision);
    }

    const handleContentTabChange = (ev, newValue) => {
        setTabValue(newValue);
    }
    
    const tabProps = (index) => {
        return {
            id: `content-tab-${index}`,
            'aria-controls': `content-tabpanel-${index}`
        }
    }

    const handleReconsiderApproval = () => {

        // console.log('Aprovação sendo reconsiderada:', approvedCandidatureData);
    
        enqueueSnackbar('Deseja realmente reconsiderar a aprovação da candidatura?', {
            variant: 'warning',
            action: (key) => (
                <>
                    <Button size="small" onClick={ () => { reconsiderCandidature(key) } }>
                        'Sim'
                    </Button>
                    <Button size="small" onClick={ () => { closeSnackbar(key) } }>
                        'Não'
                    </Button>
                </>
            ),
            persist: true
        });
        
        const reconsiderCandidature = (snackKey) => {

            axios.patch(`/anuncios/candidaturas/${approvedCandidatureData.cod_candidatura}`, {
                estado_candidatura: 'Em avaliacao'
            })
            .then((response) => {
                console.log('[CandidatesListDialog.js] candidature reconsidered:', response.data);

                closeSnackbar(snackKey);
                enqueueSnackbar('A candidatura foi reconsiderada.', { variant: 'success' });
                setApprovedCandidatureData(null);
            })
            .catch((error) => {

                console.log('[CandidatesListDialog.js] unexpected error @ reconsider candidature:', error?.response?.data || error?.message);

                const errorMsg = error.response?.data?.error?.mensagem || error.response?.data?.mensagem || 'Falha ao reconsiderar uma candidatura.';

                closeSnackbar(snackKey);
                enqueueSnackbar(errorMsg, { variant: 'error' });

            });

        }
    

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
                paper: styles.candidatesListDialog
            }}
            disableBackdropClick
            // disableEscapeKeyDown
        >

            <DialogTitle style={{ padding: '8px' }} id="simple-dialog-title">
                <Grid container alignItems='center' justify='space-between'>
                    
                    {
                        isLoading ?
                            <Grid item xs>
                                <Grid container>
                                    <Grid item xs={12} style={{ overflow: 'auto', whiteSpace: 'nowrap' }}>
                                        <Typography component='h1' variant='h6' align='left'>Candidaturas</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        :
                        <>
                            <Grid item xs={11} sm>
                                <Grid container>
                                    <Grid item xs={12} style={{ overflow: 'auto', whiteSpace: 'nowrap' }}>
                                        <Typography component='h1' variant='h6' align='left'>Candidaturas</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={1} style={{ display: 'flex', justifyContent: 'center'}}>
                                <IconButton size='small' onClick={() => { handleGoBackAndClear(); }} >
                                    <Close style={{ padding: '4px' }} />
                                </IconButton>
                            </Grid>
                        </>
                    }

                </Grid>
            </DialogTitle>

            <DialogContent style={{ padding: '8px' }} dividers>
            
                <Grid container style={{ padding: '0 8px'}}>

                    <Grid item xs={12}>
                        { 
                            !isLoading ?
                                <Typography component='h2' variant='h6' align='center'>Candidato aprovado</Typography>                        
                            : null
                        }
                    </Grid>

                    <Grid item xs={12} style={{ padding: '8px 0' }}>
                        <Grid container>

                            {
                                isLoading ?
                                    <Grid item xs={12} style={{ display: 'flex', margin: '16px', alignItems: 'center', justifyContent: 'center', height: '120px' }}>
                                        <CircularProgress />
                                    </Grid>
                                : null
                            }
                            {
                                approvedCandidatureData ?
                                <>
                                    <Grid item xs={12} style={{ padding: '0 0 16px' }}>
                                        <Typography component='h2' variant='caption' align='center'>Por favor, verifique a sua lista de documentos para visualizar e imprimir os <b>termos de responsabilidades</b> que serão necessários para a etapa final da adoção do animal.</Typography>
                                    </Grid>

                                    <Grid item xs={4} style={{ display: 'flex', alignItems: 'center', overflow: 'auto', padding: '0 8px' }} >
                                        <Grid container>

                                            <Grid item xs={12} component={Link} to={`/usuario/${approvedCandidatureData.candidato.cod_usuario}`} style={{ textAlign: 'center' }}>
                                                <IconButton size='small'>
                                                    <UserAvatar
                                                        user={approvedCandidatureData.candidato}
                                                        avatarUrl={approvedCandidatureData.candidato.download_foto_candidato.split(' ')[1]}
                                                        width='80px'
                                                        height='80px'
                                                        badgesWidth='15px'
                                                        badgesHeight='15px'
                                                        customStyle={{
                                                            boxShadow: '0px 0px 8px 0px green',
                                                        }}
                                                        showOngBadge
                                                    />
                                                </IconButton>
                                            </Grid>

                                            <Grid item xs={12}>
                                                <Typography component='p' variant='subtitle2' align='center'> Data aprovação </Typography>
                                                <Typography component='p' variant='subtitle2' align='center'>
                                                    {new Date(approvedCandidatureData.data_modificacao).toLocaleString()}
                                                </Typography>
                                            </Grid>

                                        </Grid>
                                    </Grid>

                                    <Grid item xs={8} style={{ overflow: 'auto' }} >
                                        <Grid container justify='center' alignItems='center' style={{ height: '100%', padding: '0 8px'}}>

                                            <Grid item xs={12} style={{ padding: '8px 0', wordBreak: 'break-all' }}>
                                                <Typography component='h2' variant='h5' align='center'>
                                                    <b>{approvedCandidatureData.candidato.primeiro_nome + ' ' + approvedCandidatureData.candidato.sobrenome}</b>
                                                </Typography>
                                            </Grid>

                                            <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center'}}>
                                                <Button
                                                    onClick={handleReconsiderApproval}
                                                    size="small"
                                                    color="primary"
                                                    variant="contained"
                                                    className={styles.reconsiderButton}
                                                >
                                                    Reconsiderar
                                                </Button>
                                            </Grid>

                                        </Grid>
                                    </Grid>
                                </>
                                : 
                                    !isLoading ?
                                        <Grid item xs={12}>
                                            <Typography component='p' align='center'>Até o momento, nenhum candidato foi aprovado como adotante.</Typography>
                                        </Grid>
                                    : null
                            }
                            


                        </Grid>
                    </Grid>

                </Grid>

            </DialogContent>

            {
                (!isLoading && !approvedCandidatureData) ?
                    <>
                    <DialogContent style={{ padding: '0' }}>

                        <Grid container>     {/* Início - Menu de seleção de estados de candidatura */}

                            <Grid item xs={12} style={{ padding: '8px'}}>
                                <Typography component='h2' variant='h6' align='center'>Lista de candidatos</Typography>
                            </Grid>

                            <Grid item xs={12} style={{ borderBottom: '1px solid lightgrey' }}>
                                <AppBar position="static" color="default" classes={{ colorDefault: styles.contentMenuBarColor, root: styles.contentMenuBarRoot }}>
                                    <Tabs
                                        value={tabValue}
                                        onChange={handleContentTabChange}
                                        variant='fullWidth'
                                        scrollButtons="auto"
                                        aria-label="Menu de seleção de estados de candidatura"
                                        indicatorColor='primary'
                                    >
                                        <Tab label="Pendentes" { ...tabProps(0) } />
                                        <Tab label="Rejeitados" { ...tabProps(1) } />
                                    </Tabs>
                                </AppBar>
                            </Grid>

                        </Grid>     {/* Fim - Menu de seleção de estados de candidatura */}

                    </DialogContent>

                    <DialogContent style={{ padding: '0', maxHeight: '240px' }} >

                        <Grid container>

                            <Grid item xs={12}>
                                <TabPanel value={tabValue} index={0}>
                                    <PendingCandidatesList
                                        announcementDetails={announcementDetails}
                                        setApprovedCandidatureData={setApprovedCandidatureData}
                                        setCandidatesDialogLoading={setIsLoading}
                                    />
                                </TabPanel>
                                <TabPanel value={tabValue} index={1}>
                                    <RejectedCandidatesList
                                        announcementDetails={announcementDetails}
                                    />
                                </TabPanel>
                            </Grid>

                        </Grid>

                    </DialogContent>

                    </>
                :
                    null
            }

            

        </Dialog>
    );
    
}

CandidatesListDialog.propTypes = {
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
    }
}

// Exportações.
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CandidatesListDialog);