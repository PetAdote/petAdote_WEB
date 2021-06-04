// Importações.
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';  // Responsável por fazer a subscription do nosso Componente React ao Redux Store.

// Utilidades.
import axios from '../helpers/axiosInstance';
import { makeStyles }
    from '@material-ui/core/styles';

// Actions.
import { clearUser } 
    from '../redux/actions';

// Components.
import { Grid, Typography, IconButton } 
    from '@material-ui/core';

import { ThumbUp, Inbox, Visibility }
    from '@material-ui/icons';

import MdiSvgIcon from '@mdi/react';

import { mdiNeedle }
    from '@mdi/js';

import UserAvatar from '../components/UserAvatar';

// Inicializações.
const useStyles = makeStyles((theme) => {
    return {
        mainContainer: {
            flex: 1,
            margin: '0',
            padding: '8px 0',
            marginTop: `${theme.mixins.toolbar.minHeight}px`,   // Deve levar em consideração o AppBar.
            // alignItems: 'start',
            // justifyContent: 'center'
            // [theme.breakpoints.down('xs')]: {
            //     marginTop: `${theme.mixins.toolbar.minHeight}px`,   // Deve levar em consideração o AppBar.
            // }
        },
        // announcementBox: {
        //     border: '2px solid black',
        //     boxSizing: 'content-box',
        //     backgroundColor: 'whitesmoke',
        //     width: '400px',
        //     height: '400px',
        //     margin:'4px',
        //     backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://source.unsplash.com/random)',
        //     backgroundRepeat: 'no-repeat',
        //     backgroundSize: 'cover',
        //     backgroundAttachment: 'fixed',
        //     backgroundPosition: 'center',
        // }
        // announcementImg: {
        //     height: 275,
        //     backgroundRepeat: 'no-repeat',
        //     backgroundSize: 'cover',
        //     // backgroundAttachment: 'fixed',
        //     // backgroundPosition: 'center',
        //     border: '1px solid black'
        // }
    }
});

// Functional Component.
const Home = (props) => {

    const styles = useStyles();
    const history = useHistory();

    const { user } = props.userData;

    const useAnnouncementStyles = makeStyles((theme) => {
        return { 
            announcementBox: {
                border: '2px solid black',
                boxSizing: 'content-box',
                backgroundColor: 'whitesmoke',
                width: '400px',
                height: '400px',
                margin:'4px',
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.10), rgba(0, 0, 0, 0.10)), url(${user?.download_avatar})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                // backgroundAttachment: 'fixed',
                backgroundPosition: 'center',
            }
        }
    });

    const announcementStyles = useAnnouncementStyles();

    useEffect(() => {

        if (!user){
            history.push('/login');
        }

    }, [user, history]);

    return (
        <>
        { 
            user ? 
                <Grid container component="main" className={styles.mainContainer} justify='center'>

                    <Grid container direction='column' wrap='nowrap' className={announcementStyles.announcementBox} justify='space-between' alignItems='stretch'>

                        <Grid item style={{ backgroundColor: 'lightblue' }}>    {/* Início - Usuário, Nome do Pet e do Usuário */}
                            <Grid container style={{ borderBottom: '2px solid black'}}>

                                <Grid item xs={2} style={{ borderRight: '2px solid black', textAlign: 'center' }}>
                                    <IconButton size='small' onClick={ () => { console.log('Ir para a página dos dados do usuário.')}}>
                                        <UserAvatar user={user} width='50px' height='50px' badgesWidth='15px' badgesHeight='15px' showOngBadge />
                                    </IconButton>
                                </Grid>

                                <Grid item xs={10} style={{ padding: '0 8px', textAlign: 'center' }}>
                                    <Grid container component='div'>
                                        <Grid item xs={12}>
                                            <Typography component='h1' variant='h6' noWrap title=''>
                                                NOME DO PET
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography component='p' noWrap title=''>
                                                <small><b>DONO:</b> PRIMEIRO NOME SOBRENOME</small>
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>

                            </Grid>
                        </Grid>     {/* Fim - Usuário, Nome do Pet e do Usuário */}
                        
                        <Grid item style={{ backgroundColor: 'lightgreen' }}>   {/* Início - Ícones informativos */}
                            <Grid container wrap='nowrap' style={{ borderTop: '2px solid black', overflow: 'auto' }}>

                                <Grid item xs={3} style={{ display: 'flex', alignItems: 'center', overflow: 'hidden', padding: '5px', border: '1px solid black'}}>
                                    <ThumbUp />
                                    <Typography component='span' noWrap style={{fontFamily: 'monospace', paddingLeft: '4px'}}>99999</Typography>
                                </Grid>
                                <Grid item xs={3} style={{ display: 'flex', alignItems: 'center', overflow: 'hidden', padding: '5px', border: '1px solid black'}}>
                                    <Visibility />
                                    <Typography component='span' noWrap style={{fontFamily: 'monospace', paddingLeft: '4px'}}>99999</Typography>
                                </Grid>
                                <Grid item xs={3} style={{ display: 'flex', alignItems: 'center',overflow: 'hidden', padding: '5px', border: '1px solid black'}}>
                                    <Inbox />
                                    <Typography component='span' noWrap style={{fontFamily: 'monospace', paddingLeft: '4px'}}>99999</Typography>
                                </Grid>

                                <Grid item xs={3} style={{ display: 'flex', alignItems: 'center', overflow: 'auto', padding: '5px', border: '1px solid black'}}>
                                    <ThumbUp />
                                    <ThumbUp />
                                    <ThumbUp />
                                    <ThumbUp />
                                    <ThumbUp />
                                    <ThumbUp />
                                    <ThumbUp />
                                </Grid>

                            </Grid>
                        </Grid>     {/* Fim - Ícones informativos */}

                    </Grid>
                   
                </Grid>
            : null
        }
        </>
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
        clearUser: () => { return dispatch ( clearUser() ) },
        // fetchUser: () => { return dispatch ( fetchUser() ) },
    }
}
 
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);
