// Importações.
import { useState, useEffect, useRef, useCallback } from 'react';
import { connect } from 'react-redux';

// Utilidades.

// Actions.
import { fetchAnnouncements, openSnackbar }
    from '../redux/actions';

// Componentes.
import { Grow } 
    from '@material-ui/core';

import AnnouncementsItem from '../components/AnnouncementsItem';

// Inicializações.

// Functional Component.
const AnnouncementsList = (props) => {

    const fetchLimit = 10;   // Limite da quantidade de dados que será buscada na rest api. Se não for definida, o padrão é 10 dados por busca.

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