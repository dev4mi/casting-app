import React, { useContext, useEffect } from "react";
import { Route, Routes, useNavigate, useRoutes } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { baseTheme } from './assets/global/Theme-variable';
import Themeroutes from "./routes/Router";
import UserState from "./context/UserState";
import RoleState from "./context/RoleState";
import ProductState from "./context/ProductState";
import PartState from "./context/PartState";
import ProductPartsState from "./context/ProductPartsState";
import LoginPage from "./views/Auth/LoginPage";
import { AlertProvider } from "./context/AlertContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import PermissionState from "./context/PermissionState";
import CompanyState from "./context/CompanyState";
import MoldingState from "./context/MoldingState";
import PouringState from "./context/PouringState";
import DispatchState from "./context/DispatchState";
import ReportState from "./context/ReportState";

const App = () => {
  const navigate = useNavigate();
  const routing = useRoutes(Themeroutes);
  const theme = baseTheme;
  
  const { token, user } = useAuth();

  useEffect(() => {
    
    if (!token) {
      console.log('user'+user)
      navigate("/login");
    }else
    console.log('user'+user)

  }, [user, token, navigate]);

  return (
    <ThemeProvider theme={theme}>
      {routing}
    </ThemeProvider>
  );
};

const AppWrapper = () => (
  <AuthProvider>
    <AlertProvider>
      <UserState>
        <PermissionState>
        <RoleState>
          <MoldingState>
          <PouringState>
            <DispatchState>
              <CompanyState>
              <ProductState>
                <PartState>
                  <ProductPartsState>
                    <ReportState>
                    <Routes>
                      <Route exact path="/login" element={<LoginPage />} />
                      <Route path="/*" element={<App />} />
                    </Routes>
                    </ReportState>
                  </ProductPartsState>
                </PartState>
              </ProductState>
              </CompanyState>
              </DispatchState>
          </PouringState>
          </MoldingState>
        </RoleState>
        </PermissionState>
      </UserState>
    </AlertProvider>
  </AuthProvider>
);

export default AppWrapper;
