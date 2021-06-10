// Importações.
import { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// Utilidades.
import { makeStyles }
    from '@material-ui/core/styles';

// Actions.
import { fetchAnnouncements }
    from '../redux/actions';

// Componentes.
import { Grid } 
    from '@material-ui/core';

// Inicializações.

// Functional Component.
const AnnouncementsContainer = (props) => {

    const {children, announcementWidth = 312, fetchAnnouncements} = props;

    useEffect(() => {
        // Simulação do infinite scrolling.
        // setTimeout(() => {
            // fetchAnnouncements(1, 1);
        // }, 500);
        // setTimeout(() => {
        //     fetchAnnouncements(2, 1);
        // }, 1000);
        // setTimeout(() => {
        //     fetchAnnouncements(3, 1);
        // }, 1500);
        // setTimeout(() => {
        //     fetchAnnouncements(4, 1);
        // }, 2000);
        // setTimeout(() => {
        //     fetchAnnouncements(5, 1);
        // }, 2500);
    }, [fetchAnnouncements]);

    const useStyles = makeStyles((theme) => {
        return {
            announcementsContainer: {
                margin: '0 auto',
                padding: '8px 0',
                // marginTop: `${theme.mixins.toolbar.minHeight + 8}px`,
                [theme.breakpoints.down('xs')]: {
                    marginTop: `${theme.mixins.toolbar.minHeight}px`,
                },
                [theme.breakpoints.between('455', '599')]: {
                    marginTop: `${theme.mixins.toolbar.minHeight - 8}px`,
                },
                // [theme.breakpoints.only('sm')]: {
                //     marginTop: `${theme.mixins.toolbar.minHeight + 8}px`,
                // },
                [theme.breakpoints.down('sm')]: {
                    justifyContent: 'center',
                },
                [theme.breakpoints.only('md')]: {
                    maxWidth: `${announcementWidth * 2}px`,
                },
                [theme.breakpoints.only('lg')]: {
                    maxWidth: `${announcementWidth * 3}px`,
                },
                [theme.breakpoints.up('xl')]: {
                    maxWidth: `${announcementWidth * 5}px`,
                }
            }
        }
    });

    const styles = useStyles();

    return (
        <Grid container component="div" className={styles.announcementsContainer}>  {/* Início - Container de Anúncios */}
            {children}
        </Grid>
    );
}

AnnouncementsContainer.propTypes = {
    announcementWidth: PropTypes.number,
}

// Exportações.
// export default AnnouncementsContainer;

// Redux Store Mapping.
const mapStateToProps = (state) => {
    return {
        // announcementsData: state.announcements
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAnnouncements: (page, limit) => { return dispatch( fetchAnnouncements(page, limit) ) },
        // fetchUser: () => { return dispatch ( fetchUser() ) },
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AnnouncementsContainer);