// Importações.
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { connect } from 'react-redux';  // Responsável por fazer a subscription do nosso Componente React ao Redux Store.

// Utilidades.
import axios from '../helpers/axiosInstance';
import { makeStyles } from '@material-ui/core/styles';

// Actions.
import { fetchUser } 
    from '../redux/actions';

// Components.
import { Container, Grid, CircularProgress } 
    from '@material-ui/core';

import UserAccDetailsContainer from '../components/UserAccDetailsContainer';

// Inicializações.
const useStyles = makeStyles((theme) => {
    return {
        userAccDetailsContainer: {
            flex: 1,
            padding: '0',
            [theme.breakpoints.down('xs')]: {
                marginTop: `${theme.mixins.toolbar.minHeight}px`,
            },
            [theme.breakpoints.between('455', '600')]: {
                marginTop: `${theme.mixins.toolbar.minHeight - 8}px`,
            },
            backgroundColor: 'ghostwhite'
        },
    }

});

// Functional Component.
const UserAccDetailsPage = (props) => {

    const history = useHistory();
    const styles = useStyles();
    const { id: accOwnerId } = useParams();

    const { user } = props.userData;
    const { fetchUser } = props;

    const [userAddressData, setUserAddressData] = useState(null);
    const [hasUpdated, setHasUpdated] = useState(false);
    const [error, setError] = useState('');
    
    useEffect(() => {

        if (!user){
            history.push('/login');
        }

        if (user && user.cod_usuario !== accOwnerId){
            history.push(`/usuario/${user.cod_usuario}/detalhes`);
        }

        if ((user && user.cod_usuario === Number(accOwnerId)) || hasUpdated){
            axios.get(`usuarios/enderecos/`, {
                params: {
                    codUsuario: user.cod_usuario
                }
            })
            .then((response) => {
                if (response.data){

                    const endereco = response.data.endereco;

                    if (endereco) {
                        setUserAddressData(endereco);
                    }

                }
            })
            .catch((error) => {

                console.log('[UserAccDetailsPage.js] unexpected error:', error.response?.data || error.message || error || 'UNKNOWN_ERROR');
                const errorMsg = error.response?.data?.mensagem;
                if (errorMsg){
                    setError(errorMsg);
                }

            })
            .finally(() => {
                if (hasUpdated){
                    fetchUser();
                    setHasUpdated(false);
                }
            });
        }

    }, [user, history, accOwnerId, fetchUser, hasUpdated]);

    return (
        <>
        { 
            user ? 

            <Container component="main" maxWidth='xl' className={styles.userAccDetailsContainer}>

                {
                    
                    error ? 
                        <Grid container alignItems='center' style={{ height: '100%', width: '100%'}}>
                            <Grid item xs={12} style={{ textAlign: 'center'}} >
                                <h1>{error}</h1>
                            </Grid>
                        </Grid>
                    : 
                    userAddressData ?
                        <UserAccDetailsContainer userAddress={userAddressData} setHasUpdated={setHasUpdated} />
                    : 
                    <Grid container alignItems='center' style={{ height: '100%', width: '100%'}}>
                        <Grid item xs={12} style={{ textAlign: 'center'}} >
                            <CircularProgress />
                        </Grid>
                    </Grid>

                }

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
        // clearUser: () => { return dispatch ( clearUser() ) },
        // fetchAnnouncements: (page, limit) => { return dispatch( fetchAnnouncements(page, limit) ) },
        fetchUser: () => { return dispatch ( fetchUser() ) },
    }
}
 
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserAccDetailsPage);
