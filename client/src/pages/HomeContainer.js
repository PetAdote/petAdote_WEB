// Importações.
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';  // Responsável por fazer a subscription do nosso Componente React ao Redux Store.

// Utilidades.
import { useSnackbar } from 'notistack';
import getGreetings from '../helpers/getGreetings';
import { makeStyles } from '@material-ui/core/styles';

// Actions.
import { clearAnnouncements }
    from '../redux/actions';

// Components.
import { Container } 
    from '@material-ui/core';

import AnnouncementsContainer from '../components/AnnouncementsContainer';
import AnnouncementsList from '../components/AnnouncementsList';

import UserAccActivationDialog from '../components/UserAccActivationDialog';

// Inicializações.
const useStyles = makeStyles((theme) => {
    return {
        activationSnack: {
            '&:hover': {
                color: 'black',
                fontWeight: 'bold',
                cursor: 'pointer'
            }
        }
    }
});

// Functional Component.
const Home = (props) => {

    const history = useHistory();
    const styles = useStyles();
    const { enqueueSnackbar } = useSnackbar();

    const { user } = props.userData;
    const { clearAnnouncements } = props;

    const [openAccActivationDialog, setOpenAccActivationDialog] = useState(false);
    const [accActivationDialogDecision, setAccActivationDialogDecision] = useState(null);

    useEffect(() => {

        if (!user){
            history.push('/login');
        }

        if (user && user.esta_ativo === 0){
            const clickMeMsg = (
                <span onClick={handleOpenAccActivationDialog} className={styles.activationSnack}>
                    {`${getGreetings()}, sua conta ainda está inativa, clique aqui para ativá-la.`}
                </span>
            )
            enqueueSnackbar(clickMeMsg, { 
                variant: 'warning',
                autoHideDuration: 5 * 1000,
            });
        }

        // CleanUp Function.
        return () => {
            clearAnnouncements();
        }

    }, [user, history, enqueueSnackbar, styles.activationSnack, clearAnnouncements]);

    const handleOpenAccActivationDialog = () => {
        setOpenAccActivationDialog(true);
    }

    const handleCloseAccActivationDialog = (newDecision) => {
        setOpenAccActivationDialog(false);

        if (newDecision) {
            setAccActivationDialogDecision(newDecision);
            console.log('[UserAccDetailsContainer.js] Close account activation dialog decision:', accActivationDialogDecision);
        }
    }


    return (
        <>
        { 
            user ? 

            <Container component="main" maxWidth='xl' style={{ flex: 1 }}>

                <AnnouncementsContainer>

                    <AnnouncementsList />
                   
                </AnnouncementsContainer>

                <UserAccActivationDialog
                    keepMounted
                    openDialog={openAccActivationDialog}
                    closeDialog={handleCloseAccActivationDialog}
                />

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
        clearAnnouncements: () => { return dispatch( clearAnnouncements() ) }
    }
}
 
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);
