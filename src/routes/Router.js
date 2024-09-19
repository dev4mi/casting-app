import { lazy } from "react";
import { Navigate } from "react-router-dom";

/****Layouts*****/
const FullLayout = lazy(() => import("../layouts/FullLayout/FullLayout.js"));
/****End Layouts*****/

/*****Pages******/
const Dashboard1 = lazy(() => import("../views/dashboards/Dashboard1.js"));

/*****Tables******/
const BasicTable = lazy(() => import("../views/tables/BasicTable.js"));

// form elements
const ExAutoComplete = lazy(() =>
  import("../views/FormElements/ExAutoComplete.js")
);
const ExButton = lazy(() => import("../views/FormElements/ExButton.js"));
const ExCheckbox = lazy(() => import("../views/FormElements/ExCheckbox.js"));
const ExRadio = lazy(() => import("../views/FormElements/ExRadio.js"));
const ExSlider = lazy(() => import("../views/FormElements/ExSlider.js"));
const ExSwitch = lazy(() => import("../views/FormElements/ExSwitch.js"));
// form layouts
const FormLayouts = lazy(() => import("../views/FormLayouts/FormLayouts.js"));
const UserLayouts = lazy(() => import("../views/Users/User.js"));
const MoldLayouts = lazy(() => import("../views/Molding/MoldingView.js"));
const ProductPartsLayouts = lazy(() => import("../views/ProductParts/ProductPartsView.js"));
const LoginLayouts = lazy(() => import("../views/Auth/LoginPage.js"));

/*****Routes******/
// const LoginRoute =  { path: "login", exact:true, element: <LoginLayouts /> }
const ThemeRoutes = [
  {
    path: "/",
    element: <FullLayout />,
    children: [
      { path: "/", element: <Navigate to="login" /> },
      { path: "dashboards/dashboard1", exact: true, element: <Dashboard1 /> },
      { path: "tables/basic-table", element: <BasicTable /> },
      { path: "/form-layouts/form-layouts", element: <FormLayouts /> },
      { path: "/form-elements/autocomplete", element: <ExAutoComplete /> },
      { path: "/form-elements/button", element: <ExButton /> },
      { path: "/form-elements/checkbox", element: <ExCheckbox /> },
      { path: "/form-elements/radio", element: <ExRadio /> },
      { path: "/form-elements/slider", element: <ExSlider /> },
      { path: "/form-elements/switch", element: <ExSwitch /> },
      { path: "/users", exact:true, element: <UserLayouts /> },
      { path: "/molding", exact:true, element: <MoldLayouts /> },
      { path: "/productparts", exact:true, element: <ProductPartsLayouts /> },
     
    ],
  },

];

export default ThemeRoutes;
// export {LoginRoute};