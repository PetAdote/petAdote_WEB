// Importações.
import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'

// Utilidades.
import axios from '../helpers/axiosInstance';
import { makeStyles } from '@material-ui/core/styles';

// Actions.
import { openSnackbar } 
    from '../redux/actions'

// Components.
import { useTheme, useMediaQuery, 
        Grid, Button, 
        CircularProgress, Grow }
    from '@material-ui/core';

import {  }
    from '@material-ui/icons';

// Inicializações.
const useStyles = makeStyles((theme) => {
    return {
        petListBox: {
            padding: '8px'
        }
    }
});

// Functional Component.
const UserPetListBox = (props) => {

    const { fetchPetList, filters, petList } = props;

    const fetchLimit = 1;
    const [pageToFetch, setPageToFetch] = useState(1);

    const styles = useStyles();
    const theme = useTheme();
    const isDownXs = useMediaQuery(theme.breakpoints.down('xs'));   // Display Mobile?

    useEffect(() => {
        
        if (!filters && !petList){
            // Para preencher esse componente com os dados necessários.
            // A função é executada apenas uma vez no estado inicial, filtros não configurados e lista de pets vazia.
            fetchPetList();
        }

        console.log(petList)
        
    }, [filters, petList, fetchPetList]);

    return (
        <>
            <Grid item xs={12}>     {/* Início - Pet List Box */}
                {
                    petList?.length > 0 ?
                    <Grid container className={styles.petListBox}>
                        <Button onClick={() => { fetchPetList(filters, pageToFetch, fetchLimit) }}>Click Me</Button>
                    </Grid>
                    : null
                }
            </Grid>     {/* Fim - Pet List Box */}
        </>
    );
}

// Documentação das Props.
UserPetListBox.propTypes = {
    petListState: PropTypes.object,
    fetchPetList: PropTypes.func
}

// Redux Store Mapping.
const mapStateToProps = (state) => {
    return {
        // userData: state.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        openSnackbar: (message, severity) => { return dispatch( openSnackbar(message, severity) ) }
    }
}

// Exportações.
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserPetListBox);