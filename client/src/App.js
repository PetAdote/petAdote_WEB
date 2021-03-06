// Importações.
import { useEffect, createRef } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import { store, persistor } from './redux/store';

import { BrowserRouter as Router } from 'react-router-dom';
import myRoutes from './Router';    // Função que entrega todas as rotas.

import ScrollToTop from './components/ScrollToTop';     // 'HOC' que retorna a página para o topo durante o primeiro carregamento.

import { unstable_createMuiStrictModeTheme, ThemeProvider, makeStyles } from '@material-ui/core/styles';    // Provedor Experimental de temas da MUI.
import { CssBaseline, IconButton } from '@material-ui/core';

import { Close } from '@material-ui/icons';

import DrawerNavbar from './components/DrawerNavbar';

import { SnackbarProvider } from 'notistack';

// Componentes.
import Footer from './components/Footer';
import SnackbarAlert from './components/SnackbarAlert';

// Inicializações.
const theme = unstable_createMuiStrictModeTheme();

// Estilização das divs principais.
const useStyles = makeStyles((theme) => {

    return {
        toolbar: theme.mixins.toolbar,    // "toolbar" é uma referência ao espaço da AppBar (NavBar), para ajeitar o conteúdo.
        content: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            minHeight: '100vh',
            overflow: 'hidden',  // Garante que o conteúdo não vai extrapolar os limites da tela.
            // flex: 1,
            // height: "100vh",
            // padding: theme.spacing(3),
            // backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://source.unsplash.com/random)",
            // backgroundRepeat: "no-repeat",
            // backgroundSize: "cover",
            // backgroundAttachment: "fixed",
            // backgroundPosition: "center",
        },
    }

});

// Root Component.
function App() {

    const styles = useStyles();

    const notistackRef = createRef();
    const handleCloseSnackbar = key => () => {
        notistackRef.current.closeSnackbar(key);
    }

    return (
        <Provider store={ store }>
            <PersistGate loading={null} persistor={ persistor } >
                <ThemeProvider theme={theme}>
                    <SnackbarProvider ref={notistackRef} maxSnack={5} anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }} 
                        action={(key) => (
                            <IconButton size="small" onClick={handleCloseSnackbar(key)}>
                                <Close fontSize="small" style={{ color: 'white' }}/>
                            </IconButton>
                        )}
                    >
                        <Router>
                            <CssBaseline />         {/* CSS resets */}
                            <ScrollToTop />         {/* Browser navigation scroll fix */}
                            <div className="App">
                                <DrawerNavbar />    {/* Navbar + Drawer */}
                                <div className={styles.content}>    {/* All content */}
                                    { myRoutes() }
                                    <SnackbarAlert />   {/* Snackbar Alert for validations */}
                                    <Footer />    {/* Footer */}
                                </div>
                            </div>
                        </Router>
                    </SnackbarProvider>
                </ThemeProvider>
            </PersistGate>
        </Provider>
    );
}

export default App;