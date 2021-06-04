import * as snackbarActionTypes from './snackTypes';

/**
 * 
 * @param {string} message 
 * @param {('success'|'error'|'info'|'warning')} severity
 * @returns 
 */
export const openSnackbar = (message, severity) => {
    return { 
        type: snackbarActionTypes.OPEN_SNACKBAR_ALERT,
        message,
        severity
    }
}

export const closeSnackbar = () => {
    return {
        type: snackbarActionTypes.CLOSE_SNACKBAR_ALERT
    }
}