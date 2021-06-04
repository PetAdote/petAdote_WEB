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
                <Grid container component="main" className={styles.mainContainer}>

                    {/* <Grid item xs={12} style={{padding: '8px'}}> */}

                        <Grid container component='div' justify='center'>   {/* Início - Announcements Component */}

                            <Grid className={announcementStyles.announcementBox} >

                                <Grid item xs={12} > {/* Início - Usuário, Nome do Pet e do Usuário */}
                                    <Grid container component='div' style={{ borderBottom: '2px solid black', textAlign: 'center', backgroundColor: 'rgba(225, 225, 225, 0.9)' }}>

                                        <Grid item xs={2} style={{ borderRight: '2px solid black'}}>
                                            <IconButton size='small' onClick={ () => { console.log('Ir para a página dos dados do usuário.')}}>
                                                <UserAvatar user={user} width='50px' height='50px' badgesWidth='15px' badgesHeight='15px' showOngBadge />
                                            </IconButton>
                                        </Grid>

                                        <Grid item xs={10} style={{ padding: '0 8px'}}>
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
                                </Grid> {/* Fim - Usuário, Nome do Pet e do Usuário */}

                                <Grid item xs={12} style={{ display: 'flex', flex: '1' }}>
a
                                </Grid>

                                <Grid item xs={12}> {/* Ícones Informativos */}
                                    <Grid container component='div' wrap='nowrap' style={{ borderBottom: '2px solid black', backgroundColor: 'rgba(225, 225, 225, 0.9)' }}>

                                        <Grid item style={{ display: 'flex', borderRight: '2px solid black' }}>
                                            
                                            <Grid container wrap='nowrap' alignItems='center' style={{ width: '75px' }}>
                                                <Grid item style={{ padding: '0 4px' }}>
                                                    <ThumbUp style={{ color: 'dimgrey'}} />
                                                </Grid>
                                                <Grid item style={{ overflow: 'hidden' }}>
                                                    <Typography content='p' noWrap style={{ fontFamily: 'monospace' }} >999999999</Typography>
                                                </Grid>
                                            </Grid>
                                            
                                        </Grid>

                                        <Grid item style={{ display: 'flex', borderRight: '2px solid black' }}>
                                            
                                            <Grid container wrap='nowrap' alignItems='center' style={{ width: '75px' }}>
                                                <Grid item style={{ padding: '0 4px' }}>
                                                    <Visibility style={{ color: 'dimgrey'}} />
                                                </Grid>
                                                <Grid item style={{ overflow: 'hidden' }}>
                                                    <Typography content='p' noWrap style={{ fontFamily: 'monospace' }} >999999999</Typography>
                                                </Grid>
                                            </Grid>
                                            
                                        </Grid>

                                        <Grid item style={{ display: 'flex', borderRight: '2px solid black' }}>
                                            
                                            <Grid container wrap='nowrap' alignItems='center' style={{ width: '75px' }}>
                                                <Grid item style={{ padding: '0 4px' }}>
                                                    <Inbox style={{ color: 'dimgrey'}} />
                                                </Grid>
                                                <Grid item style={{ overflow: 'hidden' }}>
                                                    <Typography content='p' noWrap style={{ fontFamily: 'monospace' }} >999999999</Typography>
                                                </Grid>
                                            </Grid>
                                            
                                        </Grid>

                                        <Grid item style={{ display: 'flex', flex: '1', overflow: 'auto' }}>
                                            
                                            <Grid container wrap='nowrap' alignItems='center'>
                                                <Grid item style={{ padding: '0 4px' }}>
                                                    <ThumbUp style={{ color: 'dimgrey'}} />
                                                </Grid>
                                                <Grid item style={{ padding: '0 4px' }}>
                                                    <ThumbUp style={{ color: 'dimgrey'}} />
                                                </Grid>
                                                <Grid item style={{ padding: '0 4px' }}>
                                                    <ThumbUp style={{ color: 'dimgrey'}} />
                                                </Grid>
                                                <Grid item style={{ padding: '0 4px' }}>
                                                    <ThumbUp style={{ color: 'dimgrey'}} />
                                                </Grid>
                                                <Grid item style={{ padding: '0 4px' }}>
                                                    <ThumbUp style={{ color: 'dimgrey'}} />
                                                </Grid>
                                                <Grid item style={{ padding: '0 4px' }}>
                                                    <ThumbUp style={{ color: 'dimgrey'}} />
                                                </Grid>
                                                <Grid item style={{ padding: '0 4px' }}>
                                                    <ThumbUp style={{ color: 'dimgrey'}} />
                                                </Grid>
                                                <Grid item style={{ padding: '0 4px' }}>
                                                    <ThumbUp style={{ color: 'dimgrey'}} />
                                                </Grid>
                                                <Grid item style={{ padding: '0 4px' }}>
                                                    <ThumbUp style={{ color: 'dimgrey'}} />
                                                </Grid>
                                                
                                            </Grid>
                                            
                                        </Grid>

                                    </Grid>
                                </Grid>

                                {/* <Grid item xs={12}> Início - Foto do Anúncio do Pet
                                    <Grid container component='div' style={{ borderBottom: '2px solid black' }} >
                                        <Grid item xs={12}>
                                            <CardMedia 
                                                className={styles.announcementImg}
                                                image={user?.download_avatar}
                                                title='Image test'
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid> Fim - Foto do Anúncio do Pet */}

                            </Grid>

                            <Grid container style={{ backgroundColor: 'lightblue', width: '400px', height: '400px', margin:'4px' }}>
                                <IconButton size='small' onClick={ () => { console.log('Ir para a página dos dados do usuário.')}}>
                                    <UserAvatar user={user} width='50px' height='50px' badgesWidth='15px' badgesHeight='15px' showOngBadge />
                                </IconButton>
                            </Grid>

                        </Grid>   {/* Fim - Announcements Component */}

                    {/* </Grid> */}
                    
                    {/* <Grid item xs={12} sm={6} md={4} style={{ overflow: 'auto', backgroundColor: 'white' }}>

                        <Grid container component='div' style={{backgroundColor: 'lightgreen', padding: '10px 0px', width:'400px', height:'400px'}}>

                            <Grid item xs={3} style={{ textAlign: 'center' }}>
                                <IconButton size='small' onClick={ () => { console.log('Ir para a página dos dados do usuário.')}}>
                                    <UserAvatar user={user} width='50px' height='50px' badgesWidth='15px' badgesHeight='15px' showOngBadge />
                                </IconButton>
                            </Grid>

                        </Grid>

                    </Grid>

                    <Grid item xs={12} sm={6} md={4} style={{ overflow: 'auto', backgroundColor: 'lightyellow' }}>
                        <Typography component="h1" variant='h2' noWrap style={{ backgroundColor: 'lightblue' }}>Homepage</Typography>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4} style={{ overflow: 'auto', backgroundColor: 'lightpink' }}>
                        <Typography component="h1" variant='h2' noWrap style={{ backgroundColor: 'lightblue' }}>Homepage</Typography>
                    </Grid> */}
                    

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
