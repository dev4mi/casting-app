import React from "react";
import { useRoutes } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import {baseTheme} from './assets/global/Theme-variable'
import Themeroutes from "./routes/Router";
import UserState from "./context/UserState";
import RoleState from "./context/RoleState";
import ProductState from "./context/ProductState";
import PartState from "./context/PartState";
import ProductPartsState from "./context/ProductPartsState";

const App = () => {
  const routing = useRoutes(Themeroutes);
  const theme = baseTheme;
  return (
    <UserState>
      <RoleState>
        <ProductState>
          <PartState>
            <ProductPartsState>

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
