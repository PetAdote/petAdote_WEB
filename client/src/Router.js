import { Switch, Route } from 'react-router-dom';

    // Componentes.
        import HomeContainer from './pages/HomeContainer';
        import LoginContainer from './pages/LoginContainer';
        import UserRegistration from './pages/UserRegistrationContainer';
        import UserProfileContainer from './pages/UserProfileContainer';
        // import NotFoundContainer from './pages/NotFoundContainer';

const myRoutes = () => (
    <Switch>
        <Route exact path="/">
            <HomeContainer />
        </Route>

        <Route path="/login">
            <LoginContainer />
        </Route>
        
        <Route path="/cadastro">
            <UserRegistration />
        </Route>

        <Route exact path="/user/:id">
            <UserProfileContainer />
        </Route>

        <Route path="*">
            {/* <NotFoundContainer /> */}
        </Route>
    </Switch>
)

export default myRoutes;