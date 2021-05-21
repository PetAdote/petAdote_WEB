import { Switch, Route } from 'react-router-dom';

    // Componentes.
        import HomeContainer from './pages/HomeContainer';
        import LoginContainer from './pages/LoginContainer';
        import NotFoundContainer from './pages/NotFoundContainer';

const myRoutes = () => (
    <Switch>
        <Route exact path="/">
            <HomeContainer />
        </Route>

        <Route path="/login">
            <LoginContainer />
        </Route>

        <Route path="*">
            <NotFoundContainer />
        </Route>
    </Switch>
)

export default myRoutes;