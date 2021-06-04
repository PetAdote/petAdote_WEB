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
import { Container, Grid, Typography, IconButton } 
    from '@material-ui/core';

import { Pets, ThumbUp, Inbox, Visibility }
    from '@material-ui/icons';

import MdiSvgIcon from '@mdi/react';

import { mdiNeedle }
    from '@mdi/js';

import UserAvatar from '../components/UserAvatar';

// Inicializações.
const useStyles = makeStyles((theme) => {
    return {
        mainContainer: {
            // flex: 1,
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
                borderRadius: '7px',
                overflow: 'hidden',
                boxSizing: 'content-box',
                backgroundColor: 'whitesmoke',
                maxWidth: '300px',
                height: '300px',
                margin:'4px',
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.10), rgba(0, 0, 0, 0.10)), url(${user?.download_avatar})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                // backgroundAttachment: 'fixed',
                backgroundPosition: 'center',
            },
            ongBadge: {
                padding: '2px',
                width: '24px',
                height: '24px',
                borderRadius: '50%', 
                boxShadow: '0px 0px 5px rgba(0,0,0,0.5)',
                color: 'green'
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

            <Container style={{ flex: 1, padding: 0 }}>

                <Grid container component="div" className={styles.mainContainer} justify='center' >

                    <Grid item xs={12} className={announcementStyles.announcementBox}>

                        <Grid style={{ display: 'flex', flexDirection: 'column', height:'100%', justifyContent:'space-between'}}>

                            <Grid item>
                                <Grid container style={{ borderBottom: '2px solid black', backgroundColor: 'rgba(225, 225, 225, 0.80)' }}>

                                    {/* <Grid item xs={2} title='Pet de ONG verificada' style={{ display: 'flex', margin: 'auto 0', padding:'0 8px' }}>
                                        <Pets className={announcementStyles.ongBadge} />
                                    </Grid> */}
                                    <Grid item xs={10} style={{ padding:'0 8px' }}>
                                        <Typography component='h1' variant='h6' title=''>
                                            NOME DO PET
                                        </Typography>
                                    </Grid>

                                </Grid>
                            </Grid>

                            <Grid item>
                                <Grid container wrap='nowrap' style={{ borderTop: '2px solid black', overflow: 'auto' }}>

                                    <Grid item xs={3} style={{ display: 'flex', alignItems: 'center', overflow: 'hidden', padding: '5px', borderRight: '2px solid black'}}>
                                        <ThumbUp />
                                        <Typography component='span' noWrap style={{fontFamily: 'monospace', paddingLeft: '4px'}}>99999</Typography>
                                    </Grid>
                                    <Grid item xs={3} style={{ display: 'flex', alignItems: 'center', overflow: 'hidden', padding: '5px', borderRight: '2px solid black'}}>
                                        <Visibility />
                                        <Typography component='span' noWrap style={{fontFamily: 'monospace', paddingLeft: '4px'}}>99999</Typography>
                                    </Grid>
                                    <Grid item xs={3} style={{ display: 'flex', alignItems: 'center',overflow: 'hidden', padding: '5px', borderRight: '2px solid black'}}>
                                        <Inbox />
                                        <Typography component='span' noWrap style={{fontFamily: 'monospace', paddingLeft: '4px'}}>99999</Typography>
                                    </Grid>

                                    <Grid item xs={3} style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center', overflow: 'auto', padding: '5px', borderLeft: '0px solid black'}}>
                                        <ThumbUp />
                                        <ThumbUp />
                                    </Grid>

                                </Grid>
                            </Grid>

                        </Grid>

                        {/* <Grid container style={{ borderBottom: '2px solid black', backgroundColor: 'rgba(225, 225, 225, 0.80)' }}>

                            <Grid item xs={2} title='Pet de ONG verificada' style={{ display: 'flex', margin: 'auto 0', padding:'0 8px' }}>
                                <Pets className={announcementStyles.ongBadge} />
                            </Grid>
                            <Grid item xs={10} style={{ padding:'0 8px' }}>
                                <Typography component='h1' variant='h6' title=''>
                                    NOME DO PET
                                </Typography>
                            </Grid>

                        </Grid> */}
                    </Grid>

                    <Grid item xs={12} className={announcementStyles.announcementBox}>

                    </Grid>

                    <Grid item xs={12} className={announcementStyles.announcementBox}>

                    </Grid>

                    <Grid item xs={12} className={announcementStyles.announcementBox}>

                    </Grid>

                    <Grid item xs={12} className={announcementStyles.announcementBox}>

                    </Grid>
                   
                </Grid>

            </Container>
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
