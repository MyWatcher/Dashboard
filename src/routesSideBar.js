import Dashboard from "layouts/dashboard";
import Profile from "layouts/profile";

// @mui icons
import Icon from "@mui/material/Icon";

const routesSideBar = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Document",
    key: "Document",
    icon: <Icon fontSize="small">article</Icon>,
    route: "/document",
    component: <Dashboard />,
  },
  {
      type: "collapse",
      name: "Profile",
      key: "Profile",
      icon: <Icon fontSize="small">person2</Icon>,
      route: "/profile",
      component: <Profile />,
    },
];

export default routesSideBar;
