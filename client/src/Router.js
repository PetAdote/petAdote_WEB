import { Switch, Route } from 'react-router-dom';

    // Componentes.
        import HomeContainer from './pages/HomeContainer';

        import LoginContainer from './pages/LoginContainer';
        import UserRegistrationContainer from './pages/UserRegistrationContainer';

        import UserProfileContainer from './pages/UserProfileContainer';
        import UserAccDetailsPage from './pages/UserAccDetailsPage';
        // import NotFoundContainer from './pages/NotFoundContainer';
        import AdoptionValidationPage from './pages/AdoptionValidationPage';

const myRoutes = () => (
    <Switch>
        <Route exact path="/">
            <HomeContainer />
        </Route>

        <Route path="/login">
            <LoginContainer />
        </Route>
        
        <Route path="/cadastro">
            <UserRegistrationContainer />
        </Route>

        <Route exact path="/usuario/:id">
            <UserProfileContainer />
        </Route>

        <Route exact path="/usuario/:id/detalhes">
            <UserAccDetailsPage />
        </Route>

        <Route exact path="/validar/">
            <AdoptionValidationPage />
        </Route>

        <Route path="*">
            {/* <NotFoundContainer /> */}
        </Route>
    </Switch>
)

export default myRoutes;