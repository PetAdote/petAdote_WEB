// Importações.
import { useState, useEffect, useRef, useCallback } from 'react';
import { connect } from 'react-redux';

// Utilidades.
import { makeStyles }
    from '@material-ui/core/styles';

// Actions.
import { fetchAnnouncements, openSnackbar }
    from '../redux/actions';

// Componentes.
import { Grow } 
    from '@material-ui/core';

import AnnouncementsItem from '../components/AnnouncementsItem';

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
const AnnouncementsList = (props) => {

    const fetchLimit = 1;   // Limite da quantidade de dados que será buscada na rest api. Se não for definida, o padrão é 10 dados por busca.

    const [pageToFetch, setPageToFetch] = useState(1);

    const { loading, announcements, hasMore } = props.announcementsData;
    const { fetchAnnouncements, openSnackbar } = props;

    // Sistema de Scrolling Infinito trabalhando em conjunto com a Paginação da REST API.
    const observer = useRef();  // Refs são úteis para capturar referências de dados que não fazem parte da nossa state.

    const lastElement = useCallback((node) => { 
        // Nesse caso, lastElement será uma ref à um elemento no DOM.

        // A utilização conjunta do do hook "useCallback" com "useRef" permite a re-renderização do
        // componente de acordo com as dependencias do hook.

        // useCallback, age de forma similar ao useMemo, porém retorna não só o resultado, mas toda a função, isso permite que a chamada aceite parâmetros.
        // Além disso, o mesmo princípio de executar a função somente quando alguma das dependencias sofrer
        // alterações e não durante as renderizações, é aplicado.
        if (loading) { 
            return
        }

        if (observer.current) {
            // "Limpa" a ref se já estiver vínculada à um intersection com um node (Elemento DOM).
            // Permitindo a reconfiguração quando um novo "último" elemento receber a ref.
            observer.current.disconnect();
        }

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore){
                setPageToFetch( (oldVal) => { return oldVal + 1 } );
                console.log('page:', pageToFetch);
                fetchAnnouncements(pageToFetch, fetchLimit);
            }

            if (entries[0].isIntersecting && !hasMore){
                openSnackbar('Fim da lista de anúncios.', 'info');
            }
        });
        
        if (node) {
            observer.current.observe(node);
        }
        
    }, [loading, hasMore, fetchAnnouncements, openSnackbar, pageToFetch]);

    useEffect(() => {
        if (!announcements){
            fetchAnnouncements(pageToFetch, fetchLimit);
        }
        
    }, [announcements, fetchAnnouncements, pageToFetch]);

    // Observe na renderização do componente, que o último "announcement item" renderizado sempre possuirá 
    // a ref "lastElement".

    // Fim do sistema de Scrolling Infinito.

    
    const styles = useStyles();

    return (
        <>
        {
            announcements ?
                announcements.map((announcement, index) => {

                    if (announcements.length === index + 1){
                        return (
                            <Grow key={announcement.cod_anuncio} ref={lastElement} in timeout={1000}>
                                <div>
                                    <AnnouncementsItem announcement={announcement} />
                                </div>
                            </Grow>
                        );
                    }

                    return (
                        <Grow key={announcement.cod_anuncio} in timeout={1000}>
                            <div>
                                <AnnouncementsItem announcement={announcement} />
                            </div>
                        </Grow>
                    );

                })
            : null
        }
        </>
        
    );
}

// Redux Store Mapping.
const mapStateToProps = (state) => {
    return {
        announcementsData: state.announcements
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAnnouncements: (page, limit) => { return dispatch( fetchAnnouncements(page, limit) ) },
        openSnackbar: (message, severity) => { return dispatch( openSnackbar(message, severity) ) },
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AnnouncementsList);