// Importações.
import { connect } from 'react-redux';

// Utilidades.

// Actions.
import { closeSnackbar } from '../redux/actions';

// Componentes.
import { Snackbar }
    from '@material-ui/core';

import { Alert }
    from '@material-ui/lab';

// Inicializações.

// Functinal Component.
const SnackbarAlert = (props) => {

    const { isSnackbarOpen, message, severity } = props.snackbarData;
    const { closeSnackAlert } = props;

    const customStyle = {
        marginBottom: '50px'
    }

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        return closeSnackAlert();
    }

    return ( 
        <>
        {
            isSnackbarOpen && 
            <Snackbar open={isSnackbarOpen} autoHideDuration={5000} onClose={handleSnackbarClose} style={customStyle}>
                <Alert elevation={6} variant="filled" onClose={handleSnackbarClose} severity={severity}>
                    { message }
                </Alert>
            </Snackbar>
        }
        </>
    );
}
 
// Redux Store Mapping.
const mapStateToProps = (state) => {
    return {
        snackbarData: state.snackAlert
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        closeSnackAlert: () => { return dispatch( closeSnackbar() ) },
    }
}

// Exportações.
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SnackbarAlert);