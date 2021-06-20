// Importações.
import PropTypes from 'prop-types';

// Utilidades.
import { makeStyles } 
    from '@material-ui/core/styles';

// Actions.

// Componentes.
import { Avatar, Badge }
    from '@material-ui/core';

import { Beenhere, Pets }
    from '@material-ui/icons'

// Inicializações.

// Functional Component.
const UserAvatar = (props) => {
    
    const {
        user, 
        avatarUrl,
        width = '80px',
        height = '80px',
        badgesWidth = '24px',
        badgesHeight = '24px',
        showUserTypeBadge = false,
        showOngBadge = false,
        customStyle = {}
    } = props;

    const useStyles = makeStyles((theme) => {
        return {
            userAvatar: {
                width: width,
                height: height,
                boxShadow: '-3px 3px 5px 0px rgba(0, 0, 0, 0.3)',
            },
        }
    });

    const styles = useStyles();

    let userAvatar = (
        <Badge
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
                <Beenhere 
                    style={{ 
                        padding: '2px',
                        // border: '1px solid black',
                        width: badgesWidth,
                        height: badgesHeight,
                        borderRadius: '50%',
                        // backgroundColor: 'white',
                        boxShadow: '-1px 1px 5px rgba(0,0,0,0.5)',
                        color: user?.esta_ativo ? user?.e_admin ? 'royalblue' : 'green' : 'grey'
                    }}
                    titleAccess={user?.esta_ativo ? user?.e_admin ? 'Administrador' : 'Usuário Ativo' : 'Usuário Inativo'}
                />
            }
            overlap='circle'
            invisible={showUserTypeBadge ? false : true }
        >
            <Avatar alt={user?.primeiro_nome + ' ' + user?.sobrenome} src={avatarUrl || user?.download_avatar || user?.download_foto?.split(' ')?.[1]} className={styles.userAvatar} style={customStyle} />
        </Badge>
    );
    if (user?.ong_ativo){
        userAvatar = (
            <Badge
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                badgeContent={
                    <Pets
                        style={{ 
                            padding: '2px',
                            // border: '1px solid black', 
                            width: badgesWidth,
                            height: badgesHeight,
                            borderRadius: '50%', 
                            // backgroundColor: 'white',
                            boxShadow: '-1px 1px 5px rgba(0,0,0,0.5)',
                            color: 'green'
                        }}
                        titleAccess='ONG Verificada'
                    />
                }
                overlap='circle'
                invisible={showOngBadge ? false : true }
            >
            <Badge
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                    <Beenhere 
                        style={{ 
                            padding: '2px',
                            // border: '1px solid black',
                            width: badgesWidth,
                            height: badgesHeight,
                            borderRadius: '50%',
                            // backgroundColor: 'white',
                            boxShadow: '-1px 1px 5px rgba(0,0,0,0.5)',
                            color: user?.esta_ativo ? user?.e_admin ? 'royalblue' : 'green' : 'grey'
                        }}
                        titleAccess={user?.esta_ativo ? user?.e_admin ? 'Administrador' : 'Usuário Ativo' : 'Usuário Inativo'}
                    />
                }
                overlap='circle'
                invisible={showUserTypeBadge ? false : true }
            >
                <Avatar alt={user?.primeiro_nome + ' ' + user?.sobrenome} src={avatarUrl || user?.download_avatar || user?.download_foto?.split(' ')?.[1]} className={styles.userAvatar} style={customStyle} />
            </Badge>
            </Badge>
        );
    }

    return userAvatar;
}

UserAvatar.propTypes = {
    user: PropTypes.object,
    avatarUrl: PropTypes.string,
    width: PropTypes.string,
    height: PropTypes.string,
    badgesWidth: PropTypes.string,
    badgesHeight: PropTypes.string,
    showUserTypeBadge: PropTypes.bool,
    showOngBadge: PropTypes.bool,
    customStyle: PropTypes.object
}
 
// Exportações.
export default UserAvatar;