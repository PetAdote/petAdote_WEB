// Importações.
import PropTypes from 'prop-types'
import { useState } from 'react';
import { connect } from 'react-redux';

// Utilidades.
import axios from '../helpers/axiosInstance';
// import { makeStyles } from '@material-ui/core/styles';

// Actions.

// Components.
import { Grid }
    from '@material-ui/core';

// import { Search }
//     from '@material-ui/icons';

import UserPetListSearchBar from '../components/UserPetListSearchBar';
import UserPetListBox from '../components/UserPetListBox';

// Inicializações.

// Functional Component.
const UserPetListContainer = (props) => {

    const { userId: petListOwnerId } = props;

    const petListInitialState = {
        petListOwnerId: petListOwnerId,
        isLoading: false,
        petList: null,
        hasMore: false,
        filters: null,
        defaultPage: 1,
        defaultLimit: 1,
        error: ''
    };

    const [petListState, setPetListState] = useState(petListInitialState);

    // const defaultPage = 1;
    // const defaultLimit = 1;
    
    const fetchPetList = (filters, page, limit) => {
        setPetListState({ ...petListState, isLoading: true });

        axios.get(`/usuarios/animais/?getAllFromUser=${petListOwnerId}${filters || ''}&page=${page || petListState.defaultPage}&limit=${limit || petListState.defaultLimit}`)
        .then((response) => {

            setPetListState({ ...petListState, isLoading: false });

            if (response.data.animais){
                console.log('A lista de animais do usuário foi recebida.');
                return setPetListState({ ...petListState, petList: response.data.animais });
            }
            
            console.log('Dados recebidos:', response);
        })
        .catch((error) => {
            setPetListState({ ...petListState, isLoading: false });
            console.log('Erro recebido:', error?.response?.data || error?.message || 'UNKNOWN_ERROR');
        });
    }

    return (
        <Grid container>
            <UserPetListSearchBar
                petListState={petListState}
                setPetListState={setPetListState}
                fetchPetList={fetchPetList}
            />

            <UserPetListBox
                // petListState={petListState}
                filters={petListState.filters}
                petList={petListState.petList}
                fetchPetList={fetchPetList}
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