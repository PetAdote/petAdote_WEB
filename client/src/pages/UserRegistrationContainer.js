// Importações.
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

// Utilidades.
import axios from '../helpers/axiosInstance';

// Actions.
import { fetchUser, openSnackbar }
    from '../redux/actions';

// Components.
import { makeStyles,
    Grid, TextField, MenuItem, FormControlLabel, Checkbox, 
    Stepper, Step, StepLabel, Button, IconButton, CircularProgress, 
    Typography } 
    from '@material-ui/core';

import { Visibility, VisibilityOff }
    from '@material-ui/icons';

// Inicializações.
const useStyles = makeStyles((theme) => {
    return {

        mainContainer: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        },
        formContainer: {
            backgroundColor: 'rgba(255, 255, 255, 0.75)',
            padding: '20px',
            margin: '16px 0',
            border: '1px solid black',
            borderRadius: '10px',
        },
        form: {
            display: 'flex',
            // flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%'
        },
        formInput: {
            padding: '8px 0'
        },
        link: {
            textDecoration: 'none',
            color: '#2b78e4',
            "&:hover": {
                color: '#085394'
            }
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
        }
        // endStepper

    }

});

const FormAccountStep = (props) => {

    const { newUserData, setNewUserData, errorData, setErrorData } = props;
    const [showPassword, setShowPassword] = useState(false);

    const styles = useStyles();

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    }

    return (
        <Grid container component='form' justify='center' className={styles.form}>

            <Grid item xs={12} className={styles.formInput}>
                <TextField
                    id="email"
                    name="email"
                    label="E-mail"
                    type='email'
                    variant="outlined"
                    size="small"
                    value={newUserData.email}
                    placeholder='e-mail@dominio.com'
                    onChange={ (ev) => { 
                        errorData?.some((item) => {     // Exemplo do sistema de validação front-end.
                            if (item.field === 'email') {
                                return setErrorData(errorData.filter((item) => item.field !== 'email'))
                            }
                            return false
                        });
                        setNewUserData({ ...newUserData, email: ev.target.value });
                    } }
                    InputLabelProps={{
                        shrink: true
                    }}
                    fullWidth
                    required
                    autoFocus
                    autoComplete='email'

                    error={
                        errorData?.some((item) => item.field === 'email' ? true : false)
                    }
                    helperText={
                        errorData?.find((item) => item.field === 'email')?.message
                    }
                />
            </Grid>

            <Grid item xs={12} className={styles.formInput}>
                <TextField
                    id="password"
                    name="password"
                    label="Senha"
                    type={showPassword ? 'text' : 'password'}
                    variant="outlined"
                    size="small"
                    value={newUserData.password}
                    onChange={ (ev) => { setNewUserData({ ...newUserData, password: ev.target.value }) } }
                    InputLabelProps={{
                        shrink: true
                    }}
                    InputProps={{
                        endAdornment:
                            <IconButton onClick={handleClickShowPassword} tabIndex='-1' >
                                {showPassword ? <Visibility /> : <VisibilityOff /> }
                            </IconButton>
                    }}
                    fullWidth
                    required
                />
            </Grid>

            <Grid item xs={12} className={styles.formInput}>
                <TextField
                    id="passwordConfirm"
                    name="passwordConfirm"
                    label="Confirme sua senha"
                    type={showPassword ? 'text' : 'password'}
                    variant="outlined"
                    size="small"
                    value={newUserData.passwordConfirm}
                    onChange={ (ev) => { setNewUserData({ ...newUserData, passwordConfirm: ev.target.value }) } }
                    InputLabelProps={{
                        shrink: true
                    }}
                    InputProps={{
                        endAdornment: 
                            <IconButton onClick={handleClickShowPassword} tabIndex='-1' >
                                {showPassword ? <Visibility /> : <VisibilityOff /> }
                            </IconButton>
                    }}
                    fullWidth
                    required
                />
            </Grid>

        </Grid>
    )
}

const FormProfileStep = (props) => {

    const { newUserData, setNewUserData } = props;
    const styles = useStyles();

    const [error, setError] = useState(null);
    const [avatarAsUrl, setAvatarAsUrl] = useState('');

    useEffect(() => {

        if (newUserData.avatar){
            const fileReader = new FileReader();
            fileReader.readAsDataURL(newUserData.avatar);
            fileReader.onload = (event) => {
                setAvatarAsUrl(event.target.result);
            }
        } else {
            setAvatarAsUrl('');
            setError(null);
        }

    }, [newUserData]);

    const handleAvatarSelection = async (ev) => {
        const selectedFile = await ev.target.files[0];

        if (selectedFile && !selectedFile.type.includes('image/')){
            setError('Unsupported File');
            return;
        }

        if (selectedFile){
            if (error) {
                setError(null);
            }
            setNewUserData({ ...newUserData, avatar: selectedFile });
            
        }

        ev.target.value = null;

    }


    return (
        <Grid container component='form' justify='center' className={styles.form}>

            <Grid item xs={12}>
                <Grid container>

                    <Grid item xs={12} sm={3} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '4px 0'}}>
                        <IconButton size='small'>
                            <label htmlFor='avatar' style={{ 
                                boxShadow: error ? '0px 0px 5px 0px red' : '0px 0px 5px 0px grey',
                                borderRadius: '50%',
                                minWidth: '90px',
                                maxWidth: '90px',
                                minHeight: '90px',
                                maxHeight: '90px',
                                backgroundImage: `url(${avatarAsUrl})`,
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: 'cover',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                { avatarAsUrl ? '' : <small>Clique para escolher seu avatar</small> }
                            </label>
                        </IconButton>
                        <input type='file'
                            id='avatar'
                            name='avatar'
                            accept='image/*'
                            alt='User avatar'
                            onChange={(ev) => { handleAvatarSelection(ev) }}
                            hidden
                        />
                    </Grid>

                    <Grid item xs={12} sm={9}>
                        <Grid container>
                            <Grid item xs={12} className={styles.formInput}>
                                <TextField
                                    id="nome"
                                    name="nome"
                                    label="Primeiro nome"
                                    type='text'
                                    variant="outlined"
                                    size="small"
                                    value={newUserData.nome}
                                    onChange={ (ev) => { setNewUserData({ ...newUserData, nome: ev.target.value }) } }
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
                                    value={newUserData.sobrenome}
                                    onChange={ (ev) => { setNewUserData({ ...newUserData, sobrenome: ev.target.value }) } }
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    fullWidth
                                    required
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12} className={styles.formInput}>
                        <TextField
                            id="dataNascimento"
                            name="dataNascimento"
                            label="Data de nascimento"
                            type='date'
                            variant="outlined"
                            size="small"
                            value={newUserData.dataNascimento}
                            onChange={ (ev) => { setNewUserData({ ...newUserData, dataNascimento: ev.target.value }) } }
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
                            value={newUserData.cpf}
                            placeholder='123.123.123-12'
                            onChange={ (ev) => { setNewUserData({ ...newUserData, cpf: ev.target.value }) } }
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
                            value={newUserData.telefone}
                            placeholder='(12) 9 1234-1234'
                            onChange={ (ev) => { setNewUserData({ ...newUserData, telefone: ev.target.value }) } }
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
                            value={newUserData.descricao}
                            placeholder='Digite algo sobre você :D'
                            onChange={ (ev) => { setNewUserData({ ...newUserData, descricao: ev.target.value }) } }
                            InputLabelProps={{
                                'shrink': true
                            }}
                            multiline
                            rows={3}
                            fullWidth
                        />
                    </Grid>

                </Grid>
            </Grid>

        </Grid>
    )
}

const FormAddressStep = (props) => {

    const { newUserData, setNewUserData } = props;
    const styles = useStyles();

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
    ]

    return (
        <Grid container component='form' justify='center' className={styles.form}>

            <Grid item xs={6} className={styles.formInput}>
                <TextField
                    id="cep"
                    name="cep"
                    label="CEP"
                    type='text'
                    variant="outlined"
                    size="small"
                    value={newUserData.cep}
                    placeholder='12345-123'
                    onChange={ (ev) => { setNewUserData({ ...newUserData, cep: ev.target.value }) } }
                    InputLabelProps={{
                        shrink: true
                    }}
                    fullWidth
                    required
                    autoFocus
                />
            </Grid>

            <Grid item xs={5} className={styles.formInput}>
                <TextField
                    id="numero"
                    name="numero"
                    label="Numero"
                    type='text'
                    variant="outlined"
                    size="small"
                    value={newUserData.numero}
                    placeholder='123'
                    onChange={ (ev) => { setNewUserData({ ...newUserData, numero: ev.target.value }) } }
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
                    value={newUserData.uf || 'DEFAULT'}
                    onChange={ (ev) => { setNewUserData({ ...newUserData, uf: ev.target.value }) } }
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
                    value={newUserData.cidade}
                    placeholder='Digite o nome da sua cidade'
                    onChange={ (ev) => { setNewUserData({ ...newUserData, cidade: ev.target.value }) } }
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
                    value={newUserData.bairro}
                    placeholder='Digite o nome do seu bairro'
                    onChange={ (ev) => { setNewUserData({ ...newUserData, bairro: ev.target.value }) } }
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
                    value={newUserData.logradouro}
                    placeholder='Digite o seu logradouro'
                    onChange={ (ev) => { setNewUserData({ ...newUserData, logradouro: ev.target.value }) } }
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
                    value={newUserData.complemento}
                    placeholder='Se necessário, digite o complemento'
                    onChange={ (ev) => { setNewUserData({ ...newUserData, complemento: ev.target.value }) } }
                    InputLabelProps={{
                        shrink: true
                    }}
                    fullWidth
                />
            </Grid>

        </Grid>
    )
}

const FormConclusionStep = (props) => {

    const { newUserData, setNewUserData } = props;
    const [avatarAsUrl, setAvatarAsUrl] = useState(null);

    const styles = useStyles();

    useEffect(() => {

        if (newUserData.avatar){
            const fileReader = new FileReader();
            fileReader.readAsDataURL(newUserData.avatar);
            fileReader.onload = (event) => {
                setAvatarAsUrl(event.target.result);
            }
        } else {
            setAvatarAsUrl('');
        }

    }, [newUserData]);

    const handleUserAgreementAcceptance = () => {
        setNewUserData({ ...newUserData, aceitou: !newUserData.aceitou })
    }

    return (
        <Grid container justify='center' className={styles.form}>

            <Grid item xs={12} style={{ overflow: 'auto', border: '1px solid darkgrey', borderRadius: '4px', width: '100%', minHeight: '100px', maxHeight: '100px', margin: '4px 0', padding: '8px', backgroundColor: 'gainsboro' }}>
                <Grid container>

                    <Grid item xs={12}>
                        <Typography component='h1' variant='h5' align='center' style={{ fontWeight: '500' }}>Verifique seus dados</Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography component='h2' variant='h6' align='center' style={{ fontWeight: '500' }}>Sobre você</Typography>
                    </Grid>

                    {
                        avatarAsUrl ?
                            <Grid item xs={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '8px 0' }}>
                                <div style={{ 
                                    boxShadow: '0px 0px 5px 0px grey',
                                    borderRadius: '50%',
                                    minWidth: '90px',
                                    maxWidth: '90px',
                                    minHeight: '90px',
                                    maxHeight: '90px',
                                    backgroundImage: `url(${avatarAsUrl})`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundSize: 'cover',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}/>
                            </Grid>
                        : null
                    }

                    <Grid item xs={12} style={{ margin: '8px 0' }}>
                        <Typography component='p' align='left'><b>E-mail: </b>{newUserData.email}</Typography>
                        <Typography component='p' align='left'><b>Nome: </b>{newUserData.nome} {newUserData.sobrenome}</Typography>
                        <Typography component='p' align='left'><b>Data de Nascimento: </b>
                            {newUserData.dataNascimento?.split('-')[2]}/{newUserData.dataNascimento?.split('-')[1]}/{newUserData.dataNascimento?.split('-')[0]}
                        </Typography>
                        <Typography component='p' align='left'><b>CPF: </b>{newUserData.cpf}</Typography>
                        <Typography component='p' align='left'><b>Telefone: </b>{newUserData.telefone}</Typography>
                        <Typography component='p' align='left'><b>Descrição: </b>{newUserData.descricao}</Typography>

                        <Typography component='h2' variant='h6' align='center' style={{ fontWeight: '500' }}>Seu endereço</Typography>
                        <Typography component='p' align='left'><b>CEP: </b>{newUserData.cep}</Typography>
                        <Typography component='p' align='left'><b>Logradouro: </b>{newUserData.logradouro}</Typography>
                        <Typography component='p' align='left'><b>Bairro: </b>{newUserData.bairro}</Typography>
                        <Typography component='p' align='left'><b>Cidade: </b>{newUserData.cidade}</Typography>
                        <Typography component='p' align='left'><b>UF: </b>{newUserData.uf}</Typography>
                        <Typography component='p' align='left'><b>Número: </b>{newUserData.numero}</Typography>
                        <Typography component='p' align='left'><b>Complemento: </b>{newUserData.complemento}</Typography>
                    </Grid>

                </Grid>
            </Grid>

            <Grid item xs={12} style={{ overflow: 'auto', border: '1px solid darkgrey', borderRadius: '4px', width: '100%', minHeight: '200px', maxHeight: '200px', margin: '4px 0', padding: '8px', backgroundColor: 'gainsboro' }}>
                <Typography component='h1' variant='h5' align='center' style={{ fontWeight: '500' }}>Termos de Uso</Typography>

                <Typography component='p' align='left'>Os termos de uso estarão aqui.</Typography>

            </Grid>

            <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                <FormControlLabel 
                    // value={newUserData.aceitou}
                    control={
                        <Checkbox 
                            checked={newUserData.aceitou}
                            color='primary'
                            onChange={(ev) => { handleUserAgreementAcceptance() }}
                        />
                    }
                    label="Li e estou de acordo com os termos de uso."
                    labelPlacement='end'
                    // onClick={handleUserAgreementAcceptance}
                />
            </Grid>

        </Grid>
    )
}

// Functional Component.
const UserRegistration = (props) => {

    const { user } = props.userData;
    const { fetchUser, openSnackbar } = props;

    const history = useHistory();
    const styles = useStyles();

    const initialUserData = {
        // Conta
        email: '',
        password: '',
        passwordConfirm: '',
        // Perfil
        avatar: null,
        nome: '',
        sobrenome: '',
        dataNascimento: '',
        cpf: '',
        telefone: '',
        descricao: '',
        // Endereço
        cep: '',
        logradouro: '',
        bairro: '',
        cidade: '',
        uf: '',
        numero: '',
        complemento: '',
        // Termos de uso
        aceitou: false
    }

    const [activeStep, setActiveStep] = useState(0);
    const [newUserData, setNewUserData] = useState(initialUserData);
    const [errorData, setErrorData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {

        if (user?.cod_usuario){
            history.push('/');
        }

    });

    // useEffect(() => {
    //     console.log(errorData);
    // }, [errorData]);

    // Configs do Stepper Component.
    const getSteps = () => {
        return [
            'Conta',
            'Perfil',
            'Endereço',
            'Conclusão'
        ]
    }

    const getStepContent = (stepIndex) => {

        switch (stepIndex) {
            case 0:
                return <FormAccountStep newUserData={newUserData} setNewUserData={setNewUserData} errorData={errorData} setErrorData={setErrorData}/>
            case 1:
                return <FormProfileStep newUserData={newUserData} setNewUserData={setNewUserData} errorData={errorData} setErrorData={setErrorData}/>
            case 2:
                return <FormAddressStep newUserData={newUserData} setNewUserData={setNewUserData} errorData={errorData} setErrorData={setErrorData}/>
            case 3:
                return <FormConclusionStep newUserData={newUserData} setNewUserData={setNewUserData} errorData={errorData} setErrorData={setErrorData}/>
            default:
                return 'Ops algo deu errado'
        }
    }

    const getStepTitle = (stepIndex) => {
        switch (stepIndex) {
            case 0:
                return 'Conta'
            case 1:
                return 'Perfil'
            case 2:
                return 'Endereço'
            case 3:
                return 'Conclusão'
            default:
                return 'Ops algo deu errado'
        }
    }

    const steps = getSteps();
    // Fim das configs do Stepper.

    const handleNext = () => {

        // Exemplo de validações front-end dos campos. Ver continuação no TextField do campo.
        // * Não estão completas, existem apenas como demonstrativo neste momento.

        switch(activeStep){
            case 0:

                const emailError = errorData?.filter((item) => { return item.field === 'email' });  // Retorna um Array contendo o item encontrado.

                // Início da verificação de conteúdo do e-mail.
                if (newUserData.email.length === 0 || newUserData.email.length > 255){
                    if (emailError.length === 0) { 
                        return setErrorData(
                            errorData.concat(
                                { field: 'email', message: 'O campo está vazio ou possui mais que 255 caracteres.'}
                            )
                        );
                    }
                    if (emailError.length === 1) { 
                        return setErrorData(
                            errorData.map((item) => { 
                                return item.field === 'email' ?
                                    { field: 'email', message: 'O campo está vazio ou possui mais que 255 caracteres.' }
                                : item 
                            })
                        );
                    }
                }
                // Fim da verificação de conteúdo do e-mail.

                // Início da validação básica do e-mail.
                if (!newUserData.email.match(/^([\w\d-+.]{1,64})(@[\w\d-]+)((?:\.\w+)+)$/g)){
                    if (emailError.length === 0) { 
                        return setErrorData(
                            errorData.concat(
                                { field: 'email', message: 'Verifique se o e-mail está correto.'}
                            )
                        );
                    }
                    if (emailError.length === 1) { 
                        return setErrorData(
                            errorData.map((item) => { 
                                return item.field === 'email' ?
                                    { field: 'email', message: 'Verifique se o e-mail está correto.' }
                                : item 
                            })
                        );
                    }
                }
                // Fim da validação básica do e-mail.
                break;
            case 1:
                break;
            case 2:
                break;

            default: 
                break;
        }

        setActiveStep((prevActiveStep) => { return prevActiveStep + 1 })
    }

    const handleBack = () => {
        setActiveStep((prevActiveStep) => { return prevActiveStep - 1 })
    }

    const handleResetStep = (activeStep) => {
        switch(activeStep){
            case 0:
                return setNewUserData({ 
                    ...newUserData,
                    email: initialUserData.email,
                    password: initialUserData.password,
                    passwordConfirm: initialUserData.passwordConfirm
                });
            case 1:
                return setNewUserData({ 
                    ...newUserData,
                    avatar: initialUserData.avatar,
                    nome: initialUserData.nome,
                    sobrenome: initialUserData.sobrenome,
                    dataNascimento: initialUserData.dataNascimento,
                    cpf: initialUserData.cpf,
                    telefone: initialUserData.telefone,
                    descricao: initialUserData.descricao,
                });
            case 2:
                return setNewUserData({ 
                    ...newUserData,
                    cep: initialUserData.cep,
                    logradouro: initialUserData.logradouro,
                    bairro: initialUserData.bairro,
                    cidade: initialUserData.cidade,
                    uf: initialUserData.uf,
                    numero: initialUserData.numero,
                    complemento: initialUserData.complemento
                });
            default: return;
        }
    }

    const handleReset = () => {
        setActiveStep(0);
    }

    const handleInputError = (stepIndex) => {
        setActiveStep(stepIndex);
    }

    const handleUserRegistration = () => {

        if (!newUserData.aceitou){
            return openSnackbar('Para se cadastrar você deve aceitar os termos de uso.', 'info');
        }

        setIsLoading(true);

        setActiveStep((prevActiveStep) => { return prevActiveStep + 1 });
        
        // setTimeout(() => {

            axios.post('/registration/', {
                email: newUserData.email,
                senha: newUserData.password,

                confirma_senha: newUserData.passwordConfirm,
                primeiro_nome: newUserData.nome,
                sobrenome: newUserData.sobrenome,
                data_nascimento: newUserData.dataNascimento,
                cpf: newUserData.cpf,
                telefone: newUserData.telefone,
                descricao: newUserData.descricao,

                cep: newUserData.cep,
                logradouro: newUserData.logradouro,
                bairro: newUserData.bairro,
                cidade: newUserData.cidade,
                uf: newUserData.uf,
                numero: newUserData.numero,
                complemento: newUserData.complemento
            }, {
                baseURL: 'http://web-petadote.ddns.net:4000'
            })
            .then((response) => {

                console.log('[UserRegistrationContainer.js/atRegistration]:', response.data);

                if (response.data === 'SUCCESS'){

                    axios.post('/auth/login', {
                        email: newUserData.email,
                        password: newUserData.password
                    }, {
                        baseURL: 'http://web-petadote.ddns.net:4000',   // Domínio do Back-end da aplicação.
                        withCredentials: true
                    })
                    .then( async (response) => {

                        console.log('[UserRegistrationContainer.js/atLoginAfterReg]:', response);
            
                        // console.log('[UserRegistrationContainer.js/loginAfterRegToSetAvatar]:', axios.defaults.headers);
                        
                        if (response.data?.user_accessToken || response.data?.inactiveUser_accessToken){
            
                            // Definindo o Access Token do Usuário na memória (Ficará salvo no cabeçalho das próximas requisições com essa instância do axios).
                            axios.defaults.headers.common = {
                                'Authorization': `Bearer ${response.data.user_accessToken || response.data.inactiveUser_accessToken}`
                            }

                            if (newUserData.avatar){

                                const formData = new FormData();    // Para passar o arquivo do usuário com multipart/form-data.
                                formData.append("foto_usuario", newUserData.avatar);    // O nome do campo deve ser o que a REST pede "foto_usuario".
                                
                                await axios({
                                    url: `/usuarios/${response.data.cod_usuario}`,
                                    method: 'PATCH',
                                    data: formData,
                                    headers: { 'Content-Type': undefined }
                                })
                                .then((response) => {

                                    console.log('[UserRegistrationContainer.js/atSetAvatar]:', response.data);

                                })
                                .catch((error) => {
                                    console.log('[UserRegistrationContainer.js/atSetAvatar]:', error?.response?.data || error?.message);
                                });

                            }
            
                            // console.log('BeforePostLogin: ', response.data);

                            // console.log('PostLogin', axios.defaults.headers.common);

                            try {
                                fetchUser();
                                setIsLoading(false);
                                setNewUserData(initialUserData);
                                console.log('[UserRegistrationContainer.js/atLoginAfterReg]: Usuário autenticado com sucesso');
                            } catch (error) {
                                console.log('[UserRegistrationContainer.js/atLoginAfterReg]: Algo deu errado ao buscar os dados do usuário:', error);
                            }

                        }
            
                        console.log('[UserRegistrationContainer.js/atLoginAfterReg/unknownResponse]:', response);
            
                    })
                    .catch((error) => {
                        console.log('[UserRegistrationContainer.js/atLoginAfterReg]:', error?.response?.data || error?.message);
                        console.log(error);
                    });

                }

            })
            .catch((error) => {

                const code = error.response?.data?.code;

                if (code){
                    switch(code){
                        case 'INVALID_REQUEST_FIELDS': 
                            openSnackbar('Campos obrigatórios estão faltando. Revise seus dados.', 'error');
                            setActiveStep(0);
                            return;
                        case 'INVALID_AUTH_HEADER':
                            openSnackbar('Não foi possível finalizar seu cadastro, tente novamente mais tarde.', 'error');
                            setActiveStep(0);
                            return;
                        default: 
                            openSnackbar(error.response.data.mensagem || error.message, 'error');
                            setActiveStep(0);
                            return console.log('[UserRegistrationContainer.js/atRegistration]:', error.response.data || error.message || error);;
                    }
                }
                
                console.log('[UserRegistrationContainer.js/atRegistration]:', error.response?.data || error.message || error);

            });

        // }, 3000)
        
        
    }

    return (
        <>
        {
            !user ?

            <Grid container component="main" className={styles.mainContainer}>

                <Grid item xs={11} sm={8} md={6} lg={4} className={styles.formContainer}>

                    <Grid container justify='center' >

                        <Grid item xs={12}> {/* Header */}
                            <Typography component='h1' variant='h5' align='center' style={{ fontWeight: '500', marginBottom: '8px' }}>
                                {
                                    activeStep === steps.length ?
                                        isLoading ? 'Concluindo seu cadastro...' : 'Cadastro concluído!'
                                    : 
                                        getStepTitle(activeStep)
                                }
                            </Typography>
                        </Grid>

                        <Grid item xs={12}> {/* Content */}

                            {
                                activeStep === steps.length ?
                                    isLoading ? 
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            <CircularProgress  />
                                        </div>
                                    :
                                        <Typography component='p' align='center'><b>Você será redirecionado em breve!</b></Typography>
                                : 
                                    getStepContent(activeStep)
                            }

                        </Grid>
                            
                        <Grid item xs={12} style={{ display: 'flex', overflow: 'auto', justifyContent: 'space-between', padding: '8px 0px' }}> {/* Buttons */}

                            {
                                activeStep === steps.length ?
                                    null
                                    // <div>
                                    //     <Button onClick={handleBack}>Voltar</Button>
                                    // </div>
                                : 
                                    <>
                                    <Button 
                                        onClick={ activeStep === 0 ? () => { history.push('/login') } : handleBack}
                                        // disabled={activeStep === 0}
                                        variant='contained'
                                        color='primary'
                                        size='small'
                                        
                                    >
                                        { activeStep === 0 ? 'Desistir' : 'Voltar'}
                                    </Button>
                                    {
                                        activeStep < steps.length - 1 ?
                                        <Button 
                                            onClick={() => { handleResetStep(activeStep) }}
                                            variant='contained'
                                            color='primary'
                                            size='small'
                                        >
                                            Limpar
                                        </Button>
                                        : null
                                    }
                                    <Button 
                                        onClick={ activeStep === steps.length - 1 ? handleUserRegistration : handleNext }
                                        variant='contained'
                                        color='primary'
                                        size='small'
                                    >
                                        { activeStep === steps.length - 1 ? 'Cadastrar' : 'Avançar' }
                                    </Button>
                                    </>
                            }

                        </Grid>

                        <Grid item xs={12}> {/* Stepper */}

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

                        </Grid>

                    </Grid>

                </Grid>

            </Grid>

            : null
        }
        </>
    );
}

// Redux Store Mapping.
const mapStateToProps = (state) => {
    return {
        userData: state.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        // clearUser: () => { return dispatch ( clearUser() ) },
        // fetchAnnouncements: (page, limit) => { return dispatch( fetchAnnouncements(page, limit) ) },
        fetchUser: () => { return dispatch ( fetchUser() ) },
        openSnackbar: (message, severity) => { return dispatch( openSnackbar(message, severity) ) }
    }
}
 
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserRegistration);