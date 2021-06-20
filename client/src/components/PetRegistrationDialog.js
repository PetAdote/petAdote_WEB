// Importações.
import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// Utilidades.
import axios from '../helpers/axiosInstance';
// import { Link, useHistory } from 'react-router-dom';
import { makeStyles }
    from '@material-ui/core/styles';

import { useSnackbar } from 'notistack';

// Actions.
import { clearPets }
    from '../redux/actions';

// Componentes.
import { useTheme, useMediaQuery,
         Grid, Dialog, DialogTitle, DialogContent, DialogActions, List,
         ListItem, ListItemIcon, ListItemText, Divider, Typography, IconButton,
         TextField, Button, MenuItem, CircularProgress, Stepper, Step, StepLabel } 
    from '@material-ui/core';

import { Close, Visibility, VisibilityOff }
    from '@material-ui/icons';

// Inicializações.
const useStyles = makeStyles((theme) => {
    return {
        petRegistrationDialog: {
            width: '800px',
            backgroundColor: 'ghostwhite'
        },
        formInput: {
            padding: '8px 0'
        },
        formButton: {
            width: '100px',
            margin: '8px'
        },
        // Stepper
        stepperBox: {
            backgroundColor: 'rgba(0,0,0,0)',
            border: '1px solid darkgrey',
            borderRadius: '4px',
            padding: '8px 0 0 0',
            overflow: 'auto'
        },
        stepLabelBox: {
            "& .MuiStepLabel-label.MuiStepLabel-alternativeLabel": {
                marginTop: '4px'
            }
        },
        stepLabel: {
            wordBreak: 'break-all'
        },
        // endStepper
        
    }
});

const DataInputStep = (props) => {

    const { newPetData, setNewPetData,
        newPetPhotoAsUrl, setNewPetPhotoAsUrl,
        newPetPhotoFile, setNewPetPhotoFile } = props;

    const [photoSelectionError, setPhotoSelectionError] = useState(null);

    const styles = useStyles();
    const theme = useTheme();
    const isAtMinViewPort = useMediaQuery(theme.breakpoints.down('xs'));

    const especies = [
        { value: 'DEFAULT', label: 'Espécie' },
        { value: 'Gato', label: 'Felino(a)' },
        { value: 'Cao', label: 'Canino(a)' },
        { value: 'Outros', label: 'Outros' },
    ];

    const generos = [
        { value: 'DEFAULT', label: 'Gênero' },
        { value: 'F', label: 'Fêmea' },
        { value: 'M', label: 'Macho' },
    ]

    const portes = [
        { value: 'DEFAULT', label: 'Porte' },
        { value: 'P', label: 'Pequeno' },
        { value: 'M', label: 'Médio' },
        { value: 'G', label: 'Grande' },
    ]

    const estadosCastracao = [
        { value: 'DEFAULT', label: 'Castrado?' },
        { value: '1', label: 'Sim' },
        { value: '0', label: 'Não' },
    ]

    const estadosVacinacao = [
        { value: 'DEFAULT', label: 'Vacinado?' },
        { value: '1', label: 'Sim' },
        { value: '0', label: 'Não' },
    ]

    const estadosRga = [
        { value: 'DEFAULT', label: 'RGA?' },
        { value: '1', label: 'Sim' },
        { value: '0', label: 'Não' },
    ]

    useEffect(() => {
        if (newPetPhotoFile){
            const fileReader = new FileReader();
            fileReader.readAsDataURL(newPetPhotoFile);
            fileReader.onload = (event) => {
                setNewPetPhotoAsUrl(event.target.result);
            }
        } else {
            setNewPetPhotoAsUrl('');
            setPhotoSelectionError(null);
        }
    }, [newPetPhotoFile, setNewPetPhotoAsUrl]);

    const handlePhotoSelection = async (ev) => {
        const selectedFile = await ev.target.files[0];

        if (selectedFile && !selectedFile.type.includes('image/')){
            setPhotoSelectionError('Unsupported File');
            return;
        }

        if (selectedFile){
            if (photoSelectionError) {
                setPhotoSelectionError(null);
            }
            setNewPetPhotoFile(selectedFile);
            
        }
        ev.target.value = null;
    }

    return (
        <Grid container>

            <Grid item xs={12} sm={4} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '4px 0'}}>
                <Button size='small' onClick={() => { document.querySelector('input#petPhoto').click() }}
                    style={{
                        boxShadow: photoSelectionError ? '0px 0px 5px 0px red' : '0px 0px 5px 0px grey',
                        borderRadius: '4px',
                        minWidth: '150px',
                        maxWidth: '150px',
                        minHeight: '150px',
                        maxHeight: '150px',
                        backgroundImage: `url(${newPetPhotoAsUrl})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    { newPetPhotoAsUrl ? '' : <small>Clique para escolher a foto do pet</small> }
                </Button>
                <input type='file'
                    id='petPhoto'
                    name='petPhoto'
                    accept='image/*'
                    alt='Foto do pet'
                    onChange={(ev) => { handlePhotoSelection(ev) }}
                    hidden
                />
            </Grid>

            <Grid item xs={12} sm={8}>
                <Grid container>
                    <Grid item xs={12} className={styles.formInput}>
                        <TextField
                            id="nome"
                            name="nome"
                            label="Nome"
                            type='text'
                            variant="outlined"
                            size="small"
                            value={newPetData.nome}
                            onChange={ (ev) => { setNewPetData({ ...newPetData, nome: ev.target.value }) } }
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
                            id="dataNascimento"
                            name="dataNascimento"
                            label="Data de nascimento"
                            type='date'
                            variant="outlined"
                            size="small"
                            value={newPetData.dataNascimento}
                            onChange={ (ev) => { setNewPetData({ ...newPetData, dataNascimento: ev.target.value }) } }
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
                            id="raca"
                            name="raca"
                            label="Raça"
                            type='text'
                            variant="outlined"
                            size="small"
                            value={newPetData.raca}
                            placeholder='Comum, siamês, pinscher, etc...'
                            helperText='Máx. 20 caracteres'
                            FormHelperTextProps={{
                                style: {
                                    textAlign: 'right'
                                }
                            }}
                            onChange={ (ev) => { setNewPetData({ ...newPetData, raca: ev.target.value }) } }
                            InputLabelProps={{
                                'shrink': true
                            }}
                            fullWidth
                            required
                        />
                    </Grid>
                </Grid>
            </Grid>

            <Grid item xs={12}>
                <Grid container>

                    <Grid item xs={4} className={styles.formInput}
                        style={{ padding: '8px 2px' }}
                    >
                        <TextField
                            id="especie"
                            name="especie"
                            label="Espécie"
                            variant="outlined"
                            size="small"
                            value={newPetData.especie || 'DEFAULT'}
                            onChange={ (ev) => { setNewPetData({ ...newPetData, especie: ev.target.value === 'DEFAULT' ? '' : ev.target.value }) } }
                            InputLabelProps={{
                                shrink: true
                            }}
                            select
                            fullWidth
                            required
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

                    <Grid item xs={4} className={styles.formInput}
                        style={{ padding: '8px 2px' }}
                    >
                        <TextField
                            id="genero"
                            name="genero"
                            label="Gênero"
                            variant="outlined"
                            size="small"
                            value={newPetData.genero || 'DEFAULT'}
                            onChange={ (ev) => { setNewPetData({ ...newPetData, genero: ev.target.value === 'DEFAULT' ? '' : ev.target.value }) } }
                            InputLabelProps={{
                                shrink: true
                            }}
                            select
                            fullWidth
                            required
                        >
                            {
                                generos.map((option) => {
                                    return (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    )
                                })
                            }
                        </TextField>
                    </Grid>

                    <Grid item xs={4} className={styles.formInput}
                        style={{ padding: '8px 2px' }}
                    >
                        <TextField
                            id="porte"
                            name="porte"
                            label="Porte"
                            variant="outlined"
                            size="small"
                            value={newPetData.porte || 'DEFAULT'}
                            onChange={ (ev) => { setNewPetData({ ...newPetData, porte: ev.target.value === 'DEFAULT' ? '' : ev.target.value }) } }
                            InputLabelProps={{
                                shrink: true
                            }}
                            select
                            fullWidth
                            required
                        >
                            {
                                portes.map((option) => {
                                    return (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    )
                                })
                            }
                        </TextField>
                    </Grid>

                    <Grid item xs={4} className={styles.formInput}
                        style={{ padding: '8px 2px' }}
                    >
                        <TextField
                            id="estadoCastracao"
                            name="estadoCastracao"
                            label="Castrado?"
                            variant="outlined"
                            size="small"
                            value={newPetData.esta_castrado || 'DEFAULT'}
                            onChange={ (ev) => { setNewPetData({ ...newPetData, esta_castrado: ev.target.value === 'DEFAULT' ? '' : ev.target.value }) } }
                            InputLabelProps={{
                                shrink: true
                            }}
                            select
                            fullWidth
                            required
                        >
                            {
                                estadosCastracao.map((option) => {
                                    return (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    )
                                })
                            }
                        </TextField>
                    </Grid>

                    <Grid item xs={4} className={styles.formInput}
                        style={{ padding: '8px 2px' }}
                    >
                        <TextField
                            id="estadoVacinacao"
                            name="estadoVacinacao"
                            label="Vacinado?"
                            variant="outlined"
                            size="small"
                            value={newPetData.esta_vacinado || 'DEFAULT'}
                            onChange={ (ev) => { setNewPetData({ ...newPetData, esta_vacinado: ev.target.value === 'DEFAULT' ? '' : ev.target.value }) } }
                            InputLabelProps={{
                                shrink: true
                            }}
                            select
                            fullWidth
                            required
                        >
                            {
                                estadosVacinacao.map((option) => {
                                    return (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    )
                                })
                            }
                        </TextField>
                    </Grid>

                    <Grid item xs={4} className={styles.formInput}
                        style={{ padding: '8px 2px' }}
                    >
                        <TextField
                            id="estadoRga"
                            name="estadoRga"
                            label="RGA?"
                            variant="outlined"
                            size="small"
                            value={newPetData.possui_rga || 'DEFAULT'}
                            onChange={ (ev) => { setNewPetData({ ...newPetData, possui_rga: ev.target.value === 'DEFAULT' ? '' : ev.target.value }) } }
                            InputLabelProps={{
                                shrink: true
                            }}
                            select
                            fullWidth
                            required
                        >
                            {
                                estadosRga.map((option) => {
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
            </Grid>

            <Grid item xs={12} className={styles.formInput}>
                <TextField
                    id="comportamento"
                    name="comportamento"
                    label="Comportamento"
                    type='text'
                    variant="outlined"
                    size="small"
                    value={newPetData.detalhesComportamento}
                    placeholder='Descreva como o pet se comporta normalmente.'
                    onChange={ (ev) => { setNewPetData({ ...newPetData, detalhesComportamento: ev.target.value }) } }
                    InputLabelProps={{
                        'shrink': true
                    }}
                    fullWidth
                    multiline
                    rows={2}
                    required
                />
            </Grid>

            <Grid item xs={12} className={styles.formInput}>
                <TextField
                    id="saude"
                    name="saude"
                    label="Saúde"
                    type='text'
                    variant="outlined"
                    size="small"
                    value={newPetData.detalhesSaude}
                    placeholder='Descreva o estado de saúde do pet, por exemplo: Quais vacinas o pet tomou? O pet precisa de cuidados especiais? Etc.'
                    onChange={ (ev) => { setNewPetData({ ...newPetData, detalhesSaude: ev.target.value }) } }
                    InputLabelProps={{
                        'shrink': true
                    }}
                    fullWidth
                    multiline
                    rows={2}
                    required
                />
            </Grid>

            <Grid item xs={12} className={styles.formInput}>
                <TextField
                    id="historia"
                    name="historia"
                    label="História"
                    type='text'
                    variant="outlined"
                    size="small"
                    value={newPetData.historia}
                    placeholder='Conte-nos mais sobre o pet.'
                    onChange={ (ev) => { setNewPetData({ ...newPetData, historia: ev.target.value }) } }
                    InputLabelProps={{
                        'shrink': true
                    }}
                    fullWidth
                    multiline
                    rows={2}
                    required
                />
            </Grid>

            {/* <Grid item xs={12} style={{ padding: '4px 8px' }}>
                <Typography component='p' variant='caption'>
                    ⚠️ <b>Atenção:</b> Ao <b>salvar</b> sua senha será alterada imediatamente. Utilize a nova senha na sua próxima autenticação.
                </Typography>
            </Grid> */}

        </Grid>
    )

}

const DataVerificationStep = (props) => {

    const { newPetData, newPetPhotoAsUrl } = props;

    return (
        <Grid container>

            <Grid item xs={12} sm={4} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '4px 0'}}>
                <div
                    style={{
                        boxShadow: '0px 0px 5px 0px grey',
                        borderRadius: '4px',
                        minWidth: '150px',
                        maxWidth: '150px',
                        minHeight: '150px',
                        maxHeight: '150px',
                        backgroundImage: `url(${newPetPhotoAsUrl})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                </div>
            </Grid>

            <Grid item xs={12} sm={8}>
                <Grid container>
                    <Grid item xs={12}>
                        <Typography>
                            <b>Nome: </b>{newPetData.nome}
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography>
                            <b>Data de Nascimento: </b>
                            {
                                newPetData.dataNascimento ?
                                    `${String(newPetData.dataNascimento).split('-')[2]}/${String(newPetData.dataNascimento).split('-')[1]}/${String(newPetData.dataNascimento).split('-')[0]}`
                                : null
                            }
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography>
                            <b>Raça: </b>{newPetData.raca}
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography>
                            <b>Espécie: </b>
                            {
                                newPetData.especie === "Cao" ? "Cão" : newPetData.especie
                            }
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography>
                            <b>Gênero: </b>
                            {
                                newPetData.genero === 'M' ? 
                                    'Macho'
                                : newPetData.genero === 'F' ? 
                                    'Fêmea'
                                : null
                            }
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography>
                            <b>Porte: </b>
                            {
                                newPetData.porte === 'P' ?
                                    'Pequeno'
                                : newPetData.porte === 'M' ?
                                    'Médio'
                                : newPetData.porte === 'G' ?
                                    'Grande'
                                : null
                            }
                        </Typography>
                    </Grid>

                </Grid>
            </Grid>

            <Grid item xs={12}>
                <Divider />
            </Grid>

            <Grid item xs={12}>
                <Grid container style={{ padding: '8px' }}>

                    <Grid item xs={6} sm={4}>
                        <Typography>
                            <b>Castrado(a)? </b>
                            {
                                String(newPetData.esta_castrado) === '1' ? 
                                    'Sim'
                                : String(newPetData.esta_castrado) === '0' ?
                                    'Não'
                                : null
                            }
                        </Typography>
                    </Grid>

                    <Grid item xs={6} sm={4}>
                        <Typography>
                            <b>Vacinado(a)? </b>
                            {
                                String(newPetData.esta_vacinado) === '1' ?
                                    'Sim'
                                : String(newPetData.esta_vacinado) === '0' ?
                                    'Não'
                                : null
                            }
                        </Typography>
                    </Grid>

                    <Grid item xs={6} sm={4}>
                        <Typography>
                            <b>Possui RGA? </b>
                            {
                                String(newPetData.possui_rga) === '1' ?
                                    'Sim'
                                : String(newPetData.possui_rga) === '0' ?
                                    'Não'
                                : null
                            }
                        </Typography>
                    </Grid>

                </Grid>
            </Grid>
            
            <Grid item xs={12}>
                <Divider />
            </Grid>

            <Grid item xs={12} style={{ padding: '8px'}}>
                <Typography>
                    <b>Detalhes de Comportamento</b>
                </Typography>
                <Typography>
                    {newPetData.detalhesComportamento}
                </Typography>
            </Grid>

            <Grid item xs={12}>
                <Divider />
            </Grid>

            <Grid item xs={12} style={{ padding: '8px'}}>
                <Typography>
                    <b>Detalhes de Saúde</b>
                </Typography>
                <Typography>
                    {newPetData.detalhesSaude}
                </Typography>
            </Grid>

            <Grid item xs={12}>
                <Divider />
            </Grid>

            <Grid item xs={12} style={{ padding: '8px'}}>
                <Typography>
                    <b>História</b>
                </Typography>
                <Typography>
                    {newPetData.historia}
                </Typography>
            </Grid>

        </Grid>
    )
}

// Functional Component.
const PetRegistrationDialog = (props) => {

    const { openDialog, closeDialog, clearPets } = props;
    const { user } = props.userData;

    const styles = useStyles();
    const theme = useTheme();
    const { enqueueSnackbar } = useSnackbar();

    const mobileStyleForButtons = {
        minWidth: '100%',
        margin: '8px 0'
    }

    const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
    const isAtMinViewPort = useMediaQuery(theme.breakpoints.down('xs'));

    const initialNewPetData = {
        nome: '',
        dataNascimento: '',
        especie: '',
        raca: '',
        genero: '',
        porte: '',
        esta_castrado: '',
        esta_vacinado: '',
        possui_rga: '',
        detalhesComportamento: '',
        detalhesSaude: '',
        historia: ''
    };

    const [newPetData, setNewPetData] = useState(initialNewPetData);

    const [newPetPhotoAsUrl, setNewPetPhotoAsUrl] = useState('');
    const [newPetPhotoFile, setNewPetPhotoFile] = useState(null);

    const [activeStep, setActiveStep] = useState(0);
    // const [errorData, setErrorData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleClose = (newDecision) => {
        if (newDecision) {
            closeDialog(newDecision);
        }

        closeDialog();
    }

    const handleEntering = () => {
        // Se for necessário executar algo quando o dialog aparece, faça aqui.
        if (!user){
            return handleClose();
        }

        setActiveStep(0);
    }

    const handleClear = () => {
        setNewPetData(initialNewPetData);
        setNewPetPhotoAsUrl('');
        setNewPetPhotoFile(null);
        // setErrorData([]);
    }

    const handleGoBackAndClear = (newDecision) => {
        setNewPetData(initialNewPetData);
        setNewPetPhotoAsUrl('');
        setNewPetPhotoFile(null);
        // setErrorData([]);
        handleClose(newDecision);
    }

    // Configs do Stepper Component.
    const getSteps = () => {
        return [
            'Pet',
            'Conclusão'
        ]
    }

    const getStepContent = (stepIndex) => {
        switch (stepIndex) {
            case 0:
                return <DataInputStep
                            newPetData={newPetData}
                            setNewPetData={setNewPetData}
                            newPetPhotoAsUrl={newPetPhotoAsUrl}
                            setNewPetPhotoAsUrl={setNewPetPhotoAsUrl}
                            newPetPhotoFile={newPetPhotoFile}
                            setNewPetPhotoFile={setNewPetPhotoFile}
                        />
            case 1:
                return <DataVerificationStep 
                            newPetData={newPetData}
                            newPetPhotoAsUrl={newPetPhotoAsUrl}
                        />
            default:
                return 'Ops algo deu errado'
        }
    }

    const getStepTitle = (stepIndex) => {
        switch (stepIndex) {
            case 0:
                return 'Pet'
            case 1:
                return 'Conclusão'
            default:
                return 'Ops algo deu errado'
        }
    }

    const steps = getSteps();
    // Fim das configs do Stepper Component.

    const handleNext = () => {
        setActiveStep((prevActiveStep) => { return prevActiveStep + 1 });
    }

    const handleBack = () => {
        setActiveStep((prevActiveStep) => { return prevActiveStep - 1 });
    }

    const handleResetStep = (activeStep) => {
        switch(activeStep){
            case 0:
                setNewPetPhotoFile(null);
                setNewPetPhotoAsUrl('');
                setNewPetData({ ...newPetData, initialNewPetData})
                return;
            default: return;
        }
    }

    const handleReset = () => {
        setActiveStep(0);
    }

    const handlePetRegistration = () => {

        setIsLoading(true);
        handleNext();

        axios.post(`/usuarios/animais/`, {
            nome: newPetData.nome,
            data_nascimento: newPetData.dataNascimento,
            especie: newPetData.especie,
            raca: newPetData.raca,
            genero: newPetData.genero,
            porte: newPetData.porte,
            esta_castrado: newPetData.esta_castrado,
            esta_vacinado: newPetData.esta_vacinado,
            possui_rga: newPetData.possui_rga,
            detalhes_comportamento: newPetData.detalhesComportamento,
            detalhes_saude: newPetData.detalhesSaude,
            historia: newPetData.historia
        })
        .then( async (response) => {

            console.log('[PetRegistrationDialog.js/atRegistration]:', response.data);

            if (response.data?.animal){

                const cod_animal = response.data.animal.cod_animal;

                if (newPetPhotoFile){

                    const photoFormData = new FormData();
                    photoFormData.append("foto", newPetPhotoFile);

                    await axios.patch(`/usuarios/animais/${cod_animal}`, photoFormData, {
                        headers: {
                            'Content-Type': undefined
                        }
                    })
                    .then((response) => {
                        console.log('[PetRegistrationDialog.js/atUpdatePetPhoto]:', response.data);
                        
                        setNewPetPhotoFile(null);
                        setNewPetPhotoAsUrl('');
                    })
                    .catch((error) => {

                        console.log('[PetRegistrationDialog.js/atUpdatePetPhoto] unexpected error:', error?.response?.data || error?.message);

                        const errorMsg = error.response?.data?.error?.mensagem || error.response?.data?.mensagem || 'Falha ao atualizar o avatar.';

                        setNewPetPhotoFile(null);
                        setNewPetPhotoAsUrl('');
                        setActiveStep(0);

                        enqueueSnackbar(errorMsg, { variant: 'warning' });

                    });

                }

            } else {

                handleReset();
                return enqueueSnackbar('Algo inesperado aconteceu, por favor, revise os dados.', { variant: 'warning' });

            }

            setIsLoading(false);
            enqueueSnackbar('Cadastro do pet realizado com sucesso!', { variant: 'success' });
            clearPets();
            handleGoBackAndClear('NEW_PET_ADDED');

        })
        .catch((error) => {

            console.log('[PetRegistrationDialog.js/atPetRegistration] unexpected error:', error?.response?.data || error?.message);

            const errorMsg = error.response?.data?.error?.mensagem || error.response?.data?.mensagem || 'Falha ao atualizar o avatar.';

            handleReset();
            enqueueSnackbar(errorMsg, { variant: 'warning' });
            setIsLoading(false);

        });





        // console.log('[PetRegistrationDialog.js/petRegistration] Pet data:', newPetData);
        // console.log('[PetRegistrationDialog.js/petRegistration] Pet photo file:', newPetPhotoFile);
        // setIsLoading(true);
        // setActiveStep((prevActiveStep) => { return prevActiveStep + 1 });

        // setTimeout(() => {
        //     setIsLoading(false);
        //     setNewPetData(initialNewPetData);
        //     handleGoBackAndClear();
        //     console.log('[UserRegistrationContainer.js/petRegistration]: Pet cadastrado com sucesso');
        // }, 2000);
    }

    








    return (
        <Dialog
            open={openDialog}
            // onClose={
            //     () => {
            //         handleGoBackAndClear();
            //     }
            // }
            onEntering={handleEntering}
            // disableScrollLock={true}
            maxWidth="sm"
            fullScreen={isAtMinViewPort}
            scroll='body'
            aria-labelledby="address-data-dialog"
            classes={{
                paper: styles.petRegistrationDialog
            }}
            disableBackdropClick
            disableEscapeKeyDown
        >

            <DialogTitle style={{ padding: '8px' }} id="address-data-dialog">
                <Grid container justify='space-between' alignItems='center'>

                    <Grid item xs={12} sm={9} style={{ margin: '0 auto'}}>
                        <Grid container>
                            <Grid item xs={12} style={{ overflow: 'auto', whiteSpace: 'nowrap' }}>
                                <Typography component='h1' variant='h6' align='center'>
                                    {
                                        activeStep === steps.length ?
                                            isLoading ? 'Concluindo cadastro...' : 'Cadastro concluído!'
                                        :
                                            getStepTitle(activeStep)
                                    }
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* <Grid item xs={1}>
                        <IconButton size='small' onClick={() => { handleGoBackAndClear() }} >
                            <Close style={{ padding: '4px' }} />
                        </IconButton>
                    </Grid> */}

                </Grid>
            </DialogTitle>

            <DialogContent style={{ padding: '8px' }} dividers>

                {
                    activeStep === steps.length ?
                        isLoading ?
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <CircularProgress  />
                            </div>
                        :
                            null
                            // <Typography component='p' align='center'><b>Você será redirecionado em breve!</b></Typography>
                    : 
                        getStepContent(activeStep)
                }

                {/* <Grid container>

                    <Grid item xs={12} style={{ padding: '4px 8px' }}>
                        <Typography component='p' variant='caption'>
                            ⚠️ <b>Atenção:</b> Ao <b>salvar</b> sua senha será alterada imediatamente. Utilize a nova senha na sua próxima autenticação.
                        </Typography>
                    </Grid>

                </Grid> */}

            </DialogContent>

            <DialogContent style={{ padding: '8px', borderBottom: '1px solid lightgrey' }}>

                <Stepper 
                    activeStep={activeStep}
                    alternativeLabel
                    classes={{ root: styles.stepperBox }}
                >
                    {
                        steps.map((label) => {
                            return (
                                <Step key={label} className={styles.stepLabelBox}>
                                    <StepLabel className={styles.stepLabel}>{label}</StepLabel>
                                </Step>
                            )
                        })
                    }
                </Stepper>

            </DialogContent>

            { 
                activeStep === steps.length ?
                    null
                : 
                    <DialogActions >
                        
                        <Grid container justify='center'>
                            <Grid item xs={ isAtMinViewPort ? 12 : false } style={{ textAlign:  isAtMinViewPort ? 'center' : 'start' }}>
                                <Button 
                                    onClick={
                                        activeStep === 0 ?
                                            () => { handleGoBackAndClear() }
                                        :
                                            handleBack
                                    }
                                    // disabled={activeStep === 0}
                                    variant='contained'
                                    color='primary'
                                    size='small'
                                    className={styles.formButton}
                                    style={ isAtMinViewPort ? mobileStyleForButtons : {} }
                                >
                                    { activeStep === 0 ? 'Cancelar' : 'Voltar' }
                                </Button>
                            </Grid>

                            {
                                activeStep < steps.length - 1 ?
                                    <Grid item xs={ isAtMinViewPort ? 12 : false } style={{ textAlign:  isAtMinViewPort ? 'center' : 'start' }}>
                                        <Button 
                                            onClick={handleClear}
                                            // disabled={activeStep === 0}
                                            variant='contained'
                                            color='primary'
                                            size='small'
                                            className={styles.formButton}
                                            style={ isAtMinViewPort ? mobileStyleForButtons : {} }
                                        >
                                            Limpar
                                        </Button>
                                    </Grid>
                                : null
                            }

                            <Grid item xs={ isAtMinViewPort ? 12 : false } style={{ textAlign:  isAtMinViewPort ? 'center' : 'start' }}>
                                <Button 
                                    onClick={
                                        activeStep === steps.length - 1 ?
                                            handlePetRegistration
                                        :
                                            handleNext
                                    }
                                    // disabled={activeStep === 0}
                                    variant='contained'
                                    color='primary'
                                    size='small'
                                    className={styles.formButton}
                                    style={ isAtMinViewPort ? mobileStyleForButtons : {} }
                                >
                                    { activeStep === steps.length - 1 ? 'Cadastrar' : 'Avançar' }
                                </Button>
                            </Grid>

                        </Grid>

                    </DialogActions>
            }
            
        </Dialog>
    );
    
}

PetRegistrationDialog.propTypes = {
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
        clearPets: () => { return dispatch( clearPets() ) },
        // openSnackbar: (message, severity) => { return dispatch( openSnackbar(message, severity) ) }
        // fetchAnnouncements: (page, limit) => { return dispatch( fetchAnnouncements(page, limit) ) },
        // fetchUser: () => { return dispatch ( fetchUser() ) },
    }
}

// Exportações.
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PetRegistrationDialog);