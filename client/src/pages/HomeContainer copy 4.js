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

            <Container component="main" maxWidth='xl'>

                <AnnouncementsContainer>

                    <Grid item xs={12} className={announcementStyles.announcementBox}>  {/* Início - Anúncio */}

                        <Grid style={{ display: 'flex', flexDirection: 'column', height:'100%', justifyContent:'space-between'}}>   {/* Início - Layout Anúncio */}

                            <Grid item> {/* Início - Área de Cabeçalho do anúncio */}

                                <CardActionArea>

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

                                </CardActionArea>

                            </Grid> {/* Fim - Área de Cabeçalho do anúncio */}

                            <Grid item style={{ flex: '1'}}>    {/* Início - Área de clique da imagem do anúncio */}
                                <CardActionArea style={{ height: '100%'}}>
                                </CardActionArea>
                            </Grid>    {/* Fim - Área de clique da imagem do anúncio */}

                            <Grid item> {/* Início - Área de Ícones informativos do anúncio */}
                                <Grid container wrap='nowrap' style={{ borderTop: '2px solid black', overflow: 'auto', backgroundColor: 'rgba(225, 225, 225, 0.8)' }}>

                                    <Grid item xs={3} style={{ display: 'flex', alignItems: 'center', overflow: 'hidden', padding: '5px', borderRight: '2px solid black'}}>
                                        <ThumbUp style={{ color: 'dimgrey'}}  />
                                        <Typography component='span' noWrap style={{fontFamily: 'monospace', paddingLeft: '4px'}}>99999</Typography>
                                    </Grid>

                                    <Grid item xs={3} style={{ display: 'flex', alignItems: 'center', overflow: 'hidden', padding: '5px', borderRight: '2px solid black'}}>
                                        <Visibility  style={{ color: 'dimgrey'}}  />
                                        <Typography component='span' noWrap style={{fontFamily: 'monospace', paddingLeft: '4px'}}>99999</Typography>
                                    </Grid>

                                    <Grid item xs={3} style={{ display: 'flex', alignItems: 'center',overflow: 'hidden', padding: '5px', borderRight: '2px solid black'}}>
                                        <Inbox style={{ color: 'dimgrey'}} />
                                        <Typography component='span' noWrap style={{fontFamily: 'monospace', paddingLeft: '4px'}}>99999</Typography>
                                    </Grid>

                                    <Grid item xs={3} style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center', overflow: 'auto', padding: '5px', borderLeft: '0px solid black'}}>
                                        <div style={{paddingLeft: '8px', margin: '0'}}>
                                            <MdiSvgIcon
                                                path={mdiCardAccountDetailsOutline}
                                                title='Possui RGA'
                                                size={1.2}
                                                color="dimgrey"
                                            />
                                        </div>
                                        <div style={{paddingLeft: '8px', margin: '0'}}>
                                            <MdiSvgIcon
                                                path={mdiNeedle}
                                                title='Cadastrado'
                                                size={1.2}
                                                color="dimgrey"
                                            />
                                        </div>
                                        <div style={{paddingLeft: '8px', margin: '0'}}>
                                            <MdiSvgIcon
                                                path={mdiGenderMale}
                                                title='Macho'
                                                size={1.2}
                                                color="dimgrey"
                                            />
                                        </div>
                                        <div style={{paddingLeft: '8px', margin: '0'}}>
                                            <MdiSvgIcon
                                                path={mdiGenderFemale}
                                                title='Fêmea'
                                                size={1.2}
                                                color="dimgrey"
                                            />
                                        </div>
                                        
                                    </Grid>

                                </Grid>
                            </Grid> {/* Fim - Área de Ícones informativos do anúncio */}

                        </Grid>   {/* Início - Layout Anúncio */}
                        
                    </Grid>  Fim - Anúncio
                   
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
        // fetchUser: () => { return dispatch ( fetchUser() ) },
    }
}
 
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);
