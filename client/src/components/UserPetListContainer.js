// Importações.
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';

// Utilidades.
import axios from '../helpers/axiosInstance';
import usePetListSearch from '../hooks/usePetListSearch';
// import { makeStyles } from '@material-ui/core/styles';

// Actions.

// Components.
import { Grid, CircularProgress }
    from '@material-ui/core';

// import { Search }
//     from '@material-ui/icons';

import UserPetListSearchBar from '../components/UserPetListSearchBar';
import UserPetListBox from '../components/UserPetListBox';

// Inicializações.

// Functional Component.
const UserPetListContainer = (props) => {

    const { userId: petListOwnerId } = props;
    const { pets } = props.petsData;

    const filtersInitialState = {
        especie: undefined,
        estadoAdocao: undefined,
        nomePet: undefined
    }
    const [filters, setFilters] = useState(filtersInitialState);
    const [pageToFetch, setPageToFetch] = useState(1);

    useEffect(()=>{
        if (!pets) {
            setPageToFetch(1);
        }
    }, [pets])
    

    return (
        <Grid container>
            <UserPetListSearchBar
                filters={filters}
                setFilters={setFilters}
                setPageToFetch={setPageToFetch}
            />

            <UserPetListBox 
                petListOwnerId={petListOwnerId}
                filters={filters}
                pageToFetch={pageToFetch}
                setPageToFetch={setPageToFetch}
            />

        </Grid>
    );
}

// Documentação das Props.
UserPetListContainer.propTypes = {
    userId: PropTypes.any
}

// Redux Store Mapping.
const mapStateToProps = (state) => {
    return {
        petsData: state.pets
        // userData: state.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        // openSnackbar: (message, severity) => { return dispatch( openSnackbar(message, severity) ) }
    }
}

// Exportações.
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserPetListContainer);