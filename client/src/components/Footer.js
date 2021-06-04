// Importações.
import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

// Utilidades.
import { makeStyles } from '@material-ui/core/styles';

// Actions.
import { fetchUser, clearUser } from '../redux/actions';

// Components.
import { Grid, Typography } from '@material-ui/core';

// Inicializações.
const useStyles = makeStyles((theme) => {
    return {
        footer: {
            backgroundColor: '#2c2b2e'
        }
    }
});

// Functional Component.
const Footer = () => {
    
    const styles = useStyles();

    return ( 
        <>
        <Grid container component='footer' className={styles.footer}>
            <Grid item xs={12}>
                <Typography component="p" align='center' style={{ color: '#e8e8e8' }}>Copyright © Sistemas Pet Adote 2021.</Typography>
            </Grid>
        </Grid>
        </>
    );
}

// Redux Store Mapping.
const mapStateToProps = (state) => {
    return {
        // userData: state.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        // fetchUser: () => { return dispatch( fetchUser() ) },
        // clearUser: () => { return dispatch( clearUser() ) }
    }
}

// Exportações.
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Footer);