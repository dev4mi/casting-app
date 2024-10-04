import { lazy } from "react";
import { Navigate } from "react-router-dom";
import ProtectedRoute from "../views/Auth/ProtectedRoute.js";

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
const UserLayouts = lazy(() => import("../views/Users/UserView.js"));
const PermissionLayouts = lazy(() => import("../views/Permissions/PermissionView.js"));
const RoleLayouts = lazy(() => import("../views/Roles/RoleView.js"));
const PartsLayouts = lazy(() => import("../views/Parts/PartView.js"));
const ProductPartsLayouts = lazy(() => import("../views/ProductParts/ProductPartsView.js"));
const CompaniesLayouts = lazy(() => import("../views/Companies/CompanyView.js"));
const MoldLayouts = lazy(() => import("../views/Molding/MoldingView.js"));
const MoldRejectLayouts = lazy(() => import("../views/Molding/MoldingRejectionView.js"));
const PourLayouts = lazy(() => import("../views/Pouring/PouringView.js"));
const PourRejectLayouts = lazy(() => import("../views/Pouring/PouringRejectionView.js"));
const DispatchLayouts = lazy(() => import("../views/Dispatch/DispatchView.js"));
const DispatchRejectLayouts = lazy(() => import("../views/Dispatch/DispatchRejectionView.js"));
const ReportLayouts = lazy(() => import("../views/Report/ReportView.js"));

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
      { path: "/users", exact:true, element: <ProtectedRoute element={<UserLayouts />} requiredPermissions={['user-listing']} /> },
      { path: "/permissions", exact:true, element: <PermissionLayouts /> },
      { path: "/roles", exact:true, element: <RoleLayouts /> },
      { path: "/parts", exact:true, element: <ProtectedRoute element={<PartsLayouts />} requiredPermissions={['part-listing']} /> },
      { path: "/productparts", exact:true, element: <ProtectedRoute element={<ProductPartsLayouts />} requiredPermissions={['productparts-listing']} /> },
      { path: "/companies", exact:true, element: <ProtectedRoute element={<CompaniesLayouts />} requiredPermissions={['company-listing']} /> },
      { path: "/molding", exact:true, element: <ProtectedRoute element={<MoldLayouts />} requiredPermissions={['molding-listing']} /> },
      { path: "/molding-rejection", exact:true, element: <ProtectedRoute element={<MoldRejectLayouts />} requiredPermissions={['molding-rejection-listing']} /> },
      { path: "/pouring", exact:true, element: <ProtectedRoute element={<PourLayouts />} requiredPermissions={['pouring-listing']} /> },
      { path: "/pouring-rejection", exact:true, element: <ProtectedRoute element={<PourRejectLayouts />} requiredPermissions={['pouring-rejection-listing']} /> },
      { path: "/dispatch", exact:true, element: <ProtectedRoute element={<DispatchLayouts />} requiredPermissions={['dispatch-listing']} /> },
      { path: "/dispatch-rejection", exact:true, element: <ProtectedRoute element={<DispatchRejectLayouts />} requiredPermissions={['dispatch-rejection-listing']} /> },
      { path: "/report", exact:true, element: <ProtectedRoute element={<ReportLayouts />} requiredPermissions={['report-generate']} /> },
     
    ],
  },

];

export default ThemeRoutes;
// export {LoginRoute};