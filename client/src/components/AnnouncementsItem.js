// Importações.
import PropTypes from 'prop-types';
import { useState } from 'react';
// import { connect } from 'react-redux';

// Utilidades.
import { makeStyles }
    from '@material-ui/core/styles';

// Componentes.
import { Grid, Typography, CardActionArea } 
    from '@material-ui/core';

import { Pets, ThumbUp, Inbox, Visibility }
    from '@material-ui/icons';

import MdiSvgIcon from '@mdi/react';

import { mdiNeedle, mdiGenderMale, mdiGenderFemale, mdiCardAccountDetailsOutline,
         mdiBabyCarriageOff }
    from '@mdi/js';

import AnnouncementDetails from './AnnouncementDetails';

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
            backgroundColor: 'rgba(225, 225, 225, 0.80)',
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
            backgroundColor: 'rgba(225, 225, 225, 0.8)'
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
const AnnouncementsItem = (props) => {

    const { announcement } = props;

    const [openDetails, setOpenDetails] = useState(false);
    const [decision, setDecision] = useState(null);

    const handleOpenDetails = () => {
        setOpenDetails(true);
    }

    const handleCloseDetails = (newDecision) => {
        setOpenDetails(false);

        if (newDecision) {
            console.log('New Decision:', newDecision);
            setDecision(newDecision);
        }
    }

    const styles = useStyles();

    return (
        <>
        {
            announcement ?
                <>
                <Grid item xs={12} className={styles.itemBox}
                    style={{
                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.10),
                            rgba(0, 0, 0, 0.10)),
                            url(${announcement.download_foto.split(' ')[1]}),
                            url(${announcement.dados_animal.download_foto.split(' ')[1]})`, // retorna "GET endpoint" por isso o uso do split.
                    }}
                >  {/* Início - Anúncio */}

                    <Grid className={styles.boxContentLayout}>   {/* Início - Layout Anúncio */}

                        <Grid item> {/* Início - Área de Cabeçalho do anúncio */}

                            <CardActionArea 
                                onClick={handleOpenDetails}
                            >

                                <Grid container className={styles.boxContentHeader}>  {/* Conteúdo do Cabeçalho */}

                                    {
                                        announcement.dados_anunciante.ong_ativo ?
                                            <Grid item xs={2} title='Pet de ONG verificada' className={styles.headerBadgeContainer}>
                                                <Pets className={styles.ongBadge} />
                                            </Grid>
                                        : null
                                    }

                                    <Grid item xs={10} className={styles.headerTextContainer}>
                                        <Typography component='h1' variant='h6' title={announcement.dados_animal.nome}>
                                            {announcement.dados_animal.nome}
                                        </Typography>
                                    </Grid>

                                </Grid>

                            </CardActionArea>

                        </Grid> {/* Fim - Área de Cabeçalho do anúncio */}

                        <Grid item className={styles.clickableImageArea}>    {/* Início - Área de clique da imagem do anúncio */}
                            <CardActionArea
                                onClick={handleOpenDetails}
                                className={styles.fullHeight}
                            >
                            </CardActionArea>
                        </Grid>    {/* Fim - Área de clique da imagem do anúncio */}

                        <Grid item> {/* Início - Área de Ícones informativos do anúncio */}
                            <Grid container wrap='nowrap' className={styles.infoIconsContainer}>

                                <Grid item xs={3} title={'Avaliações: ' + announcement.qtd_avaliacoes} className={styles.baseIcons}>
                                    <ThumbUp className={styles.baseIconsColor} />
                                    <Typography component='span' noWrap className={styles.baseIconsTypography}>
                                        {announcement.qtd_avaliacoes}
                                    </Typography>
                                </Grid>

                                <Grid item xs={3} title={'Visualizações: ' + announcement.qtd_visualizacoes} className={styles.baseIcons}>
                                    <Visibility className={styles.baseIconsColor} />
                                    <Typography component='span' noWrap className={styles.baseIconsTypography}>
                                        {announcement.qtd_visualizacoes}
                                    </Typography>
                                </Grid>

                                <Grid item xs={3} title={'Candidaturas: ' + announcement.qtd_candidaturas} className={styles.baseIcons}>
                                    <Inbox className={styles.baseIconsColor} />
                                    <Typography component='span' noWrap className={styles.baseIconsTypography}>
                                        {announcement.qtd_candidaturas}
                                    </Typography>
                                </Grid>

                                <Grid item xs={3} className={styles.extraIconsContainer}>  {/* Início - Extra Icons */}
                                    
                                    {
                                        announcement.dados_animal.possui_rga ?
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
                                        announcement.dados_animal.esta_castrado ?
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
                                        announcement.dados_animal.esta_vacinado ?
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
                                        announcement.dados_animal.genero === 'M' ?
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
                                        announcement.dados_animal.genero === 'F' ?
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
                        </Grid> {/* Fim - Área de Ícones informativos do anúncio */}

                    </Grid>   {/* Início - Layout Anúncio */}

                </Grid>  {/* Fim - Anúncio */}
                <AnnouncementDetails 
                    keepMounted
                    itemId={announcement.cod_anuncio}
                    open={openDetails}
                    closeDetails={handleCloseDetails}
                    
                />
                </>
            : null
        }
        </>
    );
}

AnnouncementsItem.propTypes = {
    announcement: PropTypes.object
}

// Exportações.
export default AnnouncementsItem;