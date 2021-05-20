import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './rootReducer';


// Configurações da Redux-Persist.
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

    
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user']   // Útil para armazenar somente os dados de reducers específicas.
}

const persistedReducer = persistReducer(persistConfig, rootReducer);
    // Note que nosso "rootReducer" contendo a unificação dos reducers, será gerenciado pelo redux-persist.
    // Agora nosso "persistedReducer" possuirá o "rootReducer", e pode ser passado para a createStore do Redux.

    // No final das configurações, não esqueça de configurar a Persist Gate da integração com React, no Root Component, dentro da Provider do React-Redux.

// Fim das configurações da Redux-Persist.

const store = createStore(
    persistedReducer,
    composeWithDevTools(
        applyMiddleware(thunk)    
    )
);

const persistor = persistStore(store);  // Um persistor funciona como o Store, porém permite a persistencia da State.

export { store, persistor };