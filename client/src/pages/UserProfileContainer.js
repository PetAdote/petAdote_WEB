// Importações.
import React, { useState, useEffect } from 'react';
import { useHistory, useParams, Link } from 'react-router-dom';
import { connect } from 'react-redux';      // Responsável por fazer a subscription do nosso Componente React ao Redux Store.

// Utilidades.
import { makeStyles } from '@material-ui/core/styles';
import axios from '../helpers/axiosInstance';

// Actions.
import { fetchPets, clearPets }
    from '../redux/actions';

// Components.
import { useTheme, useMediaQuery,
        Container, Grid, Typography,
        IconButton, AppBar, Tabs, Tab,
        CircularProgress, Menu, MenuItem }
    from '@material-ui/core';

import { MoreVert, Add, Email }
    from '@material-ui/icons';

import UserAvatar from '../components/UserAvatar';
import TabPanel from '../components/TabPanel';
import UserPetListContainer from '../components/UserPetListContainer';

import PetRegistrationDialog from '../components/PetRegistrationDialog';

// Inicializações.
const useStyles = makeStyles((theme) => {
    return {
        profileContainer: {
            flex: 1,
            padding: '0',
            // marginTop: `${theme.mixins.toolbar.minHeight + 8}px`,
            [theme.breakpoints.down('xs')]: {
                marginTop: `${theme.mixins.toolbar.minHeight}px`,
            },
            [theme.breakpoints.between('455', '600')]: {
                marginTop: `${theme.mixins.toolbar.minHeight - 8}px`,
            },
            // [theme.breakpoints.only('sm')]: {
            //     marginTop: `${theme.mixins.toolbar.minHeight + 8}px`,
            // },
            backgroundColor: 'ghostwhite'
        },
        userBanner: {
            minHeight: '200px',
            maxHeight: '200px',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        },
        userContextBar: {
            minHeight: '40px',
            padding: '0 8px'
        },
        contentMenuBarColor: {
            backgroundColor: 'ghostwhite',
        },
        contentMenuBarRoot: {
            boxShadow: '0 4px 4px 0px rgba(0,0,0,0.1)'
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
const UserProfileContainer = (props) => {

    const { id: profileOwnerId } = useParams();
    
    const { user } = props.userData;
    const { pets } = props.petsData;
    const { clearPets, fetchPets } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [profileOwnerData, setProfileOwnerData] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    const [tabValue, setTabValue] = useState(0);

    const [anchorAddContentMenu, setAnchorAddContentMenu] = useState(null);
    const [addContentMenuDecision, setAddContentMenuDecision] = useState(null);

    const [anchorUserInteractionMenu, setAnchorUserInteractionMenu] = useState(null);
    const [userInteractionMenuDecision, setUserInteractionMenuDecision] = useState(null);

    const [openPetRegistrationDialog, setOpenPetRegistrationDialog] = useState(false);
    const [petRegistrationDialogDecision, setPetRegistrationDialogDecision] = useState(null);

    const history = useHistory();

    const styles = useStyles();
    const theme = useTheme();
    const isDownXs = useMediaQuery(theme.breakpoints.down('xs'));

    const whileLoadingStyles = {
        display: 'flex',
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    }

    useEffect(() => {

        if (!user){
            history.push('/login');
        }

    }, [user, history]);

    useEffect(() => {

        axios.get(`/usuarios/${profileOwnerId}`)
        .then((response) => {

            const profileData = response.data.usuario;

            if (profileData) {
                return setProfileOwnerData(profileData);
            }

            console.log('[UserProfileContainer.js] unexpected response:', response);

        })
        .catch((error) => {

            const errorData = error.data;

            if (!errorData) {
                return console.log('[UserProfileContainer.js] unexpected error:', error.message || error);
            }

            const knownErrors = [
                'INVALID_REQUESTED_ID',
                'ACCESS_TO_RESOURCE_NOT_ALLOWED',
                'RESOURCE_NOT_FOUND'
            ]

            if (knownErrors.includes(errorData.code)){
                return setErrorMsg(errorData.mensagem);
            }

        });

        if (petRegistrationDialogDecision === 'NEW_PET_ADDED'){
            clearPets();    // Se um novo pet foi adicionado, renove a lista de pets do usuário.
            fetchPets({
                ownerId: profileOwnerId,
                page: 1,
                limit: 10
            });
            setPetRegistrationDialogDecision(null);
        }

        return () => {
            clearPets();
        }

    }, [profileOwnerId, clearPets, petRegistrationDialogDecision, fetchPets]);

    const handleContentTabChange = (ev, newValue) => {
        setTabValue(newValue)
    }

    const tabProps = (index) => {
        return {
            id: `content-tab-${index}`,
            'aria-controls': `content-tabpanel-${index}`
        }
    }


    const handleOpenAddContentMenu = (event) => {
        setAnchorAddContentMenu(event.currentTarget);
    }

    const handleCloseAddContentMenu = (newDecision) => {
        /** [ AddContentMenu - DecisionList ]
        *    ADD_NEW_PET
        *    ADD_NEW_ANNOUNCEMENT
        *    ADD_NEW_POST
        *    ADD_NEW_MOMENT
        */

        setAnchorAddContentMenu(null);

        if (newDecision === 'ADD_NEW_PET') {
            handleOpenPetRegistrationDialog();
        }

        if (newDecision) {
            setAddContentMenuDecision(newDecision);
            // console.log(newDecision);
            // console.log('[UserProfileContainer.js] Close add content menu decision:', newDecision);
        }
    }

    const handleOpenUserInteractionMenu = (event) => {
        setAnchorUserInteractionMenu(event.currentTarget);
    }

    const handleCloseUserInteractionMenu = (newDecision) => {
        /** [ UserInteractionMenu - DecisionList ]
        *    FOLLOW
        *    UNFOLLOW
        *    REPORT
        *    BLOCK
        */

        setAnchorUserInteractionMenu(null);

        if (newDecision) {
            setUserInteractionMenuDecision(newDecision);
            // console.log(newDecision);
            console.log('[UserProfileContainer.js] Close user interaction menu decision:', newDecision);
        }
    }

    const handleOpenPetRegistrationDialog = () => {
        setOpenPetRegistrationDialog(true);
    }

    const handleClosePetRegistrationDialog = (newDecision) => {
        setOpenPetRegistrationDialog(false);

        // if (newDecision === 'NEW_PET_ADDED'){

        //     if (!pets) {
        //         fetchPets({
        //             ownerId: profileOwnerId,
        //             page: 1,
        //             limit: 10
        //         });
        //     }

        // }

        if (newDecision) {
            setPetRegistrationDialogDecision(newDecision);

            console.log('[UserProfileContainer.js] Close pet registration dialog decision:', newDecision);
        }
    }












    return (
        <Container component='main' maxWidth='xl' className={styles.profileContainer} 
            style={ !profileOwnerData ? whileLoadingStyles : {} }
        >
        {
            profileOwnerData ?
            <>
                <Grid container>

                    <Grid item xs={12} className={styles.userBanner} 
                        style={{ backgroundImage: `url(${profileOwnerData.download_banner})` }}
                    >   {/* Início - Banner */}
                    </Grid> {/* Fim - Banner */}

                    <Grid item xs={12} className={styles.userContextBar}>   {/* Início - User Avatar + User Context Menu Icons */}

                        <Grid container wrap='nowrap' justify='space-between'>

                            <Grid item xs={6}>  {/* Início - Avatar */}

                                <Grid container wrap='nowrap' style={{ padding: '8px 0', height: '100%' }}>
                                    <Grid item style={{ position: 'relative' }}>
                                        <div style={{ position: 'absolute', bottom: '0px', padding: '0 8px' }}>
                                            <UserAvatar 
                                                user={profileOwnerData}
                                                width={isDownXs ? '100px' : '150px'}
                                                height={isDownXs ? '100px' : '150px'}
                                                customStyle={{ 
                                                    border: '4px solid ghostwhite',
                                                    backgroundColor: 'ghostwhite',
                                                    boxShadow: 'none',
                                                }}
                                            />
                                        </div>
                                    </Grid>
                                </Grid>

                            </Grid> {/* Fim - Avatar */}

                            <Grid item xs={6} style={{ overflow: 'auto' }}> {/* Início - Ícones */}

                                <Grid container wrap='nowrap' justify='flex-end' style={{ padding: '8px 0' }}>
                                            
                                    <Grid item>
                                        <IconButton>
                                            <Email />
                                        </IconButton>
                                    </Grid>

                                    {
                                        String(user.cod_usuario) === profileOwnerId ?
                                            <Grid item>
                                                <IconButton
                                                    aria-controls="add-content-menu"
                                                    aria-haspopup="true"
                                                    onClick={handleOpenAddContentMenu}
                                                >
                                                    <Add />
                                                </IconButton>
                                                <Menu
                                                    id="add-content-menu"
                                                    anchorEl={anchorAddContentMenu}
                                                    open={Boolean(anchorAddContentMenu)}
                                                    onClose={ () => { handleCloseAddContentMenu() } }
                                                    keepMounted
                                                >
                                                    <MenuItem 
                                                        onClick={() => { handleCloseAddContentMenu('ADD_NEW_PET') }}
                                                    >
                                                        Novo animal
                                                    </MenuItem>
                                                    <MenuItem disabled>Novo anúncio</MenuItem>
                                                    <MenuItem disabled>Nova postagem</MenuItem>
                                                    <MenuItem disabled>Novo momento</MenuItem>
                                                </Menu>
                                            </Grid>
                                        : null
                                    }

                                    <Grid item>
                                        <IconButton
                                            aria-controls="user-interaction-menu"
                                            aria-haspopup="true"
                                            onClick={handleOpenUserInteractionMenu}
                                        >
                                            <MoreVert />
                                        </IconButton>
                                        <Menu
                                            id="user-interaction-menu"
                                            anchorEl={anchorUserInteractionMenu}
                                            open={Boolean(anchorUserInteractionMenu)}
                                            onClose={ () => { handleCloseUserInteractionMenu() } }
                                            keepMounted
                                        >
                                            <MenuItem disabled
                                                onClick={ () => { handleCloseUserInteractionMenu('FOLLOW') } }
                                            >
                                                Seguir
                                            </MenuItem>
                                            <MenuItem disabled>Deixar de seguir</MenuItem>
                                            <MenuItem disabled>Denunciar</MenuItem>
                                            <MenuItem disabled>Bloquear</MenuItem>
                                        </Menu>
                                    </Grid>

                                </Grid>

                            </Grid> {/* Fim - Ícones */}

                        </Grid>

                    </Grid> {/* Fim - User Avatar + User Context Menu Icons */}

                    <Grid item xs={12} style={{ padding: '8px 16px 8px'}}> {/* Início - Descrição Usuário */}

                        <Grid container>

                            <Grid item xs={12} sm={12} md={6}>
                                <Grid container>
                                    <Grid item xs={12} style={{ marginBottom: '8px' }}>
                                        <Typography component='h1' variant='h4'><b>{profileOwnerData.primeiro_nome + ' ' + profileOwnerData.sobrenome}</b></Typography>
                                        <Typography component='h2' variant='h6'><b>ID: </b> {profileOwnerData.cod_usuario}</Typography>
                                    </Grid>
                                    <Grid item xs={12} style={{ marginBottom: '8px' }}>
                                        <Typography component='p'>{profileOwnerData.descricao}</Typography>
                                    </Grid>
                                    <Grid item xs={12} style={{ marginBottom: '8px' }}>
                                        <Typography component='p'><b>Seguindo: </b>{profileOwnerData.qtd_seguidos}</Typography>
                                        <Typography component='p'><b>Seguidores: </b>{profileOwnerData.qtd_seguidores}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={12} sm={12} md={6}>

                                <Grid container>
                                    <Grid item xs={12} style={{ marginBottom: '8px' }}>
                                        <Typography component='h1' variant='h4' align='center' style={{ marginBottom: '8px' }}>Curiosidades animais</Typography>
                                        <Typography component='p' align='center'>Um fato interessante sobre animais vai estar aqui.</Typography> {/* Fazer end-point na REST API */}
                                    </Grid>
                                </Grid>
                               
                            </Grid>

                        </Grid>
                    </Grid> {/* Fim - Descrição Usuário */}

                </Grid>
                <Grid container>
                    <Grid item xs={12} style={{ borderBottom: '1px solid lightgrey' }}> {/* Início - Menu de conteúdos */}
                        <AppBar position="static" color="default" classes={{ colorDefault: styles.contentMenuBarColor, root: styles.contentMenuBarRoot }}>
                            <Tabs
                                value={tabValue}
                                onChange={handleContentTabChange}
                                variant="scrollable"
                                scrollButtons="auto"
                                aria-label="Menu de conteudos do perfil do usuario"
                                indicatorColor='primary'
                            >
                                <Tab label="Pets" { ...tabProps(0) } />
                                <Tab label="Anúncios" { ...tabProps(1) } />
                                <Tab label="Postagens" { ...tabProps(2) } />
                                <Tab label="Momentos" { ...tabProps(3) } />
                            </Tabs>
                        </AppBar>
                    </Grid> {/* Fim - Menu de conteúdos */}
                    <Grid item xs={12}>

                        <TabPanel value={tabValue} index={0}>
                            <UserPetListContainer userId={profileOwnerId} />
                        </TabPanel>
                        <TabPanel value={tabValue} index={1}>
                            <Typography component='h1' variant='h4'>ANÚNCIOS DO USUÁRIO</Typography>    
                        </TabPanel>
                        <TabPanel value={tabValue} index={2}>
                            <Typography component='h1' variant='h4'>POSTAGENS DO USUÁRIO</Typography>    
                        </TabPanel>
                        <TabPanel value={tabValue} index={3}>
                            <Typography component='h1' variant='h4'>MOMENTOS DO USUÁRIO</Typography>    
                        </TabPanel>
                        
                    </Grid>
                </Grid>

                <PetRegistrationDialog
                    keepMounted
                    openDialog={openPetRegistrationDialog}
                    closeDialog={handleClosePetRegistrationDialog}
                />


            </>
            :
                <CircularProgress />   
        }
            
        </Container>
    );
}

// Redux Store Mapping.
const mapStateToProps = (state) => {
    return {
        userData: state.user,
        petsData: state.pets
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        clearPets: () => { dispatch( clearPets() ) },
        fetchPets: (configs) => { dispatch( fetchPets(configs) ) },
        // openSnackbar: (message, severity) => { return dispatch( openSnackbar(message, severity) ) }
    }
}

// Exportações.
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserProfileContainer);