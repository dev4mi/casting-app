import React from "react";
import { Route, Router, Routes, useRoutes } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import {baseTheme} from './assets/global/Theme-variable'
import Themeroutes from "./routes/Router";
import UserState from "./context/UserState";
import RoleState from "./context/RoleState";
import ProductState from "./context/ProductState";
import PartState from "./context/PartState";
import ProductPartsState from "./context/ProductPartsState";
import LoginPage from "./views/Auth/LoginPage";

const App = () => {
  const routing = useRoutes(Themeroutes);
  const theme = baseTheme;
  return (

    <UserState>
      <RoleState>
        <ProductState>
          <PartState>
            <ProductPartsState>
            {/* <Router>    */}
            
              <Routes>
                <Route
                    exact path="/login"
                    element={<LoginPage />}
                ></Route>
              </Routes>
              {/* </Router> */}
              <ThemeProvider theme={theme}>
                {routing}
              </ThemeProvider>

          </ProductPartsState>
        </PartState>
      </ProductState>
      </RoleState>
    </UserState>
   
  );
};

export default App;
