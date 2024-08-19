import Icon from "@mui/material/Icon";
import Dashboard from "layouts/dashboard";

const routesSideBarAdmin = [
  {
    type: 'route',
    name: 'Admin',
    key: 'admin',
    icon: <Icon fontSize="small">security</Icon>,
    route: '/admin',
    component: <Dashboard />,
  },
  {
    type: 'route',
    name: 'Create Fake Accounts',
    key: 'create-fake-accounts',
    icon: <Icon fontSize="small">add</Icon>,
    route: '/create-fake-accounts',
    component: <Dashboard />,
  },
];

export default routesSideBarAdmin;
