// Importações.
import { useState } from 'react';
import PropTypes from 'prop-types'

// Utilidades.
import { makeStyles } from '@material-ui/core/styles';

// Actions.

// Components.
import { useTheme, useMediaQuery, 
        Grid, Button, TextField, MenuItem }
    from '@material-ui/core';

import { Search }
    from '@material-ui/icons';

// Inicializações.
const useStyles = makeStyles((theme) => {
    return {
        searchBarContainer: {
            minHeight: '50px',
            padding: '12px',
            borderBottom: '1px solid lightgrey'
        },
        searchBarItems: {
            padding: '8px',
        },
        searchBarSelect: {
            width: '150px'
        }
    }
});

// Functional Component.
const UserPetListSearchBar = (props) => {

    const { petListState, setPetListState, fetchPetList } = props;

    const especies = [
        { value: "DEFAULT", label: "Espécie" },
        { value: "dogs", label: "Cães" },
        { value: "cats", label: "Gatos" },
        { value: "others", label: "Outros" },
    ];

    const estadosAdocao = [
        { value: "DEFAULT", label: "Estado adoção" },
        { value: "protected", label: "Sob proteção" },
        { value: "announced", label: "Em anúncio" },
        { value: "trial", label: "Em processo adotivo" },
        { value: "adopted", label: "Adotado" },
    ];

    const searchBarInitialState = {
        especie: 'DEFAULT',
        estadoAdocao: 'DEFAULT',
        nomePet: ''
    }

    const [searchBarState, setSearchBarState] = useState(searchBarInitialState);

    const styles = useStyles();
    const theme = useTheme();
    const isDownXs = useMediaQuery(theme.breakpoints.down('xs'));   // Display Mobile?

    const handleClickSearch = () => {
        const { especie, estadoAdocao, nomePet } = searchBarState;

        let customFilters = '';
        if (especie !== 'DEFAULT'){
            customFilters += `&bySpecie=${especie}`
        }
        if (estadoAdocao !== 'DEFAULT'){
            customFilters += `&byStatus=${estadoAdocao}`
        }
        if (nomePet){
            customFilters += `&byName=${nomePet}`
        }

        console.log('SearchBar State:', searchBarState);
        if (customFilters) { console.log('Changing Filters:', customFilters) }

        // Reinicia a PetList.
        // setPetListState({
        //     ...petListState,
        //     petList: null 
        // });

        // Realiza a primeira busca com os filtros.
        fetchPetList(customFilters);    
            // Deve passar os custom filters a partir dessa chamada.
            // A referência da função recebe o estado iniciado em [userPetListContainer]
            // E nesse momento não possuirá como filtros os filtros da state.
            // Mesmo se modificarmos a state primeiro e chamarmos a função fetchPetList() depois.

        return setPetListState({
            ...petListState,
            filters: customFilters
        });
    }

    return (
        <>
            <Grid item xs={12}>     {/* Início - Search Bar Component */}
                <Grid container justify={ isDownXs ? 'center' : 'space-between'} alignItems='center' className={styles.searchBarContainer}>

                    <Grid item>     {/* Início - Select Boxes */}

                        <Grid container justify={isDownXs ? 'center' : 'flex-start'} > 
                            <Grid item className={styles.searchBarItems}>
                                <TextField 
                                    id="especie"
                                    name="especie"
                                    label="Espécie"
                                    variant="outlined"
                                    size="small"
                                    value={searchBarState.especie}
                                    onChange= { (ev) => { setSearchBarState({ ...searchBarState, especie: ev.target.value }) } }
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    select
                                    className={styles.searchBarSelect}
                                >   
                                    {
                                        especies.map((option) => {
                                            return (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            )
                                        })
                                    }
                                </TextField>
                            </Grid>
                            <Grid item className={styles.searchBarItems}>
                                <TextField 
                                    id="adocao"
                                    name="adocao"
                                    label="Estado Adoção"
                                    variant="outlined"
                                    size="small"
                                    value={searchBarState.estadoAdocao}
                                    onChange= { (ev) => { setSearchBarState({ ...searchBarState, estadoAdocao: ev.target.value }) } }
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    select
                                    className={styles.searchBarSelect}
                                >   
                                    {
                                        estadosAdocao.map((option) => {
                                            return (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            )
                                        })
                                    }
                                </TextField>
                            </Grid>
                        </Grid>

                    </Grid>     {/* Fim - Select Boxes */}

                    <Grid item>     {/* Início - Search Box */}
                        <Grid container alignItems='center' justify={isDownXs ? 'center' : 'flex-start'} >
                            <Grid item className={styles.searchBarItems}>
                            <TextField 
                                id="search"
                                name="search"
                                type="text"
                                variant="outlined"
                                size="small"
                                value={searchBarState.nomePet}
                                onChange={ (ev) => { setSearchBarState({ ...searchBarState, nomePet: ev.target.value })}}
                                InputLabelProps={{
                                    shrink: true
                                }}
                                InputProps={{
                                    endAdornment:
                                        <Search />
                                }}
                            />
                            </Grid>
                            <Grid item className={styles.searchBarItems}>
                                <Button 
                                    onClick={handleClickSearch}
                                    variant='contained'
                                    color='primary'
                                    size='small'
                                >
                                    Buscar
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid> {/* Fim - Search Box */}

                </Grid>
            </Grid>     {/* Fim - Search Bar Component */}
        </>
    );
}

// Documentação das Props.
UserPetListSearchBar.propTypes = {
    petListState: PropTypes.object.isRequired,
    setPetListState: PropTypes.func.isRequired
}

// Exportações.
export default UserPetListSearchBar;