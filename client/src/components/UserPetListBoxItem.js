// Importações.
import PropTypes from 'prop-types';
import { useState } from 'react';

// Utilidades.
import { makeStyles } from '@material-ui/core/styles';

// Actions.

// Components.
import { Grid, Typography, CardActionArea }
    from '@material-ui/core';

// import { Pets, ThumbUp, Inbox, Visibility }
//     from '@material-ui/icons';

import MdiSvgIcon from '@mdi/react';

import { mdiNeedle, mdiGenderMale, mdiGenderFemale, mdiCardAccountDetailsOutline,
         mdiBabyCarriageOff }
    from '@mdi/js';

import UserPetListBoxItemDetails from './UserPetListBoxItemDetails';

// Inicializações.
const useStyles = makeStyles((theme) => {
    return { 
        itemBox: {
            border: '2px solid black',
            borderRadius: '7px',
            overflow: 'hidden',
            boxSizing: 'content-box',
            backgroundColor: 'whitesmoke',
            minWidth: '300px',
            maxWidth: '300px',
            height: '300px',
            margin:'4px',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            // backgroundAttachment: 'fixed',
            backgroundPosition: 'center'
        },
        boxContentLayout: {
            display: 'flex',
            flexDirection: 'column',
            height:'100%',
            justifyContent:'space-between'
        },
        boxContentHeader: {
            borderBottom: '2px solid black',
            backgroundColor: 'rgba(255, 255, 255, 0.80)',
            padding: '4px'
        },
        headerBadgeContainer: {
            display: 'flex',
            margin: 'auto 0',
            justifyContent: 'center',
            padding:'0 8px'
        },
        ongBadge: {
            padding: '2px',
            width: '24px',
            height: '24px',
            borderRadius: '50%', 
            boxShadow: '0px 0px 5px rgba(0,0,0,0.5)',
            color: 'green'
        },
        headerTextContainer: {
            textAlign: 'left'
        },
        clickableImageArea: {
            flex: '1'
        },
        fullHeight: {
            height: '100%'
        },
        infoIconsContainer: {
            borderTop: '2px solid black',
            overflow: 'auto',
            backgroundColor: 'rgba(255, 255, 255, 0.8)'
        },
        baseIcons: {
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
            padding: '4px',
            // borderRight: '2px solid black'
        },
        baseIconsColor: {
            color: 'dimgrey'
        },
        baseIconsTypography: {
            fontFamily: 'monospace',
            paddingLeft: '4px'
        },
        extraIconsContainer: {
            display: 'flex',
            flexDirection: 'row-reverse',
            alignItems: 'center',
            overflow: 'auto',
            padding: '4px',
            borderLeft: '0px solid black'
        },
        extraIcon: {
            display: 'flex',
            alignItems: 'center',
            paddingLeft: '8px',
            margin: '0'
        }
    }
});

// Functional Component.
const UserPetListBoxItem = (props) => {

    const { pet } = props;

    const [openDetails, setOpenDetails] = useState(false);
    const [decision, setDecision] = useState(null);

    const handleOpenDetails = () => {
        setOpenDetails(true);
    }

    const handleCloseDetails = (newDecision) => {
        setOpenDetails(false);

        if (newDecision) {
            // console.log('[UserPetListBoxItem.js] Close details decision:', newDecision);
            setDecision(newDecision);
        }
    }

    const styles = useStyles();

    return (
        <>
        {
            pet ?
            <>
                <Grid item xs={12} className={styles.itemBox}
                    style={{
                        backgroundImage: `url(${pet.download_foto})`, // Diferente do anúncio, essa chamada não retorna "GET http..../...jpeg", só "http .../...jpeg"
                        border: pet.estado_adocao === 'Adotado' ? '2px solid grey' : '2px solid black',
                    }}
                >  {/* Início - PetListBoxItem */}

                    <Grid className={styles.boxContentLayout}>   {/* Início - Layout PetListBoxItem */}

                        <Grid item> {/* Início - Área de Cabeçalho do PetListBoxItem */}

                            <CardActionArea 
                                onClick={handleOpenDetails}
                            >

                                <Grid container className={styles.boxContentHeader} style={ pet.estado_adocao === 'Adotado' ? { borderBottom: '2px solid grey' } : {} }>  {/* Conteúdo do Cabeçalho */}

                                    <Grid item xs={12} className={styles.headerTextContainer}>
                                        <Typography component='h1' variant='h6' title={pet.nome} style={ pet.estado_adocao === 'Adotado' ? { color: 'grey' } : {} }>
                                            {pet.nome}
                                        </Typography>
                                    </Grid>

                                </Grid>

                            </CardActionArea>

                        </Grid> {/* Fim - Área de Cabeçalho do PetListBoxItem */}

                        <Grid item className={styles.clickableImageArea}>    {/* Início - Área de clique da imagem do PetListBoxItem */}
                            <CardActionArea
                                onClick={handleOpenDetails}
                                className={styles.fullHeight}
                            >
                            </CardActionArea>
                        </Grid>    {/* Fim - Área de clique da imagem do PetListBoxItem */}

                        <Grid item> {/* Início - Área de Ícones informativos do PetListBoxItem */}
                            <Grid container wrap='nowrap' className={styles.infoIconsContainer} style={ pet.estado_adocao === 'Adotado' ? { borderTop: '2px solid grey' } : {} }>

                                <Grid item xs={12} className={styles.extraIconsContainer}>  {/* Início - Extra Icons */}
                                    
                                    {
                                        pet.possui_rga ?
                                            <div className={styles.extraIcon}>
                                                <MdiSvgIcon
                                                    path={mdiCardAccountDetailsOutline}
                                                    title='Possui RGA'
                                                    size={1.2}
                                                    color="dimgrey"
                                                />
                                            </div>
                                        : null
                                    }
                                    {
                                        pet.esta_castrado ?
                                            <div className={styles.extraIcon}>
                                                <MdiSvgIcon
                                                    path={mdiBabyCarriageOff}
                                                    title='Castrado'
                                                    size={1.2}
                                                    color='dimgrey'
                                                />
                                            </div>
                                        : null
                                    }
                                    {
                                        pet.esta_vacinado ?
                                            <div className={styles.extraIcon}>
                                                <MdiSvgIcon
                                                    path={mdiNeedle}
                                                    title='Recebeu vacinas'
                                                    size={1.2}
                                                    color="dimgrey"
                                                />
                                            </div>
                                        : null
                                    }
                                    {
                                        pet.genero === 'M' ?
                                            <div className={styles.extraIcon}>
                                                <MdiSvgIcon
                                                    path={mdiGenderMale}
                                                    title='Macho'
                                                    size={1.2}
                                                    color="dimgrey"
                                                />
                                            </div>
                                        : null
                                    }
                                    {
                                        pet.genero === 'F' ?
                                            <div className={styles.extraIcon}>
                                                <MdiSvgIcon
                                                    path={mdiGenderFemale}
                                                    title='Fêmea'
                                                    size={1.2}
                                                    color="dimgrey"
                                                />
                                            </div>
                                        : null
                                    }
                                    
                                </Grid>  {/* Fim - Extra Icons */}

                            </Grid>
                        </Grid> {/* Fim - Área de Ícones informativos do PetListBoxItem */}

                    </Grid>   {/* Início - Layout PetListBoxItem */}

                </Grid>  {/* Fim - PetListBoxItem */}

                <UserPetListBoxItemDetails 
                    keepMounted
                    itemId={pet.cod_animal}
                    open={openDetails}
                    closeDetails={handleCloseDetails}
                    
                />

                </>
            : null
        }
        </>
    );
}

// Documentação das Props.
UserPetListBoxItem.propTypes = {
    pet: PropTypes.object.isRequired
    // petListState: PropTypes.object,
    // fetchPetList: PropTypes.func
}

// Exportações.
export default UserPetListBoxItem;