import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import transparentLogo from "assets/images/trasnparentLogo.png"
import routesSideBar from "routesSideBar";
import routesSideBarAdmin from "routesSideBarAdmin";
import { LightMode } from '@mui/icons-material';

const SideBar = () => {
  const [lightMode, setLightMode] = useState(() => {
    return localStorage.getItem('lightMode') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('lightMode', lightMode);
  }, [lightMode]);

  const handleToggleLightMode = () => {
    setLightMode(!lightMode);
  };

  return (
    <SideBarContainer lightMode={lightMode}>
      <TopSection>
        <LogoContainer>
          <Logo src={transparentLogo} alt="Logo" />
          <LogoText lightMode={lightMode}>OWL</LogoText>
        </LogoContainer>
        
        <Section>
          {routesSideBar.map((route) => (
            <StyledNavLink key={route.key} to={route.route}>
              {route.icon}
              {/* {React.cloneElement(route.icon, { style: {width: '40px', height: '20px', color: lightMode ? '#031C30' : '#EFF2F4',  } })} */}
              <NavText lightMode={lightMode}>{route.name}</NavText>
            </StyledNavLink>
          ))}
        </Section>
        
        <Divider />
        
        <Section>
          {routesSideBarAdmin.map((route) => (
            <StyledNavLink key={route.key} to={route.route}>
              {route.icon}
              <NavText lightMode={lightMode}>{route.name}</NavText>
            </StyledNavLink>
          ))}
        </Section>
      </TopSection>
      
      <BottomSection>
        <SwitchContainer lightMode={lightMode}>
          <label htmlFor="lightModeSwitch">Light Mode</label>
          <Switch id="lightModeSwitch" type="checkbox" checked={lightMode} onChange={handleToggleLightMode} />
        </SwitchContainer>
        <StyledNavLink lightMode={lightMode} to="/authentication/sign-out">
          <LogoutText lightMode={lightMode}>Logout</LogoutText>
        </StyledNavLink>
      </BottomSection>
    </SideBarContainer> 
  );
};

export default SideBar;

// Styles
const SideBarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 250px;
  background-color: ${({ lightMode }) => (lightMode ? '#F5F5F5' : '#031C30')};
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
`;

const TopSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const Logo = styled.img`
  width: 70px;
  height: 50px;
  margin-right: 10px;
`;

const LogoText = styled.span`
  color: ${({ lightMode }) => (lightMode ? '#031C30' : '#EFF2F4')};
  font-size: 24px;
  font-weight: bold;
  font-family: 'Poppins', sans-serif;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
`;

const Divider = styled.div`
  height: 1px;
  background-color: #ccc;
  margin: 20px 0;
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  color: ${({ lightMode }) => (lightMode ? '#031C30' : '#EFF2F4')};
  margin-bottom: 20px;
  font-size: 18px;
  text-decoration: none;
  font-family: 'Poppins', sans-serif;
  padding: 6px;
  padding-left: -3px;
  margin: -1px;
  margin-left: -3px;
  border-radius: 15px;

  &.active {
    color: #E62660;
    background-color: rgba(102, 122, 138, 0.3);
  }

  &:hover {
    text-decoration: underline;
  }
`;

const Icon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 10px;
  filter: ${({ lightMode }) => (lightMode ? 'invert(1)' : 'none')};
`;

const NavText = styled.span`
  font-family: 'Poppins', sans-serif;
  color: ${({ lightMode }) => (lightMode ? '#031C30' : '#F5F5F5')};
  margin-left: 8px;
  
  &.active {
    color: #E62660;
  }
`;

const BottomSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  color: ${({ lightMode }) => (lightMode ? '#031C30' : '#EFF2F4')};
  font-family: 'Poppins', sans-serif;
`;

const Switch = styled.input`
  margin-left: 10px;
`;

const LogoutText = styled.span`
  color: ${({ lightMode }) => (lightMode ? '#031C30' : '#EFF2F4')};
  font-size: 18px;
  font-family: 'Poppins', sans-serif;
`;
