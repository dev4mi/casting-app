import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

// Custom Alert component using forwardRef
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CustomSnackbar = ({ open, onClose, alert }) => {
  // Map danger to error, otherwise pass the alert.type
  const severityMap = (type) => {
    switch (type) {
      case 'danger':
        return 'error';
      case 'error':
      case 'warning':
      case 'info':
      case 'success':
        return type;
      default:
        return 'info'; // Fallback to 'info' if no matching severity
    }
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}  // Automatically close after 3 seconds
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}  // Position of the Snackbar
    >
      <Alert onClose={onClose} severity={severityMap(alert.type)} sx={{ color: 'white' }} >
        {alert.msg}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
