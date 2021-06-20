// Importações.
import { useState, useEffect, useRef, useCallback } from 'react';
import { connect } from 'react-redux';
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
         TextField, Button, MenuItem, Grow } 
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
        
    }
});

// Functional Component.
const AnnouncementRegistrationDialog = (props) => {

    const { openDialog, closeDialog } = props;
    const { animal } = props.petData;
    const { album_animal } = animal;
    const { user } = props.userData;

    const styles = useStyles();
    const theme = useTheme();
    const { enqueueSnackbar } = useSnackbar();

    const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
    const isAtMinViewPort = useMediaQuery(theme.breakpoints.down('xs'));

    const mobileStyleForButtons = {
        minWidth: '100%',
        margin: '8px 0'
    }

    const [newPhotoUidForAnn, setNewPhotoUidForAnn] = useState(''); // Ann = Announcement. Será o UID da foto contida no álbum do animal que será exibida no anúncio.

    const [photoForAnnAsFile, setPhotoForAnnAsFile] = useState(null);
    const [photoForAnnAsUrl, setPhotoForAnnAsUrl] = useState('');
    const [photoSelectionError, setPhotoSelectionError] = useState(null);

    const [petPhotosArr, setPetPhotosArr] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

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
                
                axios.get(`/usuarios/animais/albuns/fotos/`, {
                    params: {
                        getAllActiveFromAlbum: album_animal.cod_album,
                        page: pageToFetch,
                        limit: 10
                    }
                })
                .then((response) => {
    
                    if (response.data.fotos){
                        let refreshedPhotoList = petPhotosArr || response.data.fotos;
                        let duplicates = [];

                        if (petPhotosArr.length > 0){

                            response.data.fotos.forEach((newPhoto, newPhotoIndex) => {
                                petPhotosArr.forEach((photo) => {
                                    if (newPhoto.uid_foto === photo.uid_foto){
                                        duplicates.push(newPhotoIndex);
                                    }
                                });
                            });

                            response.data.fotos.forEach((newPhoto, newPhotoIndex) => {
                                if (!duplicates.includes(newPhotoIndex)){
                                    refreshedPhotoList.push(newPhoto);
                                }
                            });

                        }
                        setPetPhotosArr(refreshedPhotoList);
                    }

                    if (response.data.avancar_pagina){
                        setHasMore(true);
                    } else {
                        setHasMore(false);
                    }
    
                    setIsLoading(false);
                })
                .catch((error) => {
    
                    console.log('[PetRegistrationDialog.js/atFetchPetPhotosFromAlbum] unexpected error:', error?.response?.data || error?.message);
    
                    const errorMsg = error.response?.data?.error?.mensagem || error.response?.data?.mensagem || 'Falha ao atualizar o avatar.';
    
                    enqueueSnackbar(errorMsg, { variant: 'warning' });
                    hasMore(false);
                    setIsLoading(false);
                });

            }

            if (entries[0].isIntersecting && !hasMore){
                enqueueSnackbar('Fim das fotos do álbum.', { variant: 'info' });
            }

        });

        if (node) {
            observer.current.observe(node);
        }

    }, [
        album_animal.cod_album, enqueueSnackbar,
        hasMore, pageToFetch,
        petPhotosArr, isLoading
    ]);
    
    // Fim do sistema de paginação com infinite scrolling.

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

        // console.log('[AnnouncementRegistrationDialog.js] pet data:', animal);

        if (!animal.foto.includes('default')){
            setNewPhotoUidForAnn(animal.foto);

            setPhotoForAnnAsUrl(animal.download_foto);
        }

        if (petPhotosArr.length === 0){
            setIsLoading(true);

            axios.get(`/usuarios/animais/albuns/fotos/`, {
                params: {
                    getAllActiveFromAlbum: album_animal.cod_album,
                    page: 1,
                    limit: 10
                }
            })
            .then((response) => {

                if (response.data.fotos){
                    console.log('[AnnouncementRegistrationDialog.js] first batch of pet photos:', response.data.fotos);
                    setPetPhotosArr(petPhotosArr.concat(response.data.fotos));
                }

                if (response.data.avancar_pagina){
                    setHasMore(true);
                } else {
                    setHasMore(false);
                }

                setIsLoading(false);
            })
            .catch((error) => {

                console.log('[PetRegistrationDialog.js/atPetRegistration] unexpected error:', error?.response?.data || error?.message);

                const errorMsg = error.response?.data?.error?.mensagem || error.response?.data?.mensagem || 'Falha ao atualizar o avatar.';

                enqueueSnackbar(errorMsg, { variant: 'warning' });
                setIsLoading(false);
            });
        }

    }

    // const handleClear = () => {
    //     setNewActivationData(initialActivationData);
    // }

    const handleGoBackAndClear = () => {
        // setNewActivationData(initialActivationData);
        if (!animal.foto.includes('default')){
            setNewPhotoUidForAnn(animal.foto);

            setPhotoForAnnAsUrl(animal.download_foto);
        } else {
            setNewPhotoUidForAnn('');
            setPhotoForAnnAsUrl('');
        }

        setPhotoForAnnAsFile(null);
        setPhotoSelectionError(null);
        setIsLoading(false);

        setPageToFetch(1);
        setHasMore(false);

        setPetPhotosArr([]);

        handleClose();
    }

    const handleReset = () => {

        if (!animal.foto.includes('default')){
            setNewPhotoUidForAnn(animal.foto);
            setPhotoForAnnAsUrl(animal.download_foto);
        } else {
            setNewPhotoUidForAnn('');
            setPhotoForAnnAsUrl('');
        }

        setPhotoForAnnAsFile(null);

    }

    const handlePhotoSelection = async (ev) => {
        const selectedFile = await ev.target.files[0];

        if (selectedFile && !selectedFile.type.includes('image/')){
            setPhotoSelectionError('Unsupported File');
            return;
        }

        if (selectedFile){
            if (photoSelectionError) {
                setPhotoSelectionError(null);
            }
            setPhotoForAnnAsFile(selectedFile);

            const fileReader = new FileReader();
            fileReader.readAsDataURL(selectedFile);
            fileReader.onload = (event) => {
                setPhotoForAnnAsUrl(event.target.result)
            }
            
        }
        ev.target.value = null;
    }

    const handleSelectionFromAlbum = (photoUid, photoUrl) => {
        setNewPhotoUidForAnn(photoUid);

        setPhotoForAnnAsFile(null);
        setPhotoForAnnAsUrl(photoUrl);
    }

    const handleCreateAnnouncement = () => {

        if (photoForAnnAsFile) {
            // Adicione a foto ao álbum, capture o UID da foto e cadastre o anúncio utilizando o UID da foto adicionada ao álbum.

            const photoFormData = new FormData();
            photoFormData.append("foto", photoForAnnAsFile);

            return axios.post(`/usuarios/animais/albuns/fotos/${album_animal.cod_album}`, photoFormData, {
                headers: {
                    'Content-Type': undefined
                }
            })
            .then((response) => {

                const added_photo_uid = response?.data?.uid_foto;

                if (added_photo_uid) {

                    axios.post(`/anuncios/${animal.cod_animal}`, {
                        uid_foto_animal: added_photo_uid
                    })
                    .then((response) => {
                        console.log('[AnnouncementRegistrationDialog.js] announcement created:', response.data);

                        enqueueSnackbar('Anúncio criado com sucesso!', { variant: 'success' });
                        handleGoBackAndClear();
                    })
                    .catch((error) => {
                        console.log('[AnnouncementRegistrationDialog.js] unexpected error @ create ann. after add photo to album:', error?.response?.data || error?.message);

                        const errorMsg = error.response?.data?.error?.mensagem || error.response?.data?.mensagem || 'Falha ao cadastrar anúncio após adicionar foto ao álbum.';

                        handleReset();
                        enqueueSnackbar(errorMsg, { variant: 'error' });
                    });
                    
                }

            })
            .catch((error) => {

                console.log('[AnnouncementRegistrationDialog.js] unexpected error @ add photo to album:', error?.response?.data || error?.message);

                const errorMsg = error.response?.data?.error?.mensagem || error.response?.data?.mensagem || 'Falha ao armazenar uma novo foto no álbum do pet.';

                handleReset();
                enqueueSnackbar(errorMsg, { variant: 'error' });

            });

        } else {

            // Se não houve a adição de um arquivo de imagem, o usuário selecionou uma foto do álbum.

            return axios.post(`/anuncios/${animal.cod_animal}`, {
                uid_foto_animal: newPhotoUidForAnn
            })
            .then((response) => {
                console.log('[AnnouncementRegistrationDialog.js] announcement created:', response.data);

                enqueueSnackbar('Anúncio criado com sucesso!', { variant: 'success' });
                handleGoBackAndClear();
            })
            .catch((error) => {
                console.log('[AnnouncementRegistrationDialog.js] unexpected error @ create announcement:', error?.response?.data || error?.message);

                const errorMsg = error.response?.data?.error?.mensagem || error.response?.data?.mensagem || 'Falha ao cadastrar anúncio.';

                handleReset();
                enqueueSnackbar(errorMsg, { variant: 'error' });
            });

        }

    }

    

    // useEffect(() => {

    //     console.log('[PetRegistrationDialog.js/atPetRegistration] arrHas images?:', petPhotosArr);
        
    // }, [petPhotosArr]);
    

    return (
        <Dialog
            open={openDialog}
            // onClose={
            //     () => {
            //         handleGoBackAndClear();
            //     }
            // }
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
                                <Typography component='h1' variant='h6' align='center'>Anúncio</Typography>
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

                    <Grid item xs={12} sm={4} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '4px 0'}}>
                        <Button key="selectedPhoto" size='small' onClick={() => { document.querySelector('input#petPhoto').click() }}
                            className={styles.selectableImg}
                            style={{
                                boxShadow: photoSelectionError ? '0px 0px 5px 0px red' : '0px 0px 5px 0px grey',
                                border: '4px solid white',
                                backgroundImage: `url(${photoForAnnAsUrl})`,
                            }}
                        >
                            { photoForAnnAsUrl ? '' : <small>Clique para selecionar uma nova foto para o anúncio </small> }
                        </Button>
                        <input type='file'
                            id='petPhoto'
                            name='petPhoto'
                            accept='image/*'
                            alt='Foto do pet'
                            onChange={(ev) => { handlePhotoSelection(ev) }}
                            hidden
                        />
                    </Grid>

                    <Grid item xs={12} sm={8}>
                        <Grid container alignItems='center' style={{ height: '100%' }}>
                            <Grid item xs={12} style={{ padding: '4px 8px' }}>
                                <Typography component='p' variant={ isAtMinViewPort ? 'caption' : 'body2' }>
                                    <b>Dica:</b> Você pode selecionar uma foto da galeria abaixo ou clicar na foto destacada para iniciar o anúncio com uma nova foto enviada diretamente do armazenamento do seu dispositivo.
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography component='h2' variant='h6' align='center'>
                            Galeria { animal.genero === 'M' ? 'do' : 'da'} {animal.nome}
                        </Typography>
                        <Divider />
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container wrap='nowrap'
                            style={{ overflow: 'auto', padding: '8px 0', minHeight: '150px', margin: '8px 0' }}
                        >

                            {
                                petPhotosArr.length > 0 ? 

                                    petPhotosArr.map((photo, index) => {
                                      
                                        if (petPhotosArr.length === index + 1){
                                            // É o Last item.
                                            return (
                                                <Grid item key={'photo-' + (index + 1)} ref={lastElement}>
                                                    <Grow in timeout={1000}>
                                                        <Button
                                                            size='small'
                                                            onClick={ () => { handleSelectionFromAlbum(photo.uid_foto, photo.download_foto) } }
                                                            className={styles.selectableImg}
                                                            style={{
                                                                boxShadow: '0px 0px 5px 0px grey',
                                                                margin: '0 4px',
                                                                backgroundImage: `url(${photo.download_foto})`,
                                                            }}
                                                        >
                                                        </Button>
                                                    </Grow>
                                                </Grid>
                                            );

                                        }

                                        return (
                                            <Grid item key={'photo-' + (index + 1)}>
                                                <Grow in timeout={1000}>
                                                    <Button
                                                        size='small'
                                                        onClick={ () => { handleSelectionFromAlbum(photo.uid_foto, photo.download_foto) } }
                                                        className={styles.selectableImg}
                                                        style={{
                                                            boxShadow: '0px 0px 5px 0px grey',
                                                            margin: '0 4px',
                                                            backgroundImage: `url(${photo.download_foto})`,
                                                        }}
                                                    >
                                                    </Button>
                                                </Grow>
                                            </Grid>
                                        );

                                    })

                                : null
                            }
                        </Grid>
                    </Grid>

                </Grid>

            </DialogContent>

            <DialogActions >
                
                <Grid container justify='center'>
                    <Grid item xs={ isAtMinViewPort ? 12 : false } style={{ textAlign:  isAtMinViewPort ? 'center' : 'start' }}>
                        <Button 
                            onClick={handleCreateAnnouncement}
                            // disabled={activeStep === 0}
                            variant='contained'
                            color='primary'
                            size='small'
                            className={styles.formButton}
                            style={ isAtMinViewPort ? mobileStyleForButtons : {} }
                        >
                            Anunciar
                        </Button>
                    </Grid>

                    <Grid item xs={ isAtMinViewPort ? 12 : false } style={{ textAlign:  isAtMinViewPort ? 'center' : 'start' }}>
                        <Button 
                            onClick={handleReset}
                            // disabled={activeStep === 0}
                            variant='contained'
                            color='primary'
                            size='small'
                            className={styles.formButton}
                            style={ isAtMinViewPort ? mobileStyleForButtons : {} }
                        >
                            Reiniciar
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
                            Cancelar
                        </Button>
                    </Grid>

                </Grid>

            </DialogActions>


        </Dialog>
    );
    
}

AnnouncementRegistrationDialog.propTypes = {
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
)(AnnouncementRegistrationDialog);