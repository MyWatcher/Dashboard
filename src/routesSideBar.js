import Dashboard from "layouts/dashboard";
import Profile from "layouts/profile";
import Team from "layouts/team";

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
  {
    type: "collapse",
    name: "Team",
    key: "Team",
    icon: <Icon fontSize="small">people</Icon>,
    route: "/team",
    component: <Team />,
  },
];

export default routesSideBar;
