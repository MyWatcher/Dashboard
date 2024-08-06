// ErrorHandler.js
import { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/lab/Alert';

export default function ErrorHandler() {
    const [open, setOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleError = (message) => {
        setErrorMessage(message);
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    return (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error">
                {errorMessage}
            </Alert>
        </Snackbar>
    );
}