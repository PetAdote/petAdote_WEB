// Importações.
import PropTypes from 'prop-types';

// Utilidades.

// Actions.

// Components.

// Inicializações.

// Functional Component.
const TabPanel = (props) => {

    const { children, value, index, ...other } = props

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`content-tabpanel-${index}`}
            aria-labelledby={`content-tab-${index}`}
            { ...other }
        >
            { value === index && 
                (
                    children
                )
            }
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
}
 
export default TabPanel;