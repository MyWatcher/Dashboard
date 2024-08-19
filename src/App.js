import { GoogleOAuthProvider } from '@react-oauth/google';

import { useState, useEffect, useMemo } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
// import Sidenav from "examples/Sidenav";
import SideBar from "examples/Sidenav/SideNavNew";
import Configurator from "examples/Configurator";

// Material Dashboard 2 React themes
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";

// Material Dashboard 2 React Dark Mode themes
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";

// RTL plugins
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

// Material Dashboard 2 React routes
import routes from "routes";

// Material Dashboard 2 React contexts
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";

// Images
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";
import logo from "assets/images/trasnparentLogo.png"
import Basic from "layouts/authentication/sign-in";
import { element } from "prop-types";
import { UserProvider } from './assets/UserInformation/UserContext';
import axios from 'axios';

export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();

  // Cache for the rtl
  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };
  const navigate = useNavigate();
  // auth redirect to login
  const isAuthenticated = !!localStorage.getItem('authToken');
  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Setting the dir attribute for the body element
  useEffect(() => {
    const rememberUser = localStorage.getItem('rememberUser') === "true";
    const isAuthenticatedOnLoad = !!localStorage.getItem('authToken');
    document.body.setAttribute("dir", direction);
    console.log("isAuthenticatedOnLoad: ", isAuthenticatedOnLoad)

    const getUserInfo = async () => {
      try {
        const response = await axios.get(
          "/api/api/user/account", {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("authToken")}`
            }
          },
        )
        if (response.status === 200) {
          console.log("Retrieve info user successful!");
          const userData = response.data;
          localStorage.setItem("userData", JSON.stringify(userData));
        } else {
          console.error("Retrieve info user failed.");
          localStorage.removeItem("authToken");
          localStorage.removeItem("userData");
        }
        if (!isAuthenticatedOnLoad) {
          // User is not authenticated, redirect to login page
          navigate('/authentication/sign-in', { replace: true });
        }
      } catch (error) {
        console.log(error);
      }
    }
    if (isAuthenticatedOnLoad)
      getUserInfo();
    else {
      navigate('/authentication/sign-in', { replace: true });
    }

  }, []);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }
      if (pathname == 'dashboard' && !isAuthenticated)
        return  <Route exact path="/authenticate/sign-in" element={route.component} key={route.key} />;
      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });

  const configsButton = (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.25rem"
      height="3.25rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      // onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="small" color="inherit">
        settings
      </Icon>
    </MDBox>
  );

  return direction === "rtl" ? (
    <UserProvider>
    <CacheProvider value={rtlCache}>

      <ThemeProvider theme={darkMode ? themeDarkRTL : themeRTL}>
        <CssBaseline />
        {layout === "dashboard" && (
          <>
            <SideBar/>
            {/* <Sidenav
              color={sidenavColor}
              brand={(transparentSidenav && !darkMode) || whiteSidenav ? logo : logo}
              brandName="Material Dashboard 2"
              routes={routes}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            /> */}
            <Configurator />
            {configsButton}
          </>
        )}
        {layout === "vr" && <Configurator />}
        <Routes>
          {getRoutes(routes)}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </ThemeProvider>
    </CacheProvider>
    </UserProvider>
  ) : (
    <UserProvider>
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      {layout === "dashboard" && (
        <>
          <SideBar/>
          {/* <Sidenav
            color={sidenavColor}
            brand={(transparentSidenav && !darkMode) || whiteSidenav ? logo : logo}
            brandName="OWL"
            routes={routes}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          /> */}
          <Configurator />
          {configsButton}
        </>
      )}
      <GoogleOAuthProvider  clientId={"168695853654-m6c1h94875d8ob68ag78v9g1ngpnefjj.apps.googleusercontent.com"} >
      {layout === "vr" && <Configurator />}
      <Routes>

        {getRoutes(routes)}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
      </GoogleOAuthProvider>

      </ThemeProvider>
      </UserProvider>
  );
}
