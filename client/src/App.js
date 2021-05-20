// Importações.
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import { store, persistor } from './redux/store';

import { BrowserRouter as Router } from 'react-router-dom';
import myRoutes from './Router';    // Função que entrega todas as rotas.


// Root Component.
function App() {
    return (
        <Provider store={ store }>
            <PersistGate loading={null} persistor={ persistor } >
                <Router>
                    <div className="App">
                        { myRoutes() }
                    </div>
                </Router>
            </PersistGate>
        </Provider>
    );
}

export default App;