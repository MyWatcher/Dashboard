/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";

import { useEffect } from "react";
import { useUser } from "assets/UserInformation/UserContext";

function Dashboard() {
  const { sales, tasks } = reportsLineChartData;
  const { user, updateUser } = useUser();

  useEffect(() => {
    const getUserInfo = async () => {
      const userLocalStorage = localStorage.getItem("userData");
      if (userLocalStorage === null) return console.log("No user data");
      const data = JSON.parse(userLocalStorage);
      const updatedUser = {
        ...user,
        height: data.height,
        subscription: data.subscription,
        weight: data.weight,
        birthDate: data.birthDate,
        createdAt: data.createdAt,
        email: data.email,
        firstName: data.firstName,
        gender: data.gender,
        lastName: data.lastName,
        password: data.password,
        updatedAt: data.updatedAt,
        stripeCustomerId: data.stripeCustomerId,
        userId: data.data_id,
        token: localStorage.getItem("authToken"),
        tokens: data.tokens,
        heartRate: data.heartRate,
      };
      updateUser(updatedUser);
      console.log("User data from local storage", updatedUser);
    };
    getUserInfo();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <h1 style={{ textAlign: "center" }}>OWL Dashboard</h1>
        <div
          style={{
            background: "white",
            borderRadius: 10,
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <p>
            this is the OWL dashboard, a tool to visualize your account on your
            computer and handle teams on it
          </p>
          <h2 style={{ textAlign: "center" }}>Profile</h2>
          <p>For your profile, you can access the following data:</p>
          <ul
            style={{
              marginLeft: "5rem",
              marginBottom: "1rem",
              fontWeight: "bold",
            }}
          >
            <div>Full name</div>
            <div>Email</div>
            <div>Current subscription</div>
            <div>Tokens</div>
          </ul>
          <p>And do the following actions:</p>
          <ul
            style={{
              marginLeft: "5rem",
              marginBottom: "1rem",
              fontWeight: "bold",
            }}
          >
            <div>Change your email</div>
            <div>Change your password</div>
            <div>Delete your account</div>
          </ul>
          <h2 style={{ textAlign: "center" }}>Team</h2>
          <p>
            For the teams, you can see all your teams, create team, invite
            member to your team and if your the team admnistrator, you can see
            the report from the team members
          </p>
        </div>
      </MDBox>
      {/*<MDBox py={3}>*/}
      {/*  <Grid container spacing={3}>*/}
      {/*    <Grid item xs={12} md={6} lg={3}>*/}
      {/*      <MDBox mb={1.5}>*/}
      {/*        <ComplexStatisticsCard*/}
      {/*          color="dark"*/}
      {/*          icon="weekend"*/}
      {/*          title="10,000 steps daily goals"*/}
      {/*          count={3}*/}
      {/*          percentage={{*/}
      {/*            color: "success",*/}
      {/*            amount: "+55%",*/}
      {/*            label: "than lask week",*/}
      {/*          }}*/}
      {/*        />*/}
      {/*      </MDBox>*/}
      {/*    </Grid>*/}
      {/*    <Grid item xs={12} md={6} lg={3}>*/}
      {/*      <MDBox mb={1.5}>*/}
      {/*        <ComplexStatisticsCard*/}
      {/*          icon="leaderboard"*/}
      {/*          title="8 hours daily goal"*/}
      {/*          count="1"*/}
      {/*          percentage={{*/}
      {/*            color: "success",*/}
      {/*            amount: "+3%",*/}
      {/*            label: "than last month",*/}
      {/*          }}*/}
      {/*        />*/}
      {/*      </MDBox>*/}
      {/*    </Grid>*/}
      {/*    <Grid item xs={12} md={6} lg={3}>*/}
      {/*      <MDBox mb={1.5}>*/}
      {/*        <ComplexStatisticsCard*/}
      {/*          color="success"*/}
      {/*          icon="store"*/}
      {/*          title="daily break"*/}
      {/*          count="2"*/}
      {/*          percentage={{*/}
      {/*            color: "success",*/}
      {/*            amount: "+1%",*/}
      {/*            label: "than yesterday",*/}
      {/*          }}*/}
      {/*        />*/}
      {/*      </MDBox>*/}
      {/*    </Grid>*/}
      {/*    <Grid item xs={12} md={6} lg={3}>*/}
      {/*      <MDBox mb={1.5}>*/}
      {/*        <ComplexStatisticsCard*/}
      {/*          color="primary"*/}
      {/*          icon="person_add"*/}
      {/*          title="Meditation"*/}
      {/*          count="2"*/}
      {/*          percentage={{*/}
      {/*            color: "success",*/}
      {/*            amount: "",*/}
      {/*            label: "Just updated",*/}
      {/*          }}*/}
      {/*        />*/}
      {/*      </MDBox>*/}
      {/*    </Grid>*/}
      {/*  </Grid>*/}
      {/*  <MDBox mt={4.5}>*/}
      {/*    <Grid container spacing={3}>*/}
      {/*      <Grid item xs={12} md={6} lg={4}>*/}
      {/*        <MDBox mb={3}>*/}
      {/*          <ReportsBarChart*/}
      {/*            color="info"*/}
      {/*            title="Sleep Time"*/}
      {/*            description="Sleep Time weekly"*/}
      {/*            date="updated 10 min ago"*/}
      {/*            chart={reportsBarChartData}*/}
      {/*          />*/}
      {/*        </MDBox>*/}
      {/*      </Grid>*/}
      {/*      <Grid item xs={12} md={6} lg={4}>*/}
      {/*        <MDBox mb={3}>*/}
      {/*          <ReportsLineChart*/}
      {/*            color="success"*/}
      {/*            title="Sleep improvement"*/}
      {/*            description={*/}
      {/*              <>*/}
      {/*                (<strong>+15%</strong>) increase in today sales.*/}
      {/*              </>*/}
      {/*            }*/}
      {/*            date="updated 4 min ago"*/}
      {/*            chart={sales}*/}
      {/*          />*/}
      {/*        </MDBox>*/}
      {/*      </Grid>*/}
      {/*      <Grid item xs={12} md={6} lg={4}>*/}
      {/*        <MDBox mb={3}>*/}
      {/*          <ReportsLineChart*/}
      {/*            color="dark"*/}
      {/*            title="completed tasks"*/}
      {/*            description="Last Campaign Performance"*/}
      {/*            date="just updated"*/}
      {/*            chart={tasks}*/}
      {/*          />*/}
      {/*        </MDBox>*/}
      {/*      </Grid>*/}
      {/*    </Grid>*/}
      {/*  </MDBox>*/}
      {/*</MDBox>*/}
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
