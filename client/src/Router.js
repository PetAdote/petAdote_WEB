import { Switch, Route } from 'react-router-dom';

    // Componentes.
        // import HomeContainer from './pages/HomeContainer';
        import HomeContainer from './pages/HomeContainer';
        // import LoginContainer from './pages/LoginContainer';
        import LoginContainer from './pages/LoginContainer';
        // import NotFoundContainer from './pages/NotFoundContainer';
        // import DrawerNavbar from './components/DrawerNavbar';

const myRoutes = () => (
    <Switch>
        <Route exact path="/">
            {/* <DrawerNavbar /> */}
            {/* <HomeContainer /> */}
            <HomeContainer />
        </Route>

        <Route path="/login">
            <LoginContainer />
            {/* <LoginContainer /> */}
        </Route>

        <Route path="*">
            {/* <NotFoundContainer /> */}
        </Route>
    </Switch>
)

export default myRoutes;