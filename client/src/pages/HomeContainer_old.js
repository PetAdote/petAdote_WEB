// Importações.
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';  // Responsável por fazer a subscription do nosso Componente React ao Redux Store.

// Utilidades.
import axios from '../helpers/axiosInstance';
import { makeStyles }
    from '@material-ui/core/styles';

// Actions.
import { clearUser } 
    from '../redux/actions';

// Components.
import { Container, Grid, Typography, Button, Avatar } 
    from '@material-ui/core';

// Inicializações.
const useStyles = makeStyles((theme) => {

});

// Functional Component.
const Home = (props) => {

    const styles = useStyles();
    const history = useHistory();

    const { user } = props.userData;
    const { clearUser } = props;

    useEffect(() => {

        if (!user){
            history.push('/login');
        }

    }, [user, history])


    const handleLogout = (ev) => {

        axios.get('/auth/logout', {
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

    return (
        <>
        </>
    )


    // return ( 
    // <> 
    // { user ?
    //     <>
    //     {/* <Container maxWidth disableGutters component='div'> */}
    //         <Grid container component='main' style={{ flex: 1 }}>
    //             <Grid item cs={12}>
    //                 <Typography paragraph>
    //                     Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
    //                     ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent elementum
    //                     facilisis leo vel. Risus at ultrices mi tempus imperdiet. Semper risus in hendrerit
    //                     gravida rutrum quisque non tellus. Convallis convallis tellus id interdum velit laoreet id
    //                     donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
    //                     adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra nibh cras.
    //                     Metus vulputate eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo quis
    //                     imperdiet massa tincidunt. Cras tincidunt lobortis feugiat vivamus at augue. At augue eget
    //                     arcu dictum varius duis at consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem
    //                     donec massa sapien faucibus et molestie ac.
    //                 </Typography>
    //             </Grid>
    //             <Grid item cs={12}>
    //                 <Typography paragraph>
    //                     Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
    //                     ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent elementum
    //                     facilisis leo vel. Risus at ultrices mi tempus imperdiet. Semper risus in hendrerit
    //                     gravida rutrum quisque non tellus. Convallis convallis tellus id interdum velit laoreet id
    //                     donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
    //                     adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra nibh cras.
    //                     Metus vulputate eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo quis
    //                     imperdiet massa tincidunt. Cras tincidunt lobortis feugiat vivamus at augue. At augue eget
    //                     arcu dictum varius duis at consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem
    //                     donec massa sapien faucibus et molestie ac.
    //                 </Typography>
    //             </Grid>
    //         </Grid>
            
    //     {/* </Container> */}
    //     <Grid container component='footer' style={{ backgroundColor: '#2c2b2e' }}>
    //             <Grid item xs={12}>
    //                 <Typography component="p" align='center' style={{ color: '#e8e8e8' }}>Copyright © Sistemas Pet Adote 2021.</Typography>
    //             </Grid>
    //         </Grid>
    //     {/* <Grid container component='footer' style={{ backgroundColor: '#2c2b2e' }}>
    //         <Grid item xs={12}>
    //             <Typography component="p" align='center' style={{ color: '#e8e8e8' }}>Copyright © Sistemas Pet Adote 2021.</Typography>
    //         </Grid>
    //     </Grid> */}
    //     </>
        
    //     // <>
    //     // <Container disableGutters className={styles.container} >
            
    //     //     <div className={styles.toolbar} />
    //     //     <Grid container component='main' className={styles.content}>

    //     //         <Grid item xs={12} className={styles.mainItem}>
    //     //             <Typography component="h1" align='center' style={{ color: '#e8e8e8' }}>Homepage</Typography>
    //     //         </Grid>
    //     //         <Grid item xs={12} className={styles.mainItem}>
    //     //             <Typography paragraph>
    //     //                 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
    //     //                 ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent elementum
    //     //                 facilisis leo vel. Risus at ultrices mi tempus imperdiet. Semper risus in hendrerit
    //     //                 gravida rutrum quisque non tellus. Convallis convallis tellus id interdum velit laoreet id
    //     //                 donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
    //     //                 adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra nibh cras.
    //     //                 Metus vulputate eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo quis
    //     //                 imperdiet massa tincidunt. Cras tincidunt lobortis feugiat vivamus at augue. At augue eget
    //     //                 arcu dictum varius duis at consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem
    //     //                 donec massa sapien faucibus et molestie ac.
    //     //             </Typography>
    //     //         </Grid>
    //     //         <Grid item xs={12} className={styles.mainItem}>
    //     //             <Typography paragraph>
    //     //                 Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper eget nulla
    //     //                 facilisi etiam dignissim diam. Pulvinar elementum integer enim neque volutpat ac
    //     //                 tincidunt. Ornare suspendisse sed nisi lacus sed viverra tellus. Purus sit amet volutpat
    //     //                 consequat mauris. Elementum eu facilisis sed odio morbi. Euismod lacinia at quis risus sed
    //     //                 vulputate odio. Morbi tincidunt ornare massa eget egestas purus viverra accumsan in. In
    //     //                 hendrerit gravida rutrum quisque non tellus orci ac. Pellentesque nec nam aliquam sem et
    //     //                 tortor. Habitant morbi tristique senectus et. Adipiscing elit duis tristique sollicitudin
    //     //                 nibh sit. Ornare aenean euismod elementum nisi quis eleifend. Commodo viverra maecenas
    //     //                 accumsan lacus vel facilisis. Nulla posuere sollicitudin aliquam ultrices sagittis orci a.
    //     //             </Typography>
    //     //         </Grid>
    //     //         <Grid item xs={12} style={{ flex: 1}}>
    //     //             <Grid container component='footer' style={{ backgroundColor: '#2c2b2e' }}>
    //     //                 <Grid item xs={12}>
    //     //                     <Typography component="p" align='center' style={{ color: '#e8e8e8' }}>Copyright © Sistemas Pet Adote 2021.</Typography>
    //     //                 </Grid>
    //     //             </Grid>
    //     //         </Grid>
                
    //     //     </Grid>

    //     // </Container>
    //     // </>
    // : null }
    // </>
    // );

}

// const useStyles = makeStyles((theme) => {

//     return {
//         container: {
//             display: 'flex',
//             flexDirection: 'column'
//         },
//         content: {
//             flex: 1,
//             alignItems: 'center',
//             justifyContent: 'center',
//             padding: theme.spacing(0),
//             overflow: 'auto'
//             // backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://source.unsplash.com/random)',
//             // backgroundRepeat: 'no-repeat',
//             // backgroundSize: 'cover',
//             // backgroundAttachment: 'fixed',
//             // backgroundPosition: 'center',
//         },
//         paper: {
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             backgroundColor: 'rgba(255, 255, 255, 0.75)',
//             padding: '20px',
//             border: '1px solid black',
//             borderRadius: '10px',
//         },
//         form: {
//             display: 'flex',
//             flexDirection: 'column',
//             width: '100%'
//         },
//         input: {
//             color: 'black',
//         },
//         inputBorder: {
//             "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
//                 borderColor: "black"
//             },
//             "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
//                 borderColor: "green"
//             },
//             "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
//                 borderColor: "black"
//             },
//             "& .MuiOutlinedInput-input": {
//                 color: "black"
//             },
//             "&:hover .MuiOutlinedInput-input": {
//                 color: "green"
//             },
//             "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": {
//                 color: "black"
//             },
//             "& .MuiInputLabel-outlined": {
//                 color: "black"
//             },
//             "&:hover .MuiInputLabel-outlined": {
//                 color: "green"
//             },
//             "& .MuiInputLabel-outlined.Mui-focused": {
//                 color: "black"
//             }
//         },
//         mainItem: {
//             padding: '5px 20px'
//         },
//         toolbar: theme.mixins.toolbar
//     }

// });


// Redux Store Mapping.
const mapStateToProps = (state) => {
    return {
        userData: state.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        clearUser: () => { return dispatch ( clearUser() ) },
        // fetchUser: () => { return dispatch ( fetchUser() ) },
    }
}
 
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);
