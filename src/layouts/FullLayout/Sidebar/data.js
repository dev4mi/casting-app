import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import AddToPhotosOutlinedIcon from '@mui/icons-material/AddToPhotosOutlined';
import AspectRatioOutlinedIcon from '@mui/icons-material/AspectRatioOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import AlbumOutlinedIcon from '@mui/icons-material/AlbumOutlined';
import SwitchCameraOutlinedIcon from '@mui/icons-material/SwitchCameraOutlined';
import SwitchLeftOutlinedIcon from '@mui/icons-material/SwitchLeftOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import AutoAwesomeMosaicOutlinedIcon from '@mui/icons-material/AutoAwesomeMosaicOutlined';

const Menuitems = [
  // {
  //   title: "Dashboard",
  //   icon: DashboardOutlinedIcon,
  //   href: "/dashboards/dashboard1",
  // },
  // {
  //   title: "Autocomplete",
  //   icon: AddToPhotosOutlinedIcon,
  //   href: "/form-elements/autocomplete",
  // },
  // {
  //   title: "Buttons",
  //   icon: AspectRatioOutlinedIcon,
  //   href: "/form-elements/button",
  // },
  // {
  //   title: "Checkbox",
  //   icon: AssignmentTurnedInOutlinedIcon,
  //   href: "/form-elements/checkbox",
  // },
  // {
  //   title: "Radio",
  //   icon: AlbumOutlinedIcon,
  //   href: "/form-elements/radio",
  // },
  // {
  //   title: "Slider",
  //   icon: SwitchCameraOutlinedIcon,
  //   href: "/form-elements/slider",
  // },
  // {
  //   title: "Switch",
  //   icon: SwitchLeftOutlinedIcon,
  //   href: "/form-elements/switch",
  // },
  // {
  //   title: "Form",
  //   icon: DescriptionOutlinedIcon,
  //   href: "/form-layouts/form-layouts",
  // },
  // {
  //   title: "Table",
  //   icon: AutoAwesomeMosaicOutlinedIcon,
  //   href: "/tables/basic-table",
  // },
  {
    title: "Users",
    icon: AutoAwesomeMosaicOutlinedIcon,
    href: "/users",
    permission: "user-listing"
  },
  {
    title: "Permissions",
    icon: AutoAwesomeMosaicOutlinedIcon,
    href: "/permissions",
    permission: "permission-listing"
  },
  {
    title: "Roles",
    icon: AutoAwesomeMosaicOutlinedIcon,
    href: "/roles",
    permission: "role-listing"
  },
  {
    title: "Parts",
    icon: AutoAwesomeMosaicOutlinedIcon,
    href: "/parts",
    permission: "part-listing"
  },
  {
    title: "Products",
    icon: AutoAwesomeMosaicOutlinedIcon,
    href: "/productparts",
    permission: "productparts-listing"
  },
  {
    title: "Companies",
    icon: AutoAwesomeMosaicOutlinedIcon,
    href: "/companies",
    permission: "company-listing"
  },
  {
    title: "Molding",
    icon: AutoAwesomeMosaicOutlinedIcon,
    href: "/molding",
    permission: "molding-listing"
  },
  {
    title: "Molding Rejection",
    icon: AutoAwesomeMosaicOutlinedIcon,
    href: "/molding-rejection",
    permission: "molding-rejection-listing"
  },
  {
    title: "Pouring",
    icon: AutoAwesomeMosaicOutlinedIcon,
    href: "/pouring",
    permission: "pouring-listing"
  },
  {
    title: "Pouring Rejection",
    icon: AutoAwesomeMosaicOutlinedIcon,
    href: "/pouring-rejection",
    permission: "pouring-rejection-listing"
  },
  {
    title: "Dispatch",
    icon: AutoAwesomeMosaicOutlinedIcon,
    href: "/dispatch",
    permission: "dispatch-listing"
  },
  {
    title: "Dispatch Rejection",
    icon: AutoAwesomeMosaicOutlinedIcon,
    href: "/dispatch-rejection",
    permission: "dispatch-rejection-listing"
  },
  {
    title: "Report",
    icon: AutoAwesomeMosaicOutlinedIcon,
    href: "/report",
    permission: "report-generate"
  },
  // {
  //   title: "Login",
  //   icon: AutoAwesomeMosaicOutlinedIcon,
  //   href: "/login",
  // },
];

export default Menuitems;
