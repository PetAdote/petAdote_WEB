// Importações.
import { useState, useEffect, useRef, useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'

// Utilidades.
import axios from '../helpers/axiosInstance';
import { makeStyles } from '@material-ui/core/styles';

// Actions.
import { openSnackbar, fetchPets } 
    from '../redux/actions'

// Components.
import { useTheme, useMediaQuery, 
        Grid, Button, 
        CircularProgress, Grow }
    from '@material-ui/core';

import {  }
    from '@material-ui/icons';

import UserPetListBoxItem from './UserPetListBoxItem';

// Inicializações.
const petListBoxItemWidth = 320;
const useStyles = makeStyles((theme) => {
    return {
        petListBox: {
            margin: '0 auto',
            padding: '8px',
            // Responsividade da lista de pets.
            [theme.breakpoints.down('xs')]: {
                justifyContent: 'center',
            },
            [theme.breakpoints.only('sm')]: {
                maxWidth: `${petListBoxItemWidth * 1}px`,
            },
            [theme.breakpoints.only('md')]: {
                maxWidth: `${petListBoxItemWidth * 2}px`,
            },
            [theme.breakpoints.only('lg')]: {
                maxWidth: `${petListBoxItemWidth * 3}px`,
            },
            [theme.breakpoints.up('xl')]: {
                maxWidth: `${petListBoxItemWidth * 5}px`,
            }
        }
    }
});

// Functional Component.
const UserPetListBox = (props) => {

    const { petListOwnerId, fetchPets, openSnackbar, pageToFetch, setPageToFetch } = props;
    const { loading, pets, hasMore } = props.petsData;
    const { especie, estadoAdocao, nomePet } = props.filters;

    const fetchLimit = 1;
    // const [pageToFetch, setPageToFetch] = useState(1);

    // Sistema de Paginação com Scrolling Infinito. (Detalhes da implementação em [AnnouncementsList.js])
    const observer = useRef();

    const lastElement = useCallback((node) => {

        if (loading) { return }

        if (observer.current) {
            observer.current.disconnect();
        }

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore){
                setPageToFetch(pageToFetch + 1);
                fetchPets({
                    ownerId: petListOwnerId,
                    filters: {
                        bySpecie: especie,
                        byStatus: estadoAdocao,
                        byName: nomePet
                    },
                    page: pageToFetch,
                    limit: fetchLimit
                });
            }

            if (entries[0].isIntersecting && !hasMore){
                openSnackbar('Fim da lista de pets.', 'info');
            }

        });

        if (node) {
            observer.current.observe(node);
        }

    }, [
        petListOwnerId, loading, hasMore, 
        fetchPets, openSnackbar, pageToFetch,
        especie, estadoAdocao, nomePet, setPageToFetch
    ]);
    // Fim das configurações do sistema de paginação.

    useEffect(() => {

        if (!pets){
            // setPageToFetch(1);
            fetchPets({
                ownerId: petListOwnerId,
                filters: {
                    bySpecie: especie,
                    byStatus: estadoAdocao,
                    byName: nomePet
                },
                page: pageToFetch,
                limit: fetchLimit
            });      
        }

    }, [
        petListOwnerId, pets, fetchPets,
        especie, estadoAdocao, nomePet,
        pageToFetch, fetchLimit
    ]);

    const styles = useStyles();
    // const theme = useTheme();
    // const isDownXs = useMediaQuery(theme.breakpoints.down('xs'));   // Display Mobile?

    return (
        <Grid item xs={12}>     {/* Início - Pet List Box */}
            <Grid container className={styles.petListBox}>

                {
                    pets ?
                        pets.map((pet, index) => {

                            if ( pets.length === index + 1){
                                return (
                                    <Grow key={pet.cod_animal} ref={lastElement} in timeout={1000}>
                                        <div>
                                            <UserPetListBoxItem pet={pet} />
                                        </div>
                                    </Grow>
                                );
                            }

                            return (
                                <Grow key={pet.cod_animal} in timeout={1000}>
                                    <div>
                                        <UserPetListBoxItem pet={pet} />
                                    </div>
                                </Grow>
                            );

                        })
                    : null
                }

            </Grid>
        </Grid> /* Fim - Pet List Box */
    );
}

// Documentação das Props.
UserPetListBox.propTypes = {
    petListOwnerId: PropTypes.any.isRequired,
    filters: PropTypes.object.isRequired,
    pageToFetch: PropTypes.number.isRequired,
    setPageToFetch: PropTypes.func.isRequired
}

// Redux Store Mapping.
const mapStateToProps = (state) => {
    return {
        petsData: state.pets
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchPets: (configs) => { return dispatch( fetchPets(configs) ) },
        openSnackbar: (message, severity) => { return dispatch( openSnackbar(message, severity) ) }
    }
}

// Exportações.
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserPetListBox);