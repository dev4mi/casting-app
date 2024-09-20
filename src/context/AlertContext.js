import React, { createContext, useState } from "react";

export const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alert, setAlert] = useState({ type: 'success', msg: 'This is a success message!' });

  const showAlert = (msg, type) => {
    setAlert({ msg, type });
    setSnackbarOpen(true);
  };

  const closeAlert = () => {
    setSnackbarOpen(false);
  };

  return (
    <AlertContext.Provider value={{ snackbarOpen, alert, showAlert, closeAlert }}>
      {children}
    </AlertContext.Provider>
  );
};
