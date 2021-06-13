// Importações.
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// Utilidades.
import axios from '../helpers/axiosInstance';
import { useSnackbar } from 'notistack';
import { makeStyles }
    from '@material-ui/core/styles';

// Actions.
// import { openSnackbar }
//     from '../redux/actions';

// Componentes.
import { useTheme, useMediaQuery, 
         Grid, Divider, IconButton, Button, ButtonBase, 
         Typography, TextField, } 
    from '@material-ui/core';

import { Beenhere, VpnKey, Edit, Visibility, VisibilityOff, Save, Delete }
    from '@material-ui/icons';

// import UserAvatar from '../components/UserAvatar';
import UserAccPersonalDataDialog from '../components/UserAccPersonalDataDialog';
import UserAccAddressDataDialog from '../components/UserAccAddressDataDialog';
import UserAccDataDialog from '../components/UserAccDataDialog';
import UserAccActivationDialog from './UserAccActivationDialog';

// Inicializações.
const useStyles = makeStyles((theme) => {
    return {
        userAccDetailsBox: {
            padding: '0',
            backgroundColor: 'ghostwhite'
        },
        userBanner: {
            minHeight: '200px',
            maxHeight: '200px',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        },
        userContextBar: {
            minHeight: '40px',
            padding: '0 8px'
        }
    }
});

// Functional Component.
const UserAccDetails = (props) => {

    const { user } = props.userData;
    const { userAddress, setHasUpdated } = props;

    const styles = useStyles();
    const theme = useTheme();
    const isDownXs = useMediaQuery(theme.breakpoints.down('xs'));
    const isDownSm = useMediaQuery(theme.breakpoints.down('sm'));
    const isDownMd = useMediaQuery(theme.breakpoints.down('md'));

    const { enqueueSnackbar } = useSnackbar();

    // const initialProfileData = {
    //     avatarAsUrl: user.download_avatar,
    //     bannerAsUrl: user.download_banner,
    //     nome: user.primeiro_nome,
    //     sobrenome: user.sobrenome,
    //     dataNascimento: user.data_nascimento,
    //     cpf: user.cpf,
    //     telefone: user.telefone,
    //     descricao: user.descricao,
    // };

    const initialAddressData = {
        cep: userAddress.cep,
        logradouro: userAddress.logradouro,
        bairro: userAddress.bairro,
        cidade: userAddress.cidade,
        uf: userAddress.uf,
        numero: userAddress.numero,
        complemento: userAddress.complemento,
    }

    // const initialAccountData = {
    //     password: '',
    //     passwordConfirm: '',
    // };

    // const [userProfileData, setUserProfileData] = useState(initialProfileData);
    const [userAddressData, setUserAddressData] = useState(initialAddressData);
    // const [userAccountData, setUserAccountData] = useState(initialAccountData);

    const initialNewProfileData = {
        // avatarFile: null,
        // bannerFile: null,
        nome: '',
        sobrenome: '',
        dataNascimento: '',
        cpf: '',
        telefone: '',
        descricao: '',
    };

    const initialNewAddressData = {
        cep: '',
        logradouro: '',
        bairro: '',
        cidade: '',
        uf: '',
        numero: '',
        complemento: '',
    }

    // const initialNewAccountData = {
    //     password: '',
    //     passwordConfirm: '',
    // };

    const [newUserProfileData, setNewUserProfileData] = useState(initialNewProfileData);
    const [newUserAddressData, setNewUserAddressData] = useState(initialNewAddressData);
    // const [newUserAccountData, setNewUserAccountData] = useState(initialNewAccountData);

    const [newAvatarAsUrl, setNewAvatarAsUrl] = useState('');
    const [newAvatarFile, setNewAvatarFile] = useState(null);
    const [newAvatarSelectionError, setNewAvatarSelectionError] = useState(null);

    const [newBannerAsUrl, setNewBannerAsUrl] = useState('');
    const [newBannerFile, setNewBannerFile] = useState(null);
    const [newBannerSelectionError, setNewBannerSelectionError] = useState(null);

    const [openNewProfileDataDialog, setOpenNewProfileDataDialog] = useState(false);
    const [newProfileDataDialogDecision, setNewProfileDataDialogDecision] = useState(null);

    const [openNewAddressDataDialog, setOpenNewAddressDataDialog] = useState(false);
    const [newAddressDataDialogDecision, setNewAddressDataDialogDecision] = useState(null);

    const [openNewAccDataDialog, setOpenNewAccDataDialog] = useState(false);
    const [newAccDataDialogDecision, setNewAccDataDialogDecision] = useState(null);

    const [openAccActivationDialog, setOpenAccActivationDialog] = useState(false);
    const [accActivationDialogDecision, setAccActivationDialogDecision] = useState(null);

    const [hideCpf, setHideCpf] = useState(true);

    // useEffect(() => {
    //
    // }, []);

    const handleOpenNewProfileDataDialog = () => {
        setOpenNewProfileDataDialog(true);
    }

    const handleCloseNewProfileDataDialog = (newDecision) => {
        setOpenNewProfileDataDialog(false);

        if (newDecision) {
            setNewProfileDataDialogDecision(newDecision);
            console.log('[UserAccDetailsContainer.js] Close personal data dialog decision:', newProfileDataDialogDecision);
        }
    }

    const handleOpenNewAddressDataDialog = () => {
        setOpenNewAddressDataDialog(true);
    }

    const handleCloseNewAddressDataDialog = (newDecision) => {
        setOpenNewAddressDataDialog(false);

        if (newDecision) {
            setNewAddressDataDialogDecision(newDecision);
            console.log('[UserAccDetailsContainer.js] Close address data dialog decision:', newAddressDataDialogDecision);
        }
    }

    const handleOpenNewAccDataDialog = () => {
        setOpenNewAccDataDialog(true);
    }

    const handleCloseNewAccDataDialog = (newDecision) => {
        setOpenNewAccDataDialog(false);

        if (newDecision) {
            setNewAccDataDialogDecision(newDecision);
            console.log('[UserAccDetailsContainer.js] Close account data dialog decision:', newAccDataDialogDecision);
        }
    }

    const handleOpenAccActivationDialog = () => {
        setOpenAccActivationDialog(true);
    }

    const handleCloseAccActivationDialog = (newDecision) => {
        setOpenAccActivationDialog(false);

        if (newDecision) {
            setAccActivationDialogDecision(newDecision);
            console.log('[UserAccDetailsContainer.js] Close account activation dialog decision:', accActivationDialogDecision);
        }
    }

    const handleClickCpfVisibility = () => {
        setHideCpf(!hideCpf);
        // setUserProfileData({ ...userProfileData, cpf: userProfileData.cpf ? null : user.cpf }) 
    }

    const handleNewAvatarSelection = async (ev) => {
        const selectedFile = await ev.target.files[0];

        if (selectedFile && !selectedFile.type.includes('image/')){
            setNewAvatarSelectionError('Unsupported File');
            return;
        }

        if (selectedFile){
            if (newAvatarSelectionError){
                setNewAvatarSelectionError(null);
            }

            const fileReader = new FileReader();
            fileReader.readAsDataURL(selectedFile);
            fileReader.onload = (event) => {
                setNewAvatarAsUrl(event.target.result);
            }

            setNewAvatarFile(selectedFile);
            // setNewUserProfileData({ ...newUserProfileData, avatarFile: selectedFile });
        }

        ev.target.value = null;
    }

    const handleNewBannerSelection = async (ev) => {
        const selectedFile = await ev.target.files[0];

        if (selectedFile && !selectedFile.type.includes('image/')){
            setNewBannerSelectionError('Unsupported File');
            return;
        }

        if (selectedFile){
            if (newBannerSelectionError){
                setNewBannerSelectionError(null);
            }

            const fileReader = new FileReader();
            fileReader.readAsDataURL(selectedFile);
            fileReader.onload = (event) => {
                setNewBannerAsUrl(event.target.result);
            }

            setNewBannerFile(selectedFile);
            // setNewUserProfileData({ ...newUserProfileData, bannerFile: selectedFile });
        }

        ev.target.value = null;
    }

    const handleClearNewUserData = () => {
        setNewUserProfileData(initialNewProfileData);

        setNewAvatarAsUrl('');
        setNewBannerAsUrl('');

        setNewAvatarFile(null);
        setNewBannerFile(null);

        setNewUserAddressData(initialNewAddressData);
        // setNewUserAccountData(initialNewAccountData);
    }

    const handleSaveNewUserData = () => {
        
        // console.log('accDifferent?', JSON.stringify(initialNewAddressData) !== JSON.stringify(newUserAddressData));
        // console.log('initialNewAddData:', initialNewAddressData)
        // console.log('newUserAddData:', newUserAddressData);

        if (JSON.stringify(initialNewProfileData) !== JSON.stringify(newUserProfileData)){
            axios.patch(`/usuarios/${user.cod_usuario}`, {
                primeiro_nome: newUserProfileData.nome !== '' ? newUserProfileData.nome || undefined : undefined,
                sobrenome: newUserProfileData.sobrenome !== '' ? newUserProfileData.sobrenome || undefined : undefined,
                cpf: newUserProfileData.cpf !== '' ? newUserProfileData.cpf || undefined : undefined,
                telefone: newUserProfileData.telefone !== '' ? newUserProfileData.telefone || undefined : undefined,
                data_nascimento: newUserProfileData.dataNascimento !== '' ? newUserProfileData.dataNascimento || undefined : undefined,
                descricao: newUserProfileData.descricao !== '' ? newUserProfileData.descricao || undefined : undefined,
            })
            .then((response) => {
                if (response.data){
                    console.log(response.data);

                    setNewUserProfileData(initialNewProfileData);
                    setHasUpdated(true);
                }
            })
            .catch((error) => {
                console.log(error.response?.data || error.response || error.message || 'UNKNOWN_ERROR' );

                const errorMsg = error.response?.data?.error?.mensagem || error.response?.data?.mensagem || 'Falha ao atualizar o avatar.';

                enqueueSnackbar(errorMsg, { variant: 'warning' });
                // openSnackbar(errorMsg, 'warning');
                
            });
        }

        if (JSON.stringify(initialNewAddressData) !== JSON.stringify(newUserAddressData)){
            axios.patch(`usuarios/enderecos/${user.cod_usuario}`, {
                cep: newUserAddressData.cep !== '' ? newUserAddressData.cep || undefined : undefined,
                uf: newUserAddressData.uf !== '' ? newUserAddressData.uf || undefined : undefined,
                cidade: newUserAddressData.cidade !== '' ? newUserAddressData.cidade || undefined : undefined,
                bairro: newUserAddressData.bairro !== '' ? newUserAddressData.bairro || undefined : undefined,
                logradouro: newUserAddressData.logradouro !== '' ? newUserAddressData.logradouro || undefined : undefined,
                numero: newUserAddressData.numero !== '' ? newUserAddressData.numero || undefined : undefined,
                complemento: newUserAddressData.complemento !== '' ? newUserAddressData.complemento || undefined : undefined,
            })
            .then((response) => {
                if (response.data){
                    console.log(response.data);
                    
                    setNewUserAddressData(initialNewAddressData);
                    setHasUpdated(true);
                }
            })
            .catch((error) => {

                // console.log(error.response?.data || error.response || error.message || 'UNKNOWN_ERROR' );

                const errorMsg = error.response?.data?.error?.mensagem || error.response?.data?.mensagem || 'Falha ao atualizar o avatar.';

                enqueueSnackbar(errorMsg, { variant: 'warning' });
                // openSnackbar(errorMsg, 'warning');

            });
        }

        if (newAvatarFile){

            const avatarFormData = new FormData();
            avatarFormData.append("foto_usuario", newAvatarFile);

            axios.patch(`/usuarios/${user.cod_usuario}`, avatarFormData, {
                headers: {
                    'Content-Type': undefined
                }
            })
            .then((response) => {
                console.log('[UserAccDetailsContainer.js/atUpdateAvatar]:', response.data);

                setNewAvatarFile(null);
                setHasUpdated(true);
            })
            .catch((error) => {
                // console.log('[UserAccDetailsContainer.js/atUpdateAvatar] unexpected error:', error?.response?.data || error?.message);

                const errorMsg = error.response?.data?.error?.mensagem || error.response?.data?.mensagem || 'Falha ao atualizar o avatar.';

                setNewAvatarFile(null);
                setNewAvatarAsUrl('');

                enqueueSnackbar(errorMsg, { variant: 'warning' });
                // openSnackbar(errorMsg, 'warning');
            });

        }

        if (newBannerFile){

            const bannerFormData = new FormData();
            bannerFormData.append("banner_usuario", newBannerFile);

            axios.patch(`/usuarios/${user.cod_usuario}`, bannerFormData, {
                headers: {
                    'Content-Type': undefined
                }
            })
            .then((response) => {
                console.log('[UserAccDetailsContainer.js/atUpdateBanner]:', response.data);

                setNewBannerFile(null);
                setHasUpdated(true);
            })
            .catch((error) => {

                // console.log('[UserAccDetailsContainer.js/atUpdateBanner] unexpected error:', error?.response?.data || error?.message);

                const errorMsg = error.response?.data?.error?.mensagem || error.response?.data?.mensagem || 'Falha ao atualizar o banner.';

                setNewBannerFile(null);
                setNewBannerAsUrl('');

                enqueueSnackbar(errorMsg, { variant: 'warning' });
                // openSnackbar(errorMsg, 'warning');
            });

        }

    }









    return (
        <Grid container className={styles.userAccDetailsBox}>

            <Grid container>

                <Grid item xs={12} className={styles.userBanner}
                    style={{ backgroundImage: `url(${newBannerAsUrl || user.download_banner})` }}
                >   {/* Início - Banner */}
                    <ButtonBase
                        focusRipple
                        key='user_banner'
                        style={{
                            width: '100%',
                            height: '100%'
                        }}
                        onClick={ () => { document.querySelector('input#banner').click(); } }
                    >
                        {newBannerSelectionError ? 'A imagem selecionada é inválida, tente novamente.' : null}
                    </ButtonBase>
                    <input type='file'
                        id='banner'
                        name='banner'
                        accept='image/*'
                        alt='User banner'
                        onChange={(ev) => { handleNewBannerSelection(ev) }}
                        hidden
                    />
                </Grid>     {/* Fim - Banner */}

                <Grid item xs={12} className={styles.userContextBar}>   {/* Início - User Avatar + User Context Menu Icons */}

                    <Grid container justify='space-between'>

                        <Grid item xs={12} sm={12} md={3}>  {/* Início - Avatar */}

                            <Grid container style={{ padding: '8px 0', height: '100%' }}>
                                <Grid item xs={12}>
                                    <Grid container justify={isDownSm ? 'center' : 'flex-start'} style={{ position: 'relative', minHeight: '30px' }}>
                                    <div style={{ position: 'absolute', bottom: '0px', margin: '0 8px' }}>
                                        <IconButton size='small' >
                                            <label htmlFor='avatar' style={{ 
                                                boxShadow: newAvatarSelectionError ? '0px 0px 5px 0px red' : 'none',
                                                border: '4px solid ghostwhite',
                                                borderRadius: '50%',
                                                minWidth: isDownXs ? '100px' : '150px',
                                                maxWidth: isDownXs ? '100px' : '150px',
                                                minHeight: isDownXs ? '100px' : '150px',
                                                maxHeight: isDownXs ? '100px' : '150px',
                                                backgroundImage: `url(${newAvatarAsUrl || user.download_avatar})`,
                                                backgroundRepeat: 'no-repeat',
                                                backgroundSize: 'cover',
                                                backgroundColor: 'ghostwhite',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer'
                                            }}>
                                                { user.download_avatar ? '' : '' }
                                            </label>
                                        </IconButton>
                                        <input type='file'
                                            id='avatar'
                                            name='avatar'
                                            accept='image/*'
                                            alt='User avatar'
                                            onChange={(ev) => { handleNewAvatarSelection(ev) }}
                                            hidden
                                        />
                                    </div>
                                    </Grid>
                                </Grid>
                            </Grid>

                        </Grid> {/* Fim - Avatar */}

                        <Grid item xs={12} sm={12} md={9} style={{ overflow: 'auto' }}> {/* Início - Ícones */}

                            <Grid container justify={isDownSm ? 'center': 'flex-end'} style={{ padding: '8px 0' }}>
                                        
                                <Grid item xs={12} style={{ overflow: 'auto' }}>
                                    <Grid container justify={isDownSm ? 'center': 'flex-end'} alignItems='center'>

                                        {
                                            user.esta_ativo === 0 ?
                                                <Grid item style={{ padding: '4px' }}>
                                                    <Button 
                                                        onClick={handleOpenAccActivationDialog}
                                                        style={{ whiteSpace: 'nowrap' }}
                                                        variant='outlined'
                                                        size='small'
                                                        color='primary'
                                                        startIcon={<Beenhere style={{ color: 'green' }} />}
                                                        fullWidth
                                                    >
                                                        Ativar conta
                                                    </Button>
                                                </Grid>
                                            : null
                                        }
                                        
                                        {

                                            (JSON.stringify(initialNewProfileData) !== JSON.stringify(newUserProfileData)) 
                                            ||
                                            (JSON.stringify(initialNewAddressData) !== JSON.stringify(newUserAddressData)) 
                                            ||
                                            (newAvatarFile)
                                            ||
                                            (newBannerFile)
                                            ?
                                            <>
                                                <Grid item style={{ padding: '4px' }}>
                                                    <Button
                                                        onClick={handleClearNewUserData}
                                                        style={{ whiteSpace: 'nowrap' }}
                                                        variant='outlined'
                                                        size='small'
                                                        startIcon={<Delete />}
                                                        fullWidth
                                                    >
                                                        Descartar
                                                    </Button>
                                                </Grid>

                                                <Grid item style={{ padding: '4px' }}>
                                                    <Button
                                                        onClick={handleSaveNewUserData}
                                                        style={{ whiteSpace: 'nowrap' }}
                                                        variant='outlined'
                                                        size='small'
                                                        startIcon={<Save />}
                                                        fullWidth
                                                    >
                                                        Salvar Alterações
                                                    </Button>
                                                </Grid>
                                            </>
                                            : null

                                        }

                                        <Grid item style={{ padding: '4px' }}>
                                            <Button
                                                onClick={handleOpenNewAccDataDialog}
                                                style={{ whiteSpace: 'nowrap' }}
                                                variant='outlined'
                                                size='small'
                                                startIcon={<VpnKey />}
                                                fullWidth
                                            >
                                                Alterar senha
                                            </Button>
                                        </Grid>

                                    </Grid>
                                </Grid>

                            </Grid>

                        </Grid> {/* Fim - Ícones */}

                    </Grid>

                </Grid> {/* Fim - User Avatar + User Context Menu Icons */}

                <Grid item xs={12} sm={12} md={6} style={{ padding: '8px' }}> {/* Início - Dados do Perfil */}
                    <Grid container>
                        
                        <Grid item xs={12} style={{ overflow: 'auto' }}>
                            <Grid container alignItems='center' wrap='nowrap'>
                                <Grid item style={{ paddingRight: '8px' }}>
                                    <Button
                                        onClick={handleOpenNewProfileDataDialog}
                                    >
                                        <Typography component='h1' variant='h5'>
                                            Dados pessoais
                                        </Typography>
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <IconButton
                                        onClick={handleOpenNewProfileDataDialog}
                                    >
                                        <Edit />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12} style={{ padding: '4px 8px' }}>
                            
                            <Typography component='p'>
                                <b>Nome: </b>
                                { 
                                    newUserProfileData.nome ?
                                        <span style={{ color: 'royalblue' }}>{newUserProfileData.nome} </span>
                                    :
                                        <span>{user.primeiro_nome} </span>
                                }
                                { 
                                    newUserProfileData.sobrenome ?
                                        <span style={{ color: 'royalblue' }}>{newUserProfileData.sobrenome}</span>
                                    :
                                        <span>{user.sobrenome}</span>
                                }

                            </Typography>
                            
                        </Grid>

                        <Grid item xs={12} style={{ padding: '4px 8px' }}>
                            <Typography component='p'><b>Data de nascimento: </b>
                                {
                                    newUserProfileData.dataNascimento ?
                                        newUserProfileData.dataNascimento ?
                                            <span style={{ color: 'royalblue' }}>
                                            {newUserProfileData.dataNascimento.split('-')[2]}/{newUserProfileData.dataNascimento.split('-')[1]}/{newUserProfileData.dataNascimento.split('-')[0]}
                                            </span>
                                        : 
                                            null
                                    : 
                                        user.data_nascimento ? 
                                            `${user.data_nascimento.split('-')[2]}/${user.data_nascimento.split('-')[1]}/${user.data_nascimento.split('-')[0]}` 
                                        : 
                                            null
                                }
                            </Typography>
                        </Grid>

                        <Grid item xs={12} style={{ padding: '4px 8px' }}>
                            <Typography component='p' style={{ display: 'flex', alignItems: 'center' }}>
                                <span><b>CPF: </b>
                                    <span style={ newUserProfileData.cpf ? { color: 'royalblue' } : {} }>
                                        {   
                                            hideCpf ? 
                                                '***.***.***-**'
                                            : 
                                                newUserProfileData.cpf || user.cpf
                                        }
                                    </span>
                                </span>
                                <IconButton 
                                    size='small'
                                    onClick={handleClickCpfVisibility}
                                    style={{ margin: '0 8px' }}
                                >
                                    {hideCpf ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </Typography>
                        </Grid>

                        <Grid item xs={12} style={{ padding: '4px 8px' }}>
                            <Typography component='p'><b>Telefone: </b>
                                <span style={ newUserProfileData.telefone ? { color: 'royalblue' } : {} }>
                                    {newUserProfileData.telefone || user.telefone}
                                </span>
                            </Typography>
                        </Grid>

                        <Grid item xs={12} style={{ padding: '4px 8px' }}>
                            <Typography component='p'><b>Descrição: </b>
                                <span style={ newUserProfileData.descricao ? { color: 'royalblue' } : {} }>
                                    {newUserProfileData.descricao || user.descricao || 'Sem descrição'}
                                </span>
                            </Typography>
                        </Grid>

                        <Grid item xs={12} style={{ padding: '4px 8px' }}>
                            <Typography component='p' variant='caption'>
                                Dica: Clique no avatar ou no banner se deseja alterá-los.
                            </Typography>
                        </Grid>

                    </Grid>
                </Grid> {/* Fim - Dados do Perfil */}

                <Grid item xs={12} sm={12} md={6} style={{ padding: '8px' }}> {/* Início - Dados do Endereço */}
                    <Grid container>
                        
                    <Grid item xs={12} style={{ overflow: 'auto' }}>
                            <Grid container alignItems='center' wrap='nowrap'>
                                <Grid item style={{ paddingRight: '8px' }}>
                                    <Button
                                        onClick={handleOpenNewAddressDataDialog}
                                    >
                                        <Typography component='h1' variant='h5'>
                                            Endereço
                                        </Typography>
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <IconButton
                                        onClick={handleOpenNewAddressDataDialog}
                                    >
                                        <Edit />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12} style={{ padding: '4px 8px' }}>
                            <Typography component='p'>
                                <b>CEP: </b>
                                <span style={newUserAddressData.cep ? newUserAddressData.cep.length > 0 && newUserAddressData.cep.length < 4 ? { color: 'red' } : { color: 'royalblue' } : {}}>
                                    {
                                        newUserAddressData.cep ?
                                            String().concat(
                                                newUserAddressData.cep.substring(0, newUserAddressData.cep.length - 3)
                                                + (newUserAddressData.cep.length > 0 && newUserAddressData.cep.length < 4 ? '' : '-') +
                                                newUserAddressData.cep.substring(newUserAddressData.cep.length - 3)
                                            ) 
                                        : 
                                            userAddressData.cep ?
                                                String().concat(
                                                    userAddressData.cep.substring(0, userAddressData.cep.length - 3) 
                                                    + '-' +
                                                    userAddressData.cep.substring(userAddressData.cep.length - 3)
                                                )
                                        : null
                                    }
                                </span>
                            </Typography>
                        </Grid>

                        <Grid item xs={12} style={{ padding: '4px 8px' }}>
                            <Typography component='p'>
                                <b>Logradouro: </b>
                                <span style={ newUserAddressData.logradouro ? { color: 'royalblue' } : {}}>
                                    {newUserAddressData.logradouro || userAddressData.logradouro}
                                </span>
                            </Typography>
                        </Grid>

                        <Grid item xs={12} style={{ padding: '4px 8px' }}>
                            <Typography component='p'>
                                <b>Bairro: </b>
                                <span style={ newUserAddressData.bairro ? { color: 'royalblue' } : {}}>
                                    {newUserAddressData.bairro || userAddressData.bairro}
                                </span>
                            </Typography>
                        </Grid>

                        <Grid item xs={12} style={{ padding: '4px 8px' }}>
                            <Typography component='p'>
                                <b>Cidade: </b>
                                <span style={ newUserAddressData.cidade ? { color: 'royalblue' } : {}}>
                                    {newUserAddressData.cidade || userAddressData.cidade}
                                </span>
                            </Typography>
                        </Grid>

                        <Grid item xs={12} style={{ padding: '4px 8px' }}>
                            <Typography component='p'>
                                <b>UF: </b>
                                <span style={ newUserAddressData.uf ? { color: 'royalblue' } : {}}>
                                    {newUserAddressData.uf || userAddressData.uf}
                                </span>
                            </Typography>
                        </Grid>

                        <Grid item xs={12} style={{ padding: '4px 8px' }}>
                            <Typography component='p'>
                                <b>Número: </b>
                                <span style={ newUserAddressData.numero ? { color: 'royalblue' } : {}}>
                                    {newUserAddressData.numero || userAddressData.numero}
                                </span>
                            </Typography>
                        </Grid>

                        <Grid item xs={12} style={{ padding: '4px 8px' }}>
                            <Typography component='p'>
                                <b>Complemento: </b>
                                <span style={ newUserAddressData.complemento ? { color: 'royalblue' } : {}}>
                                    {newUserAddressData.complemento || userAddressData.complemento || 'Sem complemento'}
                                </span>
                            </Typography>
                        </Grid>

                    </Grid>
                </Grid> {/* Fim - Dados do Endereço */}

            </Grid>

            <UserAccPersonalDataDialog
                keepMounted
                openDialog={openNewProfileDataDialog}
                closeDialog={handleCloseNewProfileDataDialog}
                userPersonalData={newUserProfileData}
                setUserPersonalData={setNewUserProfileData}
            />

            <UserAccAddressDataDialog
                keepMounted
                openDialog={openNewAddressDataDialog}
                closeDialog={handleCloseNewAddressDataDialog}
                userAddressData={newUserAddressData}
                setUserAddressData={setNewUserAddressData}
            />

            <UserAccDataDialog
                keepMounted
                openDialog={openNewAccDataDialog}
                closeDialog={handleCloseNewAccDataDialog}
            />

            <UserAccActivationDialog
                keepMounted
                openDialog={openAccActivationDialog}
                closeDialog={handleCloseAccActivationDialog}
            />

        </Grid>
    );
}

UserAccDetails.propTypes = {
    // announcementWidth: PropTypes.number,
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
        // openSnackbar: (message, severity) => { return dispatch( openSnackbar(message, severity) ) }
        // fetchAnnouncements: (page, limit) => { return dispatch( fetchAnnouncements(page, limit) ) },
        // fetchUser: () => { return dispatch ( fetchUser() ) },
    }
}

// Exportações.
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserAccDetails);