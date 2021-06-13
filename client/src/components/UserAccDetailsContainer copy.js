// Importações.
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// Utilidades.
import axios from '../helpers/axiosInstance';
import { makeStyles }
    from '@material-ui/core/styles';

// Actions.
import { openSnackbar }
    from '../redux/actions';

// Componentes.
import { useTheme, useMediaQuery, 
         Grid, Divider, IconButton, Button, ButtonBase, 
         Typography, TextField, } 
    from '@material-ui/core';

import { Beenhere, VpnKey, Edit, Visibility, VisibilityOff }
    from '@material-ui/icons';

import UserAvatar from '../components/UserAvatar';

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
    const { userAddress } = props;

    const styles = useStyles();
    const theme = useTheme();
    const isDownXs = useMediaQuery(theme.breakpoints.down('xs'));
    const isDownSm = useMediaQuery(theme.breakpoints.down('sm'));
    const isDownMd = useMediaQuery(theme.breakpoints.down('md'));

    const initialProfileData = {
        avatar: user.download_avatar,
        nome: user.primeiro_nome,
        sobrenome: user.sobrenome,
        dataNascimento: user.data_nascimento,
        cpf: null,
        telefone: user.telefone,
        descricao: user.descricao,
    };

    const initialAddressData = {
        cep: userAddress.cep,
        logradouro: userAddress.logradouro,
        bairro: userAddress.bairro,
        cidade: userAddress.cidade,
        uf: userAddress.uf,
        numero: userAddress.numero,
        complemento: userAddress.complemento,
    }

    const initialAccountData = {
        password: '',
        passwordConfirm: '',
    };

    const [userProfileData, setUserProfileData] = useState(initialProfileData);
    const [userAddressData, setUserAddressData] = useState(initialAddressData);
    const [userAccountData, setUserAccountData] = useState(initialAccountData);

    const getWelcomeMsg = () => {
        const hourNow = new Date().getHours();

        if (hourNow >= 6 && hourNow < 12){
            return 'Bom dia';
        }

        if (hourNow >= 12 && hourNow < 18){
            return 'Boa tarde'
        }

        if (hourNow >= 18 || (hourNow >= 0 && hourNow < 6)){
            return 'Boa noite';
        }
        
    }

    const handleClickCpfVisibility = () => { 
        setUserProfileData({ ...userProfileData, cpf: userProfileData.cpf ? null : user.cpf }) 
    }

    return (
        <Grid container className={styles.userAccDetailsBox}>

            <Grid container>

                <Grid item xs={12} className={styles.userBanner}
                    style={{ backgroundImage: `url(${user.download_banner})` }}
                >   {/* Início - Banner */}
                    <ButtonBase
                        focusRipple
                        key='user_banner'
                        style={{
                            width: '100%',
                            height: '100%'
                        }}
                        onClick={ () => { console.log('Vou permitir que o usuário altere o Banner!') } }
                    />
                    
                </Grid>     {/* Fim - Banner */}

                <Grid item xs={12} className={styles.userContextBar}>   {/* Início - User Avatar + User Context Menu Icons */}

                    <Grid container justify='space-between'>

                        <Grid item xs={12} sm={12} md={3}>  {/* Início - Avatar */}

                            <Grid container style={{ padding: '8px 0', height: '100%' }}>
                                <Grid item xs={12}>
                                    <Grid container justify={isDownXs ? 'center' : 'flex-start'} style={{ position: 'relative', minHeight: '30px' }}>
                                    <div style={{ position: 'absolute', bottom: '0px', padding: '0 8px' }}>
                                        <IconButton
                                            size='small'
                                            onClick={ () => { console.log('Vou permitir que o usuário altere seu avatar') } }
                                        >
                                            <UserAvatar 
                                                user={user}
                                                width={isDownXs ? '100px' : '150px'}
                                                height={isDownXs ? '100px' : '150px'}
                                                customStyle={{ 
                                                    border: '4px solid ghostwhite',
                                                    backgroundColor: 'ghostwhite',
                                                    boxShadow: 'none',
                                                }}
                                            />
                                        </IconButton>
                                    </div>
                                    </Grid>
                                </Grid>
                            </Grid>

                        </Grid> {/* Fim - Avatar */}

                        <Grid item xs={12} sm={12} md={9} style={{ overflow: 'auto' }}> {/* Início - Ícones */}

                            <Grid container justify={isDownSm ? 'center': 'flex-end'} style={{ padding: '8px 0' }}>
                                        
                                <Grid item xs={12} style={{ overflow: 'auto' }}>
                                    <Grid container justify={isDownSm ? 'center': 'flex-end'} alignItems='center'>

                                        <Grid item style={{ padding: '4px' }}>
                                            <Button 
                                                onClick={ () => {} }
                                                style={{ whiteSpace: 'nowrap' }}
                                                variant='outlined'
                                                color='primary'
                                                startIcon={<Beenhere style={{ color: 'green' }} />}
                                                fullWidth
                                            >
                                                Ativar conta
                                            </Button>
                                        </Grid>

                                        <Grid item style={{ padding: '4px' }}>
                                            <Button
                                                onClick={ () => {} }
                                                style={{ whiteSpace: 'nowrap' }}
                                                variant='outlined'
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
                                        onClick={ () => {} }
                                    >
                                        <Typography component='h1' variant='h5'>
                                            Dados pessoais
                                        </Typography>
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <IconButton
                                        onClick={ () => {} }
                                    >
                                        <Edit />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12} style={{ padding: '4px 8px' }}>
                            <Typography component='p'><b>Nome: </b>{userProfileData.nome} {userProfileData.sobrenome}</Typography>
                        </Grid>

                        <Grid item xs={12} style={{ padding: '4px 8px' }}>
                            <Typography component='p'><b>Data de nascimento: </b>{userProfileData.dataNascimento ? `${userProfileData.dataNascimento.split('-')[2]}/${userProfileData.dataNascimento.split('-')[1]}/${userProfileData.dataNascimento.split('-')[0]}` : null}</Typography>
                        </Grid>

                        <Grid item xs={12} style={{ padding: '4px 8px' }}>
                            <Typography component='p' style={{ display: 'flex', alignItems: 'center' }}>
                                <span><b>CPF: </b>{userProfileData.cpf ? userProfileData.cpf : '***.***.***-**'}</span>
                                <IconButton 
                                    size='small'
                                    onClick={handleClickCpfVisibility}
                                    style={{ margin: '0 8px' }}
                                >
                                    {userProfileData.cpf ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </Typography>
                        </Grid>

                        <Grid item xs={12} style={{ padding: '4px 8px' }}>
                            <Typography component='p'><b>Telefone: </b>{userProfileData.telefone}</Typography>
                        </Grid>

                        <Grid item xs={12} style={{ padding: '4px 8px' }}>
                            <Typography component='p'><b>Descrição: </b>{userProfileData.descricao || 'Sem descrição'}</Typography>
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
                                        onClick={ () => {} }
                                    >
                                        <Typography component='h1' variant='h5'>
                                            Endereço
                                        </Typography>
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <IconButton
                                        onClick={ () => {} }
                                    >
                                        <Edit />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12} style={{ padding: '4px 8px' }}>
                            <Typography component='p'>
                                <b>CEP: </b>
                                {userAddressData.cep.substring(0, userAddressData.cep.length - 3) + '-' + userAddressData.cep.substring(userAddressData.cep.length - 3)}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} style={{ padding: '4px 8px' }}>
                            <Typography component='p'>
                                <b>Logradouro: </b>{userAddressData.logradouro}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} style={{ padding: '4px 8px' }}>
                            <Typography component='p'>
                                <b>Bairro: </b>{userAddressData.bairro}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} style={{ padding: '4px 8px' }}>
                            <Typography component='p'>
                                <b>Cidade: </b>{userAddressData.cidade}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} style={{ padding: '4px 8px' }}>
                            <Typography component='p'>
                                <b>UF: </b>{userAddressData.uf}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} style={{ padding: '4px 8px' }}>
                            <Typography component='p'>
                                <b>Número: </b>{userAddressData.numero}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} style={{ padding: '4px 8px' }}>
                            <Typography component='p'>
                                <b>Complemento: </b>{userAddressData.complemento || 'Sem complemento'}
                            </Typography>
                        </Grid>

                    </Grid>
                </Grid> {/* Fim - Dados do Endereço */}

            </Grid>

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
        openSnackbar: (message, severity) => { return dispatch( openSnackbar(message, severity) ) }
        // fetchAnnouncements: (page, limit) => { return dispatch( fetchAnnouncements(page, limit) ) },
        // fetchUser: () => { return dispatch ( fetchUser() ) },
    }
}

// Exportações.
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserAccDetails);