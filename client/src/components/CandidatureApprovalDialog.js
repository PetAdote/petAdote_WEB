// Importações.
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// Utilidades.
import axios from '../helpers/axiosInstance';
import { makeStyles }
    from '@material-ui/core/styles';

import { useSnackbar } from 'notistack';

// Actions.
// import { fetchUser }
//     from '../redux/actions';

// Componentes.
import { useTheme, useMediaQuery,
         Grid, Dialog, DialogTitle, DialogContent, DialogActions, List,
         ListItem, ListItemIcon, ListItemText, Divider, Typography, IconButton,
         TextField, Button, MenuItem, FormControlLabel, Checkbox } 
    from '@material-ui/core';

import { Close }
    from '@material-ui/icons';

// Inicializações.
const useStyles = makeStyles((theme) => {
    return {

        addressDataDialog: {
            width: '800px',
            backgroundColor: 'ghostwhite',
            [theme.breakpoints.between('sm', 'lg')]: {
                // right: '4px'
            }
        },
        formInput: {
            padding: '8px 0'
        },
        formButton: {
            width: '100px',
            margin: '8px'
        }
        
    }
});

// Functional Component.
const CandidatureApprovalDialog = (props) => {

    const { openDialog, closeDialog, candidatureData } = props;

    const styles = useStyles();
    const theme = useTheme();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
    const isAtMinViewPort = useMediaQuery(theme.breakpoints.down('xs'));

    const initialAddressData = {
        cep: '',
        logradouro: '',
        bairro: '',
        cidade: '',
        uf: '',
        numero: '',
        complemento: '',
    };

    const [newAddressData, setNewAddressData] = useState(initialAddressData);

    const [confirm, setConfirm] = useState(false);

    const estados = [
        { value: "DEFAULT", label: "Selecione seu estado" },
        { value: "AC", label: "Acre" },
        { value: "AL", label: "Alagoas" },
        { value: "AP", label: "Amapá" },
        { value: "AM", label: "Amazonas" },
        { value: "BA", label: "Bahia" },
        { value: "CE", label: "Ceará" },
        { value: "DF", label: "Distrito Federal" },
        { value: "ES", label: "Espírito Santo" },
        { value: "GO", label: "Goiás" },
        { value: "MA", label: "Maranhão" },
        { value: "MT", label: "Mato Grosso" },
        { value: "MS", label: "Mato Grosso do Sul" },
        { value: "MG", label: "Minas Gerais" },
        { value: "PA", label: "Pará" },
        { value: "PB", label: "Paraíba" },
        { value: "PR", label: "Paraná" },
        { value: "PE", label: "Pernambuco" },
        { value: "PI", label: "Piauí" },
        { value: "RJ", label: "Rio de Janeiro" },
        { value: "RN", label: "Rio Grande do Norte" },
        { value: "RS", label: "Rio Grande do Sul" },
        { value: "RO", label: "Rondônia" },
        { value: "RR", label: "Roraima" },
        { value: "SC", label: "Santa Catarina" },
        { value: "SP", label: "São Paulo" },
        { value: "SE", label: "Sergipe" },
        { value: "TO", label: "Tocantins" }
    ];

    const handleClose = (newDecision) => {
        if (newDecision) {
            closeDialog(newDecision);
        }

        closeDialog();
    }

    const handleClear = () => {
        setNewAddressData(initialAddressData);
    }

    const handleGoBackAndClear = (newDecision) => {
        // setNewAddressData(initialAddressData);
        handleClose(newDecision);
    }

    const handleSetCandidatureConclusionLocation = () => {
        // console.log('[CandidatureApprovalDialog.js] candidature conclusion location: ', newAddressData);
        // console.log('[CandidatureApprovalDialog.js] candidature data: ', candidatureData);

        if (!confirm){
            return enqueueSnackbar('Para continuar é necessário confirmar a declaração acima.', { variant: 'info' });
        }

        axios.post(`/anuncios/candidaturas/pontosencontro/${candidatureData.cod_candidatura}`, {
            cep: newAddressData.cep,
            uf: newAddressData.uf === 'DEFAULT' ? '' : newAddressData.uf,
            cidade: newAddressData.cidade,
            bairro: newAddressData.bairro,
            logradouro: newAddressData.logradouro,
            numero: newAddressData.numero
        })
        .then((response) => {

            console.log('[CandidatureApprovalDialog.js] adoption location has been set:', response.data);

            enqueueSnackbar('O local de encontro da adoção foi registrado! A candidatura será aprovada em breve...', { variant: 'success', autoHideDuration: 20 * 1000 });
            handleGoBackAndClear('ADOPTION_LOCATION_IS_SET');

        })
        .catch((error) => {

            console.log('[CandidatureApprovalDialog.js] unexpected error @ set adoption location:', error?.response?.data || error?.message);

            const errorMsg = error.response?.data?.error?.mensagem || error.response?.data?.mensagem || 'Falha ao registrar o local de conclusão da adoção.';

            enqueueSnackbar(errorMsg, { variant: 'error' });
            handleGoBackAndClear();
        });

    }

    return (
        <Dialog
            open={openDialog}
            // onClose={
            //     () => {
            //         handleGoBackAndClear();
            //     }
            // }
            // onEntering={handleEntering}
            // disableScrollLock={true}
            maxWidth="sm"
            fullScreen={isAtMinViewPort}
            scroll='body'
            aria-labelledby="address-data-dialog"
            classes={{
                paper: styles.addressDataDialog
            }}
            disableBackdropClick
            disableEscapeKeyDown
        >

            <DialogTitle style={{ padding: '8px' }} id="address-data-dialog">
                <Grid container justify='space-between' alignItems='center'>

                    <Grid item xs={11} sm={9} style={{ margin: '0 auto'}}>
                        <Grid container>
                            <Grid item xs={12} style={{ overflow: 'auto', whiteSpace: 'nowrap' }}>
                                <Typography component='h1' variant='h6' align='center'>Local de Encontro</Typography>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={1}>
                        <IconButton size='small' onClick={() => { handleGoBackAndClear() }} >
                            <Close style={{ padding: '4px' }} />
                        </IconButton>
                    </Grid>

                </Grid>
            </DialogTitle>

            <DialogContent style={{ padding: '8px' }} dividers>

                <Grid container>

                    <Grid item xs={12} style={{ padding: '4px 8px' }}>
                        <Typography component='p' variant='caption'>
                            Defina o local onde a entrega do animal será realizada.
                        </Typography>
                    </Grid>

                    <Grid item xs={6} className={styles.formInput}
                        style={{paddingRight: '8px'}}
                    >
                        <TextField
                            id="cep"
                            name="cep"
                            label="CEP"
                            type='text'
                            variant="outlined"
                            size="small"
                            value={newAddressData.cep}
                            placeholder='12345-123'
                            onChange={ (ev) => { setNewAddressData({ ...newAddressData, cep: ev.target.value }) } }
                            InputLabelProps={{
                                shrink: true
                            }}
                            fullWidth
                            required
                            autoFocus
                        />
                    </Grid>

                    <Grid item xs={6} className={styles.formInput}>
                        <TextField
                            id="numero"
                            name="numero"
                            label="Numero"
                            type='text'
                            variant="outlined"
                            size="small"
                            value={newAddressData.numero}
                            placeholder='123'
                            onChange={ (ev) => { setNewAddressData({ ...newAddressData, numero: ev.target.value }) } }
                            InputLabelProps={{
                                shrink: true
                            }}
                            fullWidth
                            required
                        />
                    </Grid>

                    <Grid item xs={12} className={styles.formInput}>
                        <TextField
                            id="uf"
                            name="uf"
                            label="UF"
                            variant="outlined"
                            size="small"
                            value={newAddressData.uf || 'DEFAULT'}
                            onChange={ (ev) => { setNewAddressData({ ...newAddressData, uf: ev.target.value === 'DEFAULT' ? '' : ev.target.value }) } }
                            InputLabelProps={{
                                shrink: true
                            }}
                            select
                            fullWidth
                            required
                        >
                            {
                                estados.map((option) => {
                                    return (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    )
                                })
                            }
                        </TextField>
                    </Grid>

                    <Grid item xs={12} className={styles.formInput}>
                        <TextField
                            id="cidade"
                            name="cidade"
                            label="Cidade"
                            type='text'
                            variant="outlined"
                            size="small"
                            value={newAddressData.cidade}
                            placeholder='Digite o nome da sua cidade'
                            onChange={ (ev) => { setNewAddressData({ ...newAddressData, cidade: ev.target.value }) } }
                            InputLabelProps={{
                                shrink: true
                            }}
                            fullWidth
                            required
                        />
                    </Grid>

                    <Grid item xs={12} className={styles.formInput}>
                        <TextField
                            id="bairro"
                            name="bairro"
                            label="Bairro"
                            type='text'
                            variant="outlined"
                            size="small"
                            value={newAddressData.bairro}
                            placeholder='Digite o nome do seu bairro'
                            onChange={ (ev) => { setNewAddressData({ ...newAddressData, bairro: ev.target.value }) } }
                            InputLabelProps={{
                                shrink: true
                            }}
                            fullWidth
                            required
                        />
                    </Grid>

                    <Grid item xs={12} className={styles.formInput}>
                        <TextField
                            id="logradouro"
                            name="logradouro"
                            label="Logradouro"
                            type='text'
                            variant="outlined"
                            size="small"
                            value={newAddressData.logradouro}
                            placeholder='Digite o seu logradouro'
                            onChange={ (ev) => { setNewAddressData({ ...newAddressData, logradouro: ev.target.value }) } }
                            InputLabelProps={{
                                shrink: true
                            }}
                            fullWidth
                            required
                        />
                    </Grid>

                    <Grid item xs={12} className={styles.formInput}>
                        <TextField
                            id="complemento"
                            name="complemento"
                            label="Complemento"
                            type='text'
                            variant="outlined"
                            size="small"
                            value={newAddressData.complemento}
                            placeholder='Se necessário, digite o complemento'
                            onChange={ (ev) => { setNewAddressData({ ...newAddressData, complemento: ev.target.value }) } }
                            InputLabelProps={{
                                shrink: true
                            }}
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={12} style={{ padding: '4px 8px' }}>
                        <Typography component='p' variant='caption'>
                            <b>Atenção:</b> Ao clicar em concluir <b>você aprovará a candidatura selecionada e estará declarando que o endereço de encontro para a entrega do animal ao candidato é real e seguro</b>. Antes de prosseguir, certifique-se de que as informações estão corretas e que o candidato está ciente e de acordo com o local de encontro.
                        </Typography>
                    </Grid>

                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', padding: '8px' }}>
                        <FormControlLabel 
                            control={
                                <Checkbox 
                                    checked={confirm}
                                    color='primary'
                                    onChange={(ev) => { setConfirm(!confirm) }}
                                />
                            }
                            label="As informações estão corretas e o candidato está ciente e de acordo com o local de encontro."
                            labelPlacement='end'
                        />
                    </Grid>

                </Grid>

            </DialogContent>

            <DialogActions >
                
                <Grid container justify='center'>
                    <Grid item>
                        <Button 
                            onClick={handleSetCandidatureConclusionLocation}
                            // disabled={activeStep === 0}
                            variant='contained'
                            color='primary'
                            size='small'
                            className={styles.formButton}
                        >
                            Concluir
                        </Button>
                    </Grid>

                    <Grid item>
                        <Button 
                            onClick={handleClear}
                            // disabled={activeStep === 0}
                            variant='contained'
                            color='primary'
                            size='small'
                            className={styles.formButton}
                        >
                            Limpar
                        </Button>
                    </Grid>

                    <Grid item>
                        <Button 
                            onClick={handleGoBackAndClear}
                            // disabled={activeStep === 0}
                            variant='contained'
                            color='primary'
                            size='small'
                            className={styles.formButton}
                        >
                            Voltar
                        </Button>
                    </Grid>

                </Grid>

            </DialogActions>


        </Dialog>
    );

}


CandidatureApprovalDialog.propTypes = {
    openDialog: PropTypes.bool.isRequired,
    closeDialog: PropTypes.func.isRequired,
    // userAddressData: PropTypes.object.isRequired,
    // setUserAddressData: PropTypes.func.isRequired
}

// Redux Store Mapping.
const mapStateToProps = (state) => {
    return {
        userData: state.user
        // announcementsData: state.announcements
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        // clearPets: () => { return dispatch( clearPets() ) },
        // openSnackbar: (message, severity) => { return dispatch( openSnackbar(message, severity) ) }
        // fetchAnnouncements: (page, limit) => { return dispatch( fetchAnnouncements(page, limit) ) },
        // fetchUser: () => { return dispatch ( fetchUser() ) },
    }
}

// Exportações.
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CandidatureApprovalDialog);