// Importações.
import { useState, useEffect } from 'react';
import { connect } from 'react-redux';

// Utilidades.
import axios from '../helpers/axiosInstance';
import { Link, useHistory } from 'react-router-dom';
import { makeStyles }
    from '@material-ui/core/styles';

// Actions.
import {  }
    from '../redux/actions';

// Componentes.
import { useTheme, useMediaQuery, Dialog, DialogTitle, DialogContent, DialogActions, List,
         ListItem, ListItemIcon, ListItemText, Grid, Divider, Typography, IconButton } 
    from '@material-ui/core';

import { Pets, ThumbUp, Inbox, Visibility, Close, NotInterested, FavoriteBorder, Email,
         Description }
    from '@material-ui/icons';

import MdiSvgIcon from '@mdi/react';

import { mdiCat, mdiNeedle, mdiGenderMale, mdiGenderFemale, mdiCardAccountDetailsOutline,
         mdiBabyCarriageOff }
    from '@mdi/js';

import UserAvatar from './UserAvatar';

// Inicializações.
const useStyles = makeStyles((theme) => {
    return {
        detailsDialog: {
            width: '800px',
            // maxHeight: '700px'
            backgroundColor: 'ghostwhite'
        },
        infoIconsContainer: {
            justifyContent: 'center',
            // borderTop: '2px solid black',
            overflow: 'auto',
            // backgroundColor: 'rgba(225, 225, 225, 0.8)'
        },
        baseIcons: {
            display: 'flex',
            alignItems: 'center',
            overflow: 'auto',
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
        },
        menuBtns: {
            backgroundColor: 'lightgrey',
            borderRadius: '4px',
            margin: '4px 0',
            paddingTop: '0',
            paddingBottom: '0'
        }
    }
});

// Functional Component.
const UserPetListBoxItemDetails = (props) => {

    const { userData, open, closeDetails, itemId: petId } = props;

    const [petDetails, setPetDetails] = useState(null);
    const [adoptionDocs, setAdoptionDocs] = useState(null);

    const styles= useStyles();
    const theme = useTheme();

    const history = useHistory();

    const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
    const isAtMinViewPort = useMediaQuery(theme.breakpoints.down('xs'));

    const handleClose = (newDecision) => {
        if (newDecision){
            closeDetails(newDecision);
        }

        closeDetails();
    }

    const handleDoc = () => {

        if (adoptionDocs){
            axios.get(adoptionDocs, {
                responseType: 'arraybuffer'     // A solução para exibição do pdf no navegador é definir que a resposta vai ser um 'arraybuffer' e tratar esse arraybuffer com um encoding base64.
            })
            .then(async (response) => {

                const file = new Blob([response.data], { type: 'application/pdf' })
                const url = window.URL.createObjectURL(file);
                window.open(url);   // Abre uma nova aba contendo os termos de responsabilidade do usuário.
                window.URL.revokeObjectURL(file);

            })
            .catch((error) => {
                console.log('handleDocsError:', error);
            });
        } else {
            return
        }

    }

    const handleEntering = () => {

        axios.get(`/usuarios/animais/?getOne=${petId}`)
        .then((response) => {
            if (response.data){

                setPetDetails(response.data);

                const anuncio = response.data.animal?.anuncio;

                if (anuncio){

                    // A chamada verificará se o usuário requisitante (autenticado no momento) possui algum documento
                    // vínculado ao anúncio que esse animal possui.
                    axios.get(`/anuncios/candidaturas/documentos/?fromAnnouncement=${anuncio.cod_anuncio}`)
                    .then((response) => {
                        if (response.data.download_documento){
                            setAdoptionDocs(response.data.download_documento.split(' ')[1]);
                        }
                    })
                    .catch((error) => {
                        if (error.response.status === 404){
                            return
                        }
                        return console.log('[UserPetListBoxItemDetails.js/handleEntering]: ', error.response?.data?.mensagem || error?.message || 'UNKNOWN');
                    });

                }
                
            }
        })
        .catch((error) => {
            console.log('[UserPetListBoxItemDetails.js/handleEntering]: ', error.response?.data?.mensagem || error?.message || 'UNKNOWN');
        });

    }

    return (
        <Dialog
            open={open}
            onClose={
                () => { 
                    handleClose('Sair');
                }
            }
            onEntering={handleEntering}
            // disableScrollLock={true}
            maxWidth="sm"
            fullScreen={isAtMinViewPort}
            scroll='body'
            aria-labelledby="simple-dialog-title"
            classes={{
                paper: styles.detailsDialog
            }}
        >
            {
                petDetails ?
                    <>
                    <DialogTitle style={{ padding: '8px' }} id="simple-dialog-title">
                        <Grid container justify='space-between' alignItems='center'>

                            <Grid item xs={11} sm={9}>
                                <Grid container>
                                    <Grid item xs={12} style={{ overflow: 'auto', whiteSpace: 'nowrap' }}>
                                        <Typography component='h1' variant='h6'>{petDetails.animal.nome} </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={1}>
                                <IconButton size='small' onClick={() => { handleClose('Sair') }} >
                                    <Close style={{ padding: '4px' }} />
                                </IconButton>
                            </Grid>

                        </Grid>
                    </DialogTitle>

                    <DialogContent style={{ padding: '8px' }} dividers>
                        <Grid container>
                            
                            <Grid item xs={12} sm={6} style={{ padding: '8px' }}>
                                <Grid container>

                                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', maxHeight: '220px', padding: '10px', paddingTop: '0px' }}>
                                        <div
                                            title={`Foto ${petDetails.animal.nome}`}
                                            style={{
                                                background: `url("${petDetails.animal.download_foto}")`,
                                                backgroundSize: 'contain',
                                                width: '200px',
                                                height: '200px',
                                                border: '1px solid black',
                                                borderRadius: '3px'
                                            }}
                                        ></div>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Divider />
                                    </Grid>
                                    
                                    <Grid item xs={12} style={{ minHeight: '100px', maxHeight: '100px', overflow: 'auto' }}>
                                        
                                        <Grid container alignItems='center'>
                                            {
                                                petDetails.animal.anuncio ?
                                                <>
                                                    <Grid item xs={12} style={{ whiteSpace: 'nowrap', overflow: 'auto', margin: '4px 0' }}>
                                                        
                                                        {/* Início - Ícones do anúncio, caso o pet esteja anúnciado. */}
                                                        <Grid container wrap='nowrap' className={styles.infoIconsContainer}>

                                                            <Grid item xs={3} title={`Avaliações: ${petDetails.animal.anuncio.qtd_avaliacoes}`} className={styles.baseIcons}>
                                                                <ThumbUp className={styles.baseIconsColor} />
                                                                <Typography component='span' className={styles.baseIconsTypography}>
                                                                    {petDetails.animal.anuncio.qtd_avaliacoes}
                                                                </Typography>
                                                            </Grid>

                                                            <Grid item xs={3} title={`Visualizações: ${petDetails.animal.anuncio.qtd_visualizacoes}`} className={styles.baseIcons}>
                                                                <Visibility className={styles.baseIconsColor} />
                                                                <Typography component='span' className={styles.baseIconsTypography}>
                                                                    {petDetails.animal.anuncio.qtd_visualizacoes}
                                                                </Typography>
                                                            </Grid>

                                                            <Grid item xs={3} title={`Candidaturas: ${petDetails.animal.anuncio.qtd_candidaturas}`} className={styles.baseIcons}>
                                                                <Inbox className={styles.baseIconsColor} />
                                                                <Typography component='span' className={styles.baseIconsTypography}>
                                                                    {petDetails.animal.anuncio.qtd_candidaturas}
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                        {/* Fim - Ícones do anúncio, caso o pet esteja anúnciado */}
                                                        
                                                    </Grid>
                                                </>
                                                : null
                                            }

                                            <Grid item xs={12} style={{ whiteSpace: 'nowrap', overflow: 'auto', minHeight: '42px', margin: '4px 0' }}>
                                                <Typography component='h2' align='center' style={{ fontWeight: 'bold' }}>
                                                    Estado de adoção
                                                </Typography>
                                                <Typography component='p' variant='caption' align='center' style={{ color: 'dimgrey' }}>
                                                    {
                                                        petDetails.animal.estado_adocao === 'Sob protecao' ?
                                                            'Obrigado por cuidar de mim!'
                                                        : null
                                                    }
                                                    {
                                                        petDetails.animal.estado_adocao === 'Em anuncio' ?
                                                            'Adote-me!'
                                                        : null
                                                    }
                                                    {
                                                        petDetails.animal.estado_adocao === 'Em processo adotivo' ?
                                                        'Alguém se interessou em me adotar!'
                                                        : null
                                                    }
                                                    {
                                                        petDetails.animal.estado_adocao === 'Adotado' ?
                                                            'Fui adotado! Obrigado por ter cuidado de mim!'
                                                        : null
                                                    }
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                        

                                    <Grid item xs={12}>
                                        <Divider />
                                    </Grid>
                                    
                                    {
                                        isDesktop ?
                                        <Grid item xs={12}>
                                            <Typography component='h2' align='center' style={{ fontWeight: 'bold', marginTop: '8px' }}>
                                                Opções
                                            </Typography>
                                            <DialogActions style={{ maxHeight: '130px' }} >

                                                <List style={{ overflow: 'auto', maxHeight: '130px', width: '100%' }}>

                                                    {
                                                        userData.user.cod_usuario === petDetails.animal.cod_dono ?
                                                        <>
                                                            <ListItem component='button' button key='btn_rmvPet' onClick={() => { }} classes={{ 'button': styles.menuBtns }}>
                                                                <ListItemIcon><NotInterested fontSize='small' /></ListItemIcon>
                                                                <ListItemText
                                                                    primary={<Typography noWrap variant='button'>Remover Pet</Typography>}
                                                                />
                                                            </ListItem>
                                                        </>
                                                        : null
                                                    }

                                                    <ListItem component='button' button key='btn_talkWithOwner' onClick={() => {}} classes={{ 'button': styles.menuBtns }}>
                                                        <ListItemIcon><Email fontSize='small' /></ListItemIcon>
                                                        <ListItemText
                                                            primary={<Typography noWrap variant='button'>Falar com o dono</Typography>}
                                                        />
                                                    </ListItem>

                                                    {
                                                        adoptionDocs ?
                                                            <ListItem component='a' button key='btn_getDocs' onClick={handleDoc} classes={{ 'button': styles.menuBtns }}>
                                                                <ListItemIcon><Description fontSize='small' /></ListItemIcon>
                                                                <ListItemText
                                                                    primary={<Typography noWrap variant='button'>Ver Documentos</Typography>}
                                                                />
                                                            </ListItem>
                                                        : null
                                                    }

                                                </List>
                                            </DialogActions>
                                        </Grid>
                                        : null
                                    }
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={6} style={{ maxHeight: '485px', overflow: 'auto'}}>

                                {
                                    petDetails.animal.dono_antigo ?
                                    <>
                                        <Grid container justify='center' alignItems='center'>

                                            <Grid item xs={12}>

                                                <Typography component='h2' align='center' style={{ fontWeight: 'bold' }}>
                                                    Antigo dono
                                                </Typography>

                                            </Grid>

                                            <Grid item xs={12} style={{ textAlign: 'center' }}>
                                                <IconButton size='small' onClick={() => { history.push(`/user/${petDetails.animal.dono_antigo.cod_usuario}`) }} >
                                                    <UserAvatar
                                                        user={petDetails.animal.dono_antigo}
                                                        width='50px'
                                                        height='50px'
                                                        badgesWidth='15px'
                                                        badgesHeight='15px'
                                                        showOngBadge
                                                    />
                                                </IconButton>
                                            </Grid>

                                            <Grid item xs={12}>
                                                <Typography component='p' align='center' style={{ fontWeight: 'bold', color: 'dimgrey' }}>
                                                    {petDetails.animal.dono_antigo.primeiro_nome} {petDetails.animal.dono_antigo.sobrenome}
                                                </Typography>
                                            </Grid>

                                        </Grid>

                                        <Divider style={{ margin: '4px 0' }}/>
                                    </>
                                    : null
                                }

                                <Typography component='h2' align='center' style={{ fontWeight: 'bold' }}>
                                    Informações básicas
                                </Typography>

                                <Grid container justify='center' style={{ margin: '8px 0' }}>

                                    <Grid item xs={6}>
                                        <Typography component='p' noWrap align='center' style={{ fontWeight: 'bold' }}>
                                            Espécie
                                        </Typography>
                                        <Typography component='p' align='center' style={{ overflow: 'auto', fontWeight: 'lighter', color: 'black' }}>
                                            { petDetails.animal.especie === 'Cao' ? 'Cão' : petDetails.animal.especie }
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Typography component='p' noWrap align='center' style={{ fontWeight: 'bold' }}>
                                            Raça
                                        </Typography>
                                        <Typography component='p' align='center' style={{ overflow: 'auto', fontWeight: 'lighter', color: 'black' }}>
                                            { petDetails.animal.raca }
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Typography component='p' noWrap align='center' style={{ fontWeight: 'bold' }}>
                                            Gênero
                                        </Typography>
                                        <Typography component='p' align='center' style={{ overflow: 'auto', fontWeight: 'lighter', color: 'black' }}>
                                            { petDetails.animal.genero === 'M' ? 'Macho' : 'Fêmea' }
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Typography component='p' noWrap align='center' style={{ fontWeight: 'bold' }}>
                                            Porte
                                        </Typography>
                                        <Typography component='p' align='center' style={{ overflow: 'auto', fontWeight: 'lighter', color: 'black' }}>
                                            { petDetails.animal.porte === 'P' ? 'Pequeno' : null }
                                            { petDetails.animal.porte === 'M' ? 'Médio' : null }
                                            { petDetails.animal.porte === 'G' ? 'Grande' : null }
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Typography component='p' noWrap align='center' style={{ fontWeight: 'bold' }}>
                                            Castrado?
                                        </Typography>
                                        <Typography component='p' align='center' style={{ overflow: 'auto', fontWeight: 'lighter', color: 'black' }}>
                                            { petDetails.animal.esta_castrado ? 'Sim' : 'Não' }
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Typography component='p' noWrap align='center' style={{ fontWeight: 'bold' }}>
                                            Vacinado?
                                        </Typography>
                                        <Typography component='p' align='center' style={{ overflow: 'auto', fontWeight: 'lighter', color: 'black' }}>
                                            { petDetails.animal.esta_vacinado ? 'Sim' : 'Não' }
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Typography component='p' noWrap align='center' style={{ fontWeight: 'bold' }}>
                                            Possui RGA?
                                        </Typography>
                                        <Typography component='p' align='center' style={{ overflow: 'auto', fontWeight: 'lighter', color: 'black' }}>
                                            { petDetails.animal.possui_rga ? 'Sim' : 'Não' }
                                        </Typography>
                                    </Grid>

                                </Grid>

                                <Divider style={{ margin: '4px 0' }}/>

                                <Typography component='h2' align='center' style={{ margin: '8px 0', fontWeight: 'bold' }}>
                                    Saúde
                                </Typography>
                                    <Typography component='p' style={{ fontWeight: 'lighter', color: 'black', margin: '4px 0' }}>
                                        { petDetails.animal.detalhes_saude }
                                    </Typography>

                                <Divider style={{ margin: '4px 0' }}/>

                                <Typography component='h2' align='center' style={{ margin: '8px 0', fontWeight: 'bold' }}>
                                    Comportamento
                                </Typography>
                                    <Typography component='p' style={{ fontWeight: 'lighter', color: 'black', margin: '4px 0' }}>
                                        { petDetails.animal.detalhes_comportamento }
                                    </Typography>

                                <Divider style={{ margin: '4px 0' }}/>

                                <Typography component='h2' align='center' style={{ margin: '8px 0', fontWeight: 'bold' }}>
                                    História
                                </Typography>
                                    <Typography component='p' style={{ fontWeight: 'lighter', color: 'black', margin: '4px 0' }}>
                                        { petDetails.animal.historia }
                                    </Typography>

                            </Grid>
                        </Grid>    
                    </DialogContent>
                    {
                        !isDesktop ?
                        <div>
                            <Typography component='h2' align='center' style={{ fontWeight: 'bold', marginTop: '8px' }}>
                                Opções
                            </Typography>
                            <DialogActions style={{ maxHeight: '130px' }} >

                                <List style={{ overflow: 'auto', maxHeight: '130px', width: '100%' }}>

                                    {
                                        userData.user.cod_usuario === petDetails.animal.cod_dono ?
                                        <>
                                            <ListItem component='button' button key='btn_rmvPet' onClick={() => { }} classes={{ 'button': styles.menuBtns }}>
                                                <ListItemIcon><NotInterested fontSize='small' /></ListItemIcon>
                                                <ListItemText
                                                    primary={<Typography noWrap variant='button'>Remover Pet</Typography>}
                                                />
                                            </ListItem>
                                        </>
                                        : null
                                    }

                                    <ListItem component='button' button key='btn_talkWithOwner' onClick={() => {}} classes={{ 'button': styles.menuBtns }}>
                                        <ListItemIcon><Email fontSize='small' /></ListItemIcon>
                                        <ListItemText
                                            primary={<Typography noWrap variant='button'>Falar com o dono</Typography>}
                                        />
                                    </ListItem>

                                    {
                                        adoptionDocs ?
                                            <ListItem component='a' button key='btn_getDocs' onClick={handleDoc} classes={{ 'button': styles.menuBtns }}>
                                                <ListItemIcon><Description fontSize='small' /></ListItemIcon>
                                                <ListItemText
                                                    primary={<Typography noWrap variant='button'>Ver Documentos</Typography>}
                                                />
                                            </ListItem>
                                        : null
                                    }

                                </List>
                            </DialogActions>
                        </div>
                        : null
                    }
                    
                    </>
                : null
            }
        </Dialog>
    );
}

// Redux Store Mapping.
const mapStateToProps = (state) => {
    return {
        userData: state.user
        // announcementData: state.announcement
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        // fetchAnnouncements: (page, limit) => { return dispatch( fetchAnnouncements(page, limit) ) },
        // openSnackbar: (message, severity) => { return dispatch( openSnackbar(message, severity) ) },
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserPetListBoxItemDetails);