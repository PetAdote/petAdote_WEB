// Importações.
import { useState, useEffect, useRef, useCallback } from 'react';
import { useHistory, Link } from 'react-router-dom';
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
import { useTheme, useMediaQuery,
         Grid, Dialog, DialogTitle, DialogContent, DialogActions, List,
         ListItem, ListItemIcon, ListItemText, Divider, Typography, IconButton,
         TextField, Button, MenuItem, Grow, CircularProgress } 
    from '@material-ui/core';

import { Close, Visibility, VisibilityOff }
    from '@material-ui/icons';

import UserAvatar from './UserAvatar';

import PendingCandidatesListItem from './PendingCandidatesListItem';

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
const PendingCandidatesList = (props) => {

    const { announcementDetails, setApprovedCandidatureData, setCandidatesDialogLoading } = props;

    const styles = useStyles();
    const theme = useTheme();
    const { enqueueSnackbar } = useSnackbar();
    const history = useHistory();

    const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
    const isAtMinViewPort = useMediaQuery(theme.breakpoints.down('xs'));

    const mobileStyleForButtons = {
        minWidth: '100%',
        margin: '8px 0'
    }

    const [isLoading, setIsLoading] = useState(false);
    const [pendingCandidaturesArr, setPendingCandidaturesArr] = useState([]);

    // Sistema de paginação com infinite scrolling.
    const observer = useRef();

    const [pageToFetch, setPageToFetch] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    const lastElement = useCallback((node) => {
        if (isLoading) { return }

        if (observer.current) {
            observer.current.disconnect();
        }

        observer.current = new IntersectionObserver((entries) => {
            
            if (entries[0].isIntersecting && hasMore){
                setIsLoading(true);
                setPageToFetch(pageToFetch + 1);

                axios.get(`/anuncios/candidaturas/`, {
                    params: {
                        getAll: 'under_evaluation',
                        fromAnnouncement: announcementDetails.anuncio.cod_anuncio,
                        page: pageToFetch,
                        limit: 10
                    }
                })
                .then((response) => {

                    if (response.data.candidaturas){
                        let refreshedCandidaturesList = pendingCandidaturesArr || response.data.candidaturas;
                        let duplicates = [];

                        if (pendingCandidaturesArr.length > 0){

                            response.data.candidaturas.forEach((newCandidature, newCandidatureIndex) => {
                                pendingCandidaturesArr.forEach((candidature) => {
                                    if (newCandidature.cod_candidatura === candidature.cod_candidatura){
                                        duplicates.push(newCandidatureIndex);
                                    }
                                });
                            });

                            response.data.candidaturas.forEach((newCandidature, newCandidatureIndex) => {
                                if (!duplicates.includes(newCandidatureIndex)){
                                    refreshedCandidaturesList.push(newCandidature);
                                }
                            });

                        }
                        setPendingCandidaturesArr(refreshedCandidaturesList);

                    }

                    if (response.data.avancar_pagina){
                        setHasMore(true);
                    } else {
                        setHasMore(false);
                    }

                    setIsLoading(false);

                })
                .catch((error) => {

                    console.log('[PendingCandidatesList.js] unexpected error @ fetch candidatures:', error?.response?.data || error?.message);
    
                    const errorMsg = error.response?.data?.error?.mensagem || error.response?.data?.mensagem || 'Falha ao capturar as candidaturas em avaliação.';
    
                    enqueueSnackbar(errorMsg, { variant: 'warning' });
                    hasMore(false);
                    setIsLoading(false);

                });

            }

            if (entries[0].isIntersecting && !hasMore){
                enqueueSnackbar('Fim da lista de candidaturas pendentes.', { variant: 'info' });
            }

        });

        if (node) {
            observer.current.observe(node);
        }

    }, [
        announcementDetails.anuncio.cod_anuncio, enqueueSnackbar,
        hasMore, isLoading, pageToFetch, pendingCandidaturesArr
    ]);
    // Fim do sistema de paginação com infinite scrolling.

    const handleClearCandidatesList = () => {
        setPendingCandidaturesArr([]);
    }
    
    useEffect(() => {

        if (pendingCandidaturesArr.length === 0){
            
            // console.log('[PendingCandidatesList.js] ann. details:', announcementDetails);
            // console.log('[PendingCandidatesList.js] ann. props:', props);

            setIsLoading(true);

            axios.get(`/anuncios/candidaturas/`, {
                params: {
                    getAll: 'under_evaluation',
                    fromAnnouncement: announcementDetails.anuncio.cod_anuncio,
                    page: 1,
                    limit: 10
                }
            })
            .then((response) => {
                
                if (response.data.candidaturas){
                    console.log('[PendingCandidatesList.js] first batch of pending candidatures:', response.data.candidaturas);

                    setPendingCandidaturesArr(pendingCandidaturesArr.concat(response.data.candidaturas));
                }

                if (response.data.avancar_pagina){
                    setHasMore(true);
                } else {
                    setHasMore(false);
                }

                setIsLoading(false);
            })
            .catch((error) => {

                console.log('[PendingCandidatesList.js] unexpected error @ first fetch:', error?.response?.data || error?.message);

                const errorMsg = error.response?.data?.error?.mensagem || error.response?.data?.mensagem || 'Falha ao atualizar o avatar.';

                enqueueSnackbar(errorMsg, { variant: 'warning' });
                setIsLoading(false);

            });

        }

    }, [pendingCandidaturesArr, announcementDetails, enqueueSnackbar]);


    return (
        <Grid container>
            {
                pendingCandidaturesArr.length > 0 ?

                    pendingCandidaturesArr.map((candidatureData, index) => {

                        if (pendingCandidaturesArr.length === index + 1){
                            return (
                                <Grid item key={`candidate-${candidatureData.candidato.cod_usuario}`} xs={12} ref={lastElement}
                                    style={{ padding: '16px 0', borderBottom: '1px solid lightgrey'}}
                                >
                                    <Grid container>
                                        <PendingCandidatesListItem
                                            setApprovedCandidatureData={setApprovedCandidatureData}
                                            clearList={handleClearCandidatesList} 
                                            candidatureData={candidatureData} 
                                            setCandidatesDialogLoading={setCandidatesDialogLoading}
                                        />
                                    </Grid>
                                </Grid>
                            )
                        }
                        
                        return (
                            <Grid item key={`candidate-${candidatureData.candidato.cod_usuario}`} xs={12}
                                style={{ padding: '16px 0', borderBottom: '1px solid lightgrey'}}
                            >
                                <Grid container>
                                    <PendingCandidatesListItem 
                                        setApprovedCandidatureData={setApprovedCandidatureData}
                                        clearList={handleClearCandidatesList} 
                                        candidatureData={candidatureData} 
                                        setCandidatesDialogLoading={setCandidatesDialogLoading}
                                    />
                                </Grid>
                            </Grid>
                        )
                    })

                : 
                isLoading ? 
                    <Grid item xs={12} style={{ display: 'flex', margin: '16px', alignItems: 'center', justifyContent: 'center', height: '120px' }}>
                        <CircularProgress />
                    </Grid>
                :
                    <Grid item xs={12} style={{ display: 'flex', margin: '16px', alignItems: 'center', justifyContent: 'center', height: '120px', wordBreak: 'break-all' }}>
                        <Typography component='p' align='center'>Não houve nenhuma candidatura para adoção {announcementDetails.animal.genero === 'M' ? 'do' : 'da'} {announcementDetails.animal.nome}</Typography>
                    </Grid>
            }
            
        </Grid>
    );
}

PendingCandidatesList.propTypes = {
    announcementDetails: PropTypes.object.isRequired
}

// Exportações.
export default PendingCandidatesList;