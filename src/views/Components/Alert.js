import React from 'react';
import { Alert as MuiAlert, Snackbar } from '@mui/material';

const Alert = (props) => {
  const { alert, handleClose } = props;

  const capitalize = (word) => {
    if (word === "danger") {
      word = "error";
    }
    const lower = word.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  };

  return (
    <Snackbar
      open={!!alert}
      autoHideDuration={6000}
      onClose={handleClose}
      message={capitalize(alert?.type)}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      {alert && (
        <MuiAlert
          onClose={handleClose}
          severity={alert.type}
          sx={{ width: '100%' }}
        >
          {capitalize(alert.type)}: {alert.msg}
        </MuiAlert>
      )}
    </Snackbar>
  );
};

export default Alert;
