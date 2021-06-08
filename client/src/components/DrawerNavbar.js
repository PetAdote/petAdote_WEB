// Importações 
import React, { useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { connect } from 'react-redux';

// Utilidades.
import axios from '../helpers/axiosInstance';
import { makeStyles, useTheme } 
    from '@material-ui/core/styles';

// Componentes.
import { AppBar, Divider, Drawer, Hidden, IconButton, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography,
         Grid, Avatar, Badge }
    from '@material-ui/core';

import { Mail, Pets, Notifications, Home, Ballot, Inbox, Description, AccountCircle,
         Info, ExitToApp, Close }
    from '@material-ui/icons'

import UserAvatar from './UserAvatar';

// Actions.
import { clearUser, fetchUser }
    from '../redux/actions';

// Inicializações.
const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
    drawer: { // Limites do Drawer (Limita o tamanho da parte do display que possui o conteúdo).
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.0))',
        },
    },
    appBar: { // Navbar superior.
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
            display: 'none'
        },
        background: 'linear-gradient(rgba(63, 81, 181, 0.85), rgba(63, 81, 181, 0.85))'
    },
    menuButton: { // Botão "menu" que permite acessar o menu durante a navegação responsiva.
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    closeButton: {
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        }
    },
    // necessary for content to be below app bar.
    // toolbar: theme.mixins.toolbar,    // "toolbar" é uma referência ao espaço da AppBar, para ajeitar o conteúdo.
    drawerPaper: {    // O Drawer como vemos.
        width: drawerWidth,
        background: 'linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85))'
    },
    // custom styles unrelated to the AppBar and Drawer themselves.
    drawerHeadContainer: {
        // overflow: 'auto',
        background: 'rgb(225, 225, 225)',
        // backgroundRepeat: 'no-repeat',
        backgroundSize: `${drawerWidth + 10}px`,
        backgroundAttachment: 'fixed',
        backgroundPosition: 'top-left',
        padding: '5px 15px'
    },
    drawerHeadSubtext: {
        fontSize: '10pt'
    },
    // userAvatar: {
    //     width: theme.spacing(10),
    //     height: theme.spacing(10),
    //     boxShadow: '-3px 3px 5px 0px rgba(0, 0, 0, 0.3)',
    // },
    drawerMenuListItem: {
        // paddingTop: '0px',
        // paddingBottom: '0px'
    },
    customBadgeDot: {
        background: 'red',
        color: 'red'
    },
    toolbarButton: {
        // background: 'rgba(225, 225, 225, 0.5)',
        color: 'white',
        '&:hover': {
            // background: 'rgba(50, 50, 50, 0.5)',
            color: 'whitesmoke'
        }
    },
    link: {
        textDecoration: 'none',
        color: 'inherit'
    }

}));

// Functional Component.
function ResponsiveDrawer(props) {
    
    const pageTitle = 'PET ADOTE';  // * Implementar uma Reducer para metadados da "página".

    const styles = useStyles();
    const theme = useTheme();
    const history = useHistory();

    const [mobileOpen, setMobileOpen] = React.useState(false);

    const { window, clearUser, fetchUser } = props;
    const { user } = props.userData;    // Se não houver usuário, a navbar não será exibida.

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleDrawerClose = () => {
        setMobileOpen(false);
    };

    const handleLogout = async (ev) => {

        await axios.get('/auth/logout', {
            baseURL: 'http://localhost:4000',   // Domínio do Back-end da aplicação.
            withCredentials: true
        })
        .then((response) => {
            
            if (response.data === 'USER_DISCONNECTED_SUCCESSFULLY'){
                delete axios.defaults.headers.common['Authorization'];
                axios.defaults.withCredentials = false;
                clearUser();
                history.push('/login');
            }

            console.log(response.data);
            
        })
        .catch((error) => {
            console.log(error?.response?.data || error?.message);
        });

    }

    // let userAvatar = (
    //     <Badge
    //         anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    //         badgeContent={
    //             <Beenhere 
    //                 style={{ 
    //                     padding: '2px',
    //                     // border: '1px solid black',
    //                     // borderRadius: '50%',
    //                     // backgroundColor: 'whitesmoke',
    //                     color: user?.esta_ativo ? user?.e_admin ? 'blue' : 'green' : 'grey'
    //                 }}
    //                 titleAccess={user?.esta_ativo ? user?.e_admin ? 'Administrador' : 'Usuário Ativo' : 'Usuário Inativo'}
    //             />
    //         }
    //         overlap='circle'
    //     >
    //         <Avatar alt={user?.primeiro_nome + ' ' + user?.sobrenome} src={user?.download_avatar} className={styles.userAvatar} />
    //     </Badge>
    // );
    // if (user?.ong_ativo){
    //     userAvatar = (
    //         <Badge
    //             anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    //             badgeContent={
    //                 <Pets
    //                     style={{ 
    //                         padding: '2px',
    //                         // border: '1px solid black', 
    //                         borderRadius: '50%', 
    //                         backgroundColor: 'white',
    //                         boxShadow: '-1px 1px 5px rgba(0,0,0,0.5)',
    //                         color: 'green'
    //                     }}
    //                     titleAccess='ONG Verificada'
    //                 />
    //             }
    //             overlap='circle'
    //         >
    //         <Badge
    //             anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    //             badgeContent={
    //                 <Beenhere 
    //                     style={{ 
    //                         padding: '2px',
    //                         // border: '1px solid black',
    //                         borderRadius: '50%',
    //                         backgroundColor: 'white',
    //                         boxShadow: '-1px 1px 5px rgba(0,0,0,0.5)',
    //                         color: user?.esta_ativo ? user?.e_admin ? 'royalblue' : 'green' : 'grey'
    //                     }}
    //                     titleAccess={user?.esta_ativo ? user?.e_admin ? 'Administrador' : 'Usuário Ativo' : 'Usuário Inativo'}
    //                 />
    //             }
    //             overlap='circle'
    //         >
    //             <Avatar alt={user?.primeiro_nome + ' ' + user?.sobrenome} src={user?.download_avatar} className={styles.userAvatar} />
    //         </Badge>
    //         </Badge>
    //     );
    // }

    const drawer = (
        <div>

            <Grid container component='div' className={styles.drawerHeadContainer} style={{ backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0.75)), url(${user?.download_banner})` }}> {/* Início - Drawer Head */}

                <Grid item xs={12}> {/* Início - Título + Close Icon? */}
                    <Grid container alignItems='center' component='div'>
                        <Grid item xs={10}>
                            <Typography component="h1" variant='h6'>SEUS DADOS</Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <IconButton size='small' onClick={handleDrawerClose} className={styles.closeButton}>
                                <Close style={{ padding: '4px' }} />
                            </IconButton>
                            {/* Close icon */}
                        </Grid>
                    </Grid>
                </Grid> {/* Fim - Título + Close Icon? */}

                <Grid item xs={12} style={{ padding: '10px 0px' }}> {/* Início - Avatar, Nome, ID do Usuário */}
                    <Grid container component='div' spacing={1} >

                        <Grid item xs={4} style={{ textAlign: 'center' }}> {/* Avatar */}
                            <IconButton style={{padding: '0px'}} onClick={ () => { history.push(`/user/${user?.cod_usuario}`) } }>
                                <UserAvatar user={user} width='80px' height='80px' showOngBadge showUserTypeBadge />
                            </IconButton>
                        </Grid>

                        <Grid item xs={8}>
                            <Grid container component='div'>

                                <Grid item xs={12}> {/* Nome do Usuário */}
                                    <Typography component="p" title={user?.primeiro_nome + ' ' + user?.sobrenome} noWrap>
                                        <b>{user?.primeiro_nome + ' ' + user?.sobrenome}</b>
                                    </Typography>
                                </Grid>

                                <Grid item xs={12}> {/* ID do Usuário */}
                                    <Typography component="p" title={'ID: ' + user?.cod_usuario}><b>ID: </b>{user?.cod_usuario}</Typography>
                                </Grid>

                                <Grid item xs={12}> {/* Ícones */}
                                    <Grid container component='div' wrap='nowrap' direction='row-reverse' style={{ overflowX: 'auto', overflowY: 'hidden' }}>
                                        
                                        <Grid item component='div' onClick={() => { console.log('Mostrar notificações.'); }}>
                                            <IconButton size='small'>
                                                <Badge
                                                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                                    badgeContent=' '
                                                    variant='dot'
                                                    overlap='circle'
                                                    invisible={user?.ong_ativo === '1' ? true : false}  // Flag para indicar novas notificações.
                                                    classes={{
                                                        'dot': styles.customBadgeDot
                                                    }}
                                                >
                                                    <Notifications />
                                                </Badge>
                                            </IconButton>
                                        </Grid>

                                        <Grid item component='div' onClick={() => { console.log('Mostrar mensagens.'); }}>
                                            <IconButton size='small'>
                                                <Badge
                                                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                                    badgeContent=' '
                                                    variant='dot'
                                                    overlap='circle'
                                                    invisible={user?.ong_ativo === '1' ? true : false}  // Flag para indicar novas mensagens.
                                                    classes={{
                                                        'dot': styles.customBadgeDot
                                                    }}
                                                >
                                                    <Mail />
                                                </Badge>
                                            </IconButton>
                                        </Grid>

                                    </Grid>
                                </Grid>

                            </Grid>
                        </Grid>

                    </Grid>
                </Grid>{/* Fim - Avatar, Nome, ID do Usuário */}

                <Grid item xs={12}> {/* Início - Seguindo e Seguidores */}
                    <Grid container spacing={1} component='div'>

                        <Grid item xs={6}>
                            <Typography component="p" className={styles.drawerHeadSubtext} noWrap title={'Seguindo: ' + user?.qtd_seguidos}>
                                <b>Seguindo: </b>{user?.qtd_seguidos}
                            </Typography>
                        </Grid>

                        <Grid item xs={6}>
                            <Typography component="p" className={styles.drawerHeadSubtext} noWrap title={'Seguidores: ' + user?.qtd_seguidores}>
                                <b>Seguidores: </b>{user?.qtd_seguidores}
                            </Typography>
                        </Grid>

                    </Grid>
                </Grid> {/* Fim - Seguindo e Seguidores */}
                
            </Grid> {/* Fim - Drawer Head */}

            <Divider />

            <Grid container component='div' style={{ padding: '5px 8px 5px 0px' /* Necessário por causa do spacing do container abaixo */}}> {/* Início - Drawer Moments Component */}
                <Grid item xs={12}>

                    <Grid container component='div' wrap='nowrap' spacing={1} style={{margin: '0', padding: '0', overflow:'auto'}}>

                        {
                            ['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((value, index) => {
                                return (
                                    <Grid item key={value + index}>
                                        <IconButton style={{padding: '0px'}} onClick={ () => { console.log('Exibir momento.') }}>
                                            <Avatar alt={value} src='/' />
                                        </IconButton>
                                    </Grid>
                                );
                            })
                        }

                    </Grid>

                </Grid>
            </Grid> {/* Fim - Drawer Moments Component */}

            <Divider />

            <List style={{ overflow: 'hidden' }}>  {/* Início - Drawer Menu */}

                {/* <Link to='/' className={styles.link}> */}
                    <ListItem component={Link} to='/' button className={styles.drawerMenuListItem} onClick={handleDrawerClose} key='menu_home' >
                            <ListItemIcon><Home /></ListItemIcon>
                            <ListItemText 
                                primary={<Typography noWrap>Início</Typography>}
                            />
                    </ListItem>
                {/* </Link> */}

                <ListItem component='button' button onClick={ () => { console.log('Exibir minha lista de pets.') } } className={styles.drawerMenuListItem} key='menu_myPets'>
                    <ListItemIcon><Pets /></ListItemIcon>
                    <ListItemText 
                        primary={<Typography noWrap>Meus pets</Typography>}
                    />
                </ListItem>

                <ListItem component='button' button onClick={ () => { console.log('Exibir minhas publicações (Anúncios e Postagens).') } } className={styles.drawerMenuListItem} key='menu_myPublications'>
                    <ListItemIcon><Ballot /></ListItemIcon>
                    <ListItemText 
                        primary={<Typography noWrap>Minhas publicações</Typography>}
                    />
                </ListItem>

                <ListItem component='button' button onClick={ () => { console.log('Exibir a lista anúncios nos quais possuo uma candidatura.') } } className={styles.drawerMenuListItem} key='menu_myCandidatures'>
                    <ListItemIcon><Inbox /></ListItemIcon>
                    <ListItemText 
                        primary={<Typography noWrap>Minhas candidaturas</Typography>}
                    />
                </ListItem>

                <ListItem component='button' button onClick={ () => { console.log('Exibir minha lista de termos de responsabilidades em adoções aprovadas.') } } className={styles.drawerMenuListItem} key='menu_myDocs'>
                    <ListItemIcon><Description /></ListItemIcon>
                    <ListItemText 
                        primary={<Typography noWrap>Meus documentos</Typography>}
                    />
                </ListItem>

                <ListItem component='button' button onClick={ () => { console.log('Exibir minha conta.') } } className={styles.drawerMenuListItem} key='menu_myAccount'>
                    <ListItemIcon><AccountCircle /></ListItemIcon>
                    <ListItemText 
                        primary={<Typography noWrap>Minha conta</Typography>}
                    />
                </ListItem>

                <ListItem component='button' button onClick={handleLogout} className={styles.drawerMenuListItem} key='menu_logout'>
                    <ListItemIcon><ExitToApp /></ListItemIcon>
                    <ListItemText 
                        primary={<Typography noWrap>Sair</Typography>}
                    />
                </ListItem>

                <ListItem component='button' button onClick={ () => { console.log('Exibir página institucional.') } } className={styles.drawerMenuListItem} key='menu_aboutUs'>
                    <ListItemIcon><Info /></ListItemIcon>
                    <ListItemText 
                        primary={<Typography noWrap>Sobre Pet Adote</Typography>}
                    />
                </ListItem>

            </List> {/* Fim - Drawer Menu */}

        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <>
        { user ? <>
            <AppBar position="fixed" className={styles.appBar}>  {/* AppBar = Top Navbar */}

                <Toolbar>

                    <Grid container component='div' alignItems='center' wrap='nowrap' spacing={1} style={{ overflow: 'auto' }}>

                        <Grid item xs={8} > {/* Início - AppBar Menu Toggle & App Title */}

                            <Grid container component='div' wrap='nowrap' alignItems='center' style={{ overflow: 'auto' }}>

                                <Grid item>
                                    <IconButton
                                        aria-label="toolbar_openmenu"
                                        size='small'
                                        // onClick={ () => { console.log('Expandir menu de navegação'); }}
                                        onClick={handleDrawerToggle}
                                        className={styles.menuButton}
                                    >
                                        {/* <Avatar
                                            alt={user?.primeiro_nome + ' ' + user?.sobrenome}
                                            src={user?.download_avatar}
                                            style={{
                                                border: '2px solid rgba(0,0,0,0.25)'
                                            }}
                                            sizes='small'
                                        /> */}
                                        <UserAvatar user={user} width='36px' height='36px' customStyle={{ border: '2px solid rgba(0,0,0,0.25)' }} />
                                    </IconButton>
                                </Grid>

                                <Grid item>
                                    <Typography variant='h6' noWrap title={pageTitle}>      {/* Título */}
                                        {pageTitle}
                                    </Typography>
                                </Grid>

                            </Grid>
                            
                        </Grid> {/* Fim - AppBar Menu Toggle & App Title */}

                        <Grid item xs={4}> {/* Início - AppBar Shortcuts */}

                            <Grid container component='div' wrap='nowrap' direction='row-reverse' alignItems='center' style={{ overflow: 'auto' }} >

                                <Grid item component='div' style={{padding: '0'}}>
                                    <IconButton aria-label="toolbar_notificationshortcut" className={styles.toolbarButton} onClick={() => { console.log('Mostrar notificações.'); }} >
                                        <Badge
                                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                            badgeContent=' '
                                            variant='dot'
                                            overlap='circle'
                                            invisible={user?.ong_ativo === '1' ? true : false}  // Flag para indicar novas notificações.
                                            classes={{
                                                'dot': styles.customBadgeDot
                                            }}
                                        >
                                            <Notifications />
                                        </Badge>
                                    </IconButton>
                                </Grid>

                                <Grid item component='div' style={{padding: '0'}}>
                                    <IconButton aria-label="toolbar_messageshortcut" className={styles.toolbarButton}  onClick={() => { console.log('Mostrar mensagens.'); }}>
                                        <Badge
                                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                            badgeContent=' '
                                            variant='dot'
                                            overlap='circle'
                                            invisible={user?.ong_ativo === '1' ? true : false}  // Flag para indicar novas mensagens.
                                            classes={{
                                                'dot': styles.customBadgeDot
                                            }}
                                        >
                                            <Mail />
                                        </Badge>
                                    </IconButton>
                                </Grid>
                                
                            </Grid>
                            
                        </Grid>

                    </Grid>



                    {/* <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        className={styles.menuButton}
                    >
                        <Menu />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        Responsive drawer
                    </Typography> */}
                </Toolbar>

            </AppBar>

            <nav className={styles.drawer} aria-label="mailbox folders">

                <Hidden smUp implementation="css">  {/* Drawer no Mobile */}
                    <Drawer
                        container={container}
                        variant="temporary"
                        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        classes={{
                            paper: styles.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                    >
                        {drawer}
                    </Drawer>
                </Hidden>

                <Hidden xsDown implementation="css">  {/* Drawer no Desktop */}
                    <Drawer
                        classes={{
                            paper: styles.drawerPaper,
                        }}
                        variant="permanent"
                        open
                    >
                        {drawer}
                    </Drawer>
                </Hidden>

            </nav>
            </>
        : null }
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
        fetchUser: () => { return dispatch( fetchUser() ) },
        clearUser: () => { return dispatch( clearUser() ) }
    }
}

// Exportações.
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ResponsiveDrawer);
