// Importações.
import { useState } from 'react';
// import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// Utilidades.
// import axios from '../helpers/axiosInstance';
// import { Link, useHistory } from 'react-router-dom';
import { makeStyles }
    from '@material-ui/core/styles';

// Actions.
// import {  }
//     from '../redux/actions';

// Componentes.
import { useTheme, useMediaQuery,
         Grid, Dialog, DialogTitle, DialogContent, DialogActions, Typography, IconButton,
         TextField, Button } 
    from '@material-ui/core';

import { Close }
    from '@material-ui/icons';

// Inicializações.
const useStyles = makeStyles((theme) => {
    return {
        personalDataDialog: {
            width: '800px',
            backgroundColor: 'ghostwhite'
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
const UserAccPersonalDataDialog = (props) => {

    const { openDialog, closeDialog, userPersonalData, setUserPersonalData } = props;

    const styles = useStyles();
    const theme = useTheme();

    // const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
    const isAtMinViewPort = useMediaQuery(theme.breakpoints.down('xs'));

    const initialPersonalData = {
        nome: '',
        sobrenome: '',
        dataNascimento: '',
        cpf: '',
        telefone: '',
        descricao: '',
    };

    const [newPersonalData, setNewPersonalData] = useState(initialPersonalData);

    const handleClose = (newDecision) => {
        if (newDecision) {
            closeDialog(newDecision);
        }

        closeDialog();
    }

    // const handleEntering = () => {
        // Se for necessário executar algo quando o dialog aparece, faça aqui.
    // }

    const handleGoBackToVerify = () => {
        setUserPersonalData({ ...userPersonalData, ...newPersonalData });
        handleClose();
    }

    const handleClear = () => {
        setNewPersonalData(initialPersonalData);
    }

    const handleGoBackAndClear = () => {
        setNewPersonalData(initialPersonalData);
        setUserPersonalData({ ...userPersonalData, ...initialPersonalData });
        handleClose();
    }

    return (
        <Dialog
            open={openDialog}
            onClose={
                () => {
                    handleGoBackAndClear();
                }
            }
            // onEntering={handleEntering}
            // disableScrollLock={true}
            maxWidth="sm"
            fullScreen={isAtMinViewPort}
            scroll='body'
            aria-labelledby="personal-data-dialog"
            classes={{
                paper: styles.personalDataDialog
            }}
            disableBackdropClick
            disableEscapeKeyDown
        >

            <DialogTitle style={{ padding: '8px' }} id="personal-data-dialog">
                <Grid container justify='space-between' alignItems='center'>

                    <Grid item xs={11} sm={9} style={{ margin: '0 auto'}}>
                        <Grid container>
                            <Grid item xs={12} style={{ overflow: 'auto', whiteSpace: 'nowrap' }}>
                                <Typography component='h1' variant='h6' align='center'>Dados pessoais</Typography>
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

                    <Grid item xs={12} className={styles.formInput}>
                        <TextField
                            id="nome"
                            name="nome"
                            label="Primeiro nome"
                            type='text'
                            variant="outlined"
                            size="small"
                            value={newPersonalData.nome}
                            onChange={ (ev) => { setNewPersonalData({ ...newPersonalData, nome: ev.target.value }) } }
                            InputLabelProps={{
                                shrink: true
                            }}
                            fullWidth
                            required
                            autoFocus
                        />
                    </Grid>

                    <Grid item xs={12} className={styles.formInput}>
                        <TextField
                            id="sobrenome"
                            name="sobrenome"
                            label="Sobrenome"
                            type='text'
                            variant="outlined"
                            size="small"
                            value={newPersonalData.sobrenome}
                            onChange={ (ev) => { setNewPersonalData({ ...newPersonalData, sobrenome: ev.target.value }) } }
                            InputLabelProps={{
                                shrink: true
                            }}
                            fullWidth
                            required
                        />
                    </Grid>
                       
                    <Grid item xs={12} className={styles.formInput}>
                        <TextField
                            id="dataNascimento"
                            name="dataNascimento"
                            label="Data de nascimento"
                            type='date'
                            variant="outlined"
                            size="small"
                            value={newPersonalData.dataNascimento}
                            onChange={ (ev) => { setNewPersonalData({ ...newPersonalData, dataNascimento: ev.target.value }) } }
                            InputLabelProps={{
                                'shrink': true
                            }}
                            inputProps={{
                            max: '9999-12-31'  
                            }}
                            fullWidth
                            required
                        />
                    </Grid>

                    <Grid item xs={12} className={styles.formInput}>
                        <TextField
                            id="cpf"
                            name="cpf"
                            label="CPF"
                            type='text'
                            variant="outlined"
                            size="small"
                            value={newPersonalData.cpf}
                            placeholder='123.123.123-12'
                            onChange={ (ev) => { setNewPersonalData({ ...newPersonalData, cpf: ev.target.value }) } }
                            InputLabelProps={{
                                'shrink': true
                            }}
                            fullWidth
                            required
                        />
                    </Grid>

                    <Grid item xs={12} className={styles.formInput}>
                        <TextField
                            id="telefone"
                            name="telefone"
                            label="Telefone"
                            type='text'
                            variant="outlined"
                            size="small"
                            value={newPersonalData.telefone}
                            placeholder='(12) 9 1234-1234'
                            onChange={ (ev) => { setNewPersonalData({ ...newPersonalData, telefone: ev.target.value }) } }
                            InputLabelProps={{
                                'shrink': true
                            }}
                            fullWidth
                            required
                        />
                    </Grid>

                    <Grid item xs={12} className={styles.formInput}>
                        <TextField
                            id="descricao"
                            name="descricao"
                            label="Descrição"
                            type='text'
                            variant="outlined"
                            size="small"
                            value={newPersonalData.descricao}
                            placeholder='Digite algo sobre você :D'
                            onChange={ (ev) => { setNewPersonalData({ ...newPersonalData, descricao: ev.target.value }) } }
                            InputLabelProps={{
                                'shrink': true
                            }}
                            multiline
                            rows={3}
                            fullWidth
                        />
                    </Grid>

                </Grid>

            </DialogContent>

            <DialogActions >
                
                <Grid container justify='center'>
                    <Grid item>
                        <Button 
                            onClick={handleGoBackToVerify}
                            // disabled={activeStep === 0}
                            variant='contained'
                            color='primary'
                            size='small'
                            className={styles.formButton}
                        >
                            Verificar
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

UserAccPersonalDataDialog.propTypes = {
    openDialog: PropTypes.bool.isRequired,
    closeDialog: PropTypes.func.isRequired,
    userPersonalData: PropTypes.object.isRequired,
    setUserPersonalData: PropTypes.func.isRequired
}

// Exportações.
export default UserAccPersonalDataDialog;