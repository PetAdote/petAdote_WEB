// Importações.
// import { useState, useEffect, useRef, useCallback } from 'react';
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
            margin: '8px',
            [theme.breakpoints.up('sm')]: {
                width: '150px'
            }
        },
        reconsiderButton: {
            width: '150px',
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
        }
    }
});

// Functional Component.
const RejectedCandidatesListItem = (props) => {

    const { candidatureData, clearList } = props;

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

    const handleReconsiderCandidature = () => {
        // console.log('Código usuário reconsiderado:', candidatureData.candidato.cod_usuario);

        enqueueSnackbar('Deseja realmente reconsiderar esta candidatura?', {
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

            axios.patch(`/anuncios/candidaturas/${candidatureData.cod_candidatura}`, {
                estado_candidatura: 'Em avaliacao'
            })
            .then((response) => {
                console.log('[RejectedCandidatesListItem.js] candidature reconsidered:', response.data);

                closeSnackbar(snackKey);
                enqueueSnackbar('A candidatura foi reconsiderada.', { variant: 'success' });
                clearList();
            })
            .catch((error) => {

                console.log('[RejectedCandidatesListItem.js] unexpected error @ reconsider candidature:', error?.response?.data || error?.message);

                const errorMsg = error.response?.data?.error?.mensagem || error.response?.data?.mensagem || 'Falha ao reconsiderar uma candidatura.';

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
                            <Typography component='p' variant='subtitle2' align='center'> Data rejeição </Typography>
                            <Typography component='p' variant='subtitle2' align='center'>
                                {new Date(candidatureData.data_modificacao).toLocaleString()}
                            </Typography>
                        </Grid>

                    </Grid>
                </Grid>

                <Grid item xs={8} style={{ overflow: 'auto' }} >
                    <Grid container justify='center' alignItems='center' style={{ height: '100%', padding: '0 8px' }}>

                        <Grid item xs={12} style={{ padding: '8px 0', wordBreak: 'break-all' }}>
                            <Typography component='h2' variant='h5' align='center'>
                                {candidatureData.candidato.primeiro_nome + ' ' + candidatureData.candidato.sobrenome}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center'}}>
                            <Button
                                onClick={handleReconsiderCandidature}
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
            // </Grid>
        // </Grid>
    );
}

RejectedCandidatesListItem.propTypes = {
    candidatureData: PropTypes.object.isRequired
    // userAddressData: PropTypes.object.isRequired,
    // setUserAddressData: PropTypes.func.isRequired
}

// Exportações.
export default RejectedCandidatesListItem;