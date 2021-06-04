// Importações.
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';  // Responsável por fazer a subscription do nosso Componente React ao Redux Store.

// Utilidades.
import axios from '../helpers/axiosInstance';
import { makeStyles }
    from '@material-ui/core/styles';

// Actions.
import { clearUser, fetchAnnouncements } 
    from '../redux/actions';

// Components.
import { Container, Grid, Typography, CardActionArea, IconButton } 
    from '@material-ui/core';

import { Pets, ThumbUp, Inbox, Visibility }
    from '@material-ui/icons';

import MdiSvgIcon from '@mdi/react';

import { mdiNeedle, mdiGenderMale, mdiGenderFemale, mdiCardAccountDetailsOutline }
    from '@mdi/js';

import UserAvatar from '../components/UserAvatar';
import AnnouncementsContainer from '../components/AnnouncementsContainer';
import AnnouncementsList from '../components/AnnouncementsList';

// Inicializações.

// Functional Component.
const Home = (props) => {

    const history = useHistory();

    const { user } = props.userData;
    const { fetchAnnouncements } = props;

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

            <Container component="main" maxWidth='xl' style={{ flex: 1 }}>

                <AnnouncementsContainer>

                    <AnnouncementsList />
                   
                </AnnouncementsContainer>

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
        fetchAnnouncements: (page, limit) => { return dispatch( fetchAnnouncements(page, limit) ) },
        // fetchUser: () => { return dispatch ( fetchUser() ) },
    }
}
 
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);
