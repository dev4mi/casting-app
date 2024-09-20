import React, { useContext, useState } from "react";
import {
  experimentalStyled,
  useMediaQuery,
  Container,
  Box,
} from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import Sidebar from "./Sidebar/Sidebar";
import Footer from "./Footer/Footer";
import { TopbarHeight } from "../../assets/global/Theme-variable";
import { AlertContext } from "../../context/AlertContext";
import CustomSnackbar from "../../views/Components/CustomSnackbar";

const MainWrapper = experimentalStyled("div")(({ theme }) => ({
  display: "flex",
  minHeight: "100vh",
  overflow: "hidden",
  width: "100%",
}));
const PageWrapper = experimentalStyled("div")(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  overflow: "hidden",

  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.up("lg")]: {
    paddingTop: TopbarHeight,
  },
  [theme.breakpoints.down("lg")]: {
    paddingTop: "64px",
  },
}));

const FullLayout = () => {
  //
  const { snackbarOpen, alert, closeAlert } = useContext(AlertContext);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
 
  return (
    <MainWrapper>
      <Header
        sx={{
          paddingLeft: isSidebarOpen && lgUp ? "265px" : "",
          backgroundColor: "#ffffff",
        }}
        toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
        toggleMobileSidebar={() => setMobileSidebarOpen(true)}
      />

      <Sidebar
        isSidebarOpen={isSidebarOpen}
        isMobileSidebarOpen={isMobileSidebarOpen}
        onSidebarClose={() => setMobileSidebarOpen(false)}
      />

      <PageWrapper>
        <Container
          maxWidth={false}
          sx={{
            paddingTop: "20px",
            paddingLeft: isSidebarOpen && lgUp ? "280px!important" : "",
          }}
        >
          <Box sx={{ minHeight: "calc(100vh - 170px)" }}>
            <Outlet />
          </Box>
          <Footer />
        </Container>
      </PageWrapper>

      {/* Display the Snackbar here */}
      <CustomSnackbar open={snackbarOpen} onClose={closeAlert} alert={alert} />
    </MainWrapper>
  );
};

export default FullLayout;
