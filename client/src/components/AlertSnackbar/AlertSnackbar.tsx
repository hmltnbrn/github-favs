import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { FC, forwardRef } from 'react';

type Props = {
    severity: 'success' | 'error' | 'warning' | 'info';
    isOpen: boolean;
    message: string | null;
    handleClose: () => void;
};

const Alert = forwardRef<HTMLDivElement, AlertProps>(
    function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    },
);

const AlertSnackbar: FC<Props> = ({
    severity,
    isOpen,
    message,
    handleClose,
}) => {
    return (
        <Snackbar open={isOpen} autoHideDuration={6000} onClose={handleClose}>
            <Alert
                onClose={handleClose}
                severity={severity}
                sx={{ width: '100%' }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

export default AlertSnackbar;
