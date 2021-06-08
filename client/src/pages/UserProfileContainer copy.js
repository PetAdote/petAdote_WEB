// Importações.
import React, { useState, useEffect } from 'react';
import { useHistory, useParams, Link } from 'react-router-dom';
import { connect } from 'react-redux';      // Responsável por fazer a subscription do nosso Componente React ao Redux Store.

// Utilidades.
import { makeStyles } from '@material-ui/core/styles';
import axios from '../helpers/axiosInstance';

// Actions.
import {  }
    from '../redux/actions';

// Components.
import { useTheme, useMediaQuery,
        Container, Grid, Typography,
        IconButton, Button,
        CircularProgress }
    from '@material-ui/core';

import { MoreVert, Add, Email }
    from '@material-ui/icons';

import UserAvatar from '../components/UserAvatar';

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

    const [isLoading, setIsLoading] = useState(true);
    const [profileOwnerData, setProfileOwnerData] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    const history = useHistory();

    const styles = useStyles();
    const theme = useTheme();
    const isDownXs = useMediaQuery(theme.breakpoints.down('xs'));

    const whileLoadingStyles = {
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

    }, [profileOwnerId]);

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

                                    <Grid item>
                                        <IconButton>
                                            <Add />
                                        </IconButton>
                                    </Grid>

                                    <Grid item>
                                        <IconButton>
                                            <MoreVert />
                                        </IconButton>
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
                                        <Typography component='h1' variant='h4' align='center'>Curiosidades animais</Typography>
                                        <Typography component='p' align='center'>Um fato interessante sobre animais vai estar aqui.</Typography> {/* Fazer end-point na REST API */}
                                    </Grid>
                                </Grid>
                               
                            </Grid>

                        </Grid>
                    </Grid> {/* Fim - Descrição Usuário */}

                    <Grid item xs={12} style={{ borderBottom: '1px solid lightgrey' }}>
                        <Grid container>
                            
                        </Grid>
                    </Grid>

                </Grid>
                <Grid container>
                    <Grid item xs={12}>
                        <Typography component='h1' variant='h4'>PET LIST COMPONENT</Typography>
                        <Typography component='h1' variant='h4'>PET LIST SEARCH BAR</Typography>
                        <Typography component='h1' variant='h4'>PET LIST BOX / PET LIST ITEMS </Typography>
                    </Grid>
                    <Grid item xs={12} style={{ display: 'flex', flex: 1 }}>
                    </Grid>
                </Grid>
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
        userData: state.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        // openSnackbar: (message, severity) => { return dispatch( openSnackbar(message, severity) ) }
    }
}

// Exportações.
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserProfileContainer);