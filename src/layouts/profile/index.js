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
import Divider from "@mui/material/Divider";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import ProfilesList from "examples/Lists/ProfilesList";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";

// Overview page components
import Header from "layouts/profile/components/Header";
import PlatformSettings from "layouts/profile/components/PlatformSettings";

// Data

// Images
import homeDecor1 from "assets/images/home-decor-1.jpg";
import homeDecor2 from "assets/images/home-decor-2.jpg";
import homeDecor3 from "assets/images/home-decor-3.jpg";
import homeDecor4 from "assets/images/home-decor-4.jpeg";
import team1 from "assets/images/team-1.jpg";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";
import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../../assets/UserInformation/UserContext";
import Subscription from "../../assets/UserInformation/Subscription";
import { subscriptionList } from "./subscriptionsId";

function Overview() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const {user, updateUser} = useUser();
  const [subscriptionUser, setSubscriptionUser] = useState(new Subscription("0", "Free subcription", 0, new Date(), 0, "You don't have any subscription yet"));

  useEffect(() => {
    const getUserInfo = async () => {
      const userLocalStorage = localStorage.getItem("userData");
      if (userLocalStorage !== null) {
        const data = JSON.parse(userLocalStorage);
        const updatedUser = {...user,
          height : data.height,
          subscription : data.subscription,
          weight : data.weight,
          birthDate : data.birthDate,
          createdAt: data.createdAt,
          email : data.email,
          firstName : data.firstName,
          gender : data.gender,
          lastName : data.lastName,
          password: data.password,
          updatedAt : data.updatedAt,
          stripeCustomerId : data.stripeCustomerId,
          userId : data.data_id,
          token : localStorage.getItem("authToken"),
          tokens : data.tokens,
          heartRate : data.heartRate,
        }
        updateUser(updatedUser);
        return;
      } else {
          try {
            const response = await axios.get(
            "http://20.199.106.94/api/user/account", {
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`
              }
            },
          )
          if (response.status === 200) {
            console.log("Retrieve info user successful!");
          } else {
            console.error("Retrieve info user failed.");
          }
          const updatedUser = {...user, 
            height: 0,
            subscription: undefined,
            weight: 0,
            birthDate: response.data.birthDate,
            createdAt: response.data.createdAt,
            email: response.data.email,
            firstName: response.data.firstName,
            gender: response.data.gender,
            lastName: response.data.lastName,
            password: "",
            updatedAt: "",
            stripeCustomerId: response.data.stripeCustomerId,
            userId: response.data._id,
            tokens : response.data.tokens,
            heartRate : response.data.heartRate,
          }
        updateUser(updatedUser);
        console.log(updatedUser);
      } catch (error) {
        console.log(error);
      }
      }
      }
      getUserInfo();
      getSubscriptionInformation();
  }, []);

  const getSubscriptionInformation = async () => {
    try {
      const response = await axios.get(
        "http://20.199.106.94/api/subscriptions/getSubscription",
        {
          headers : {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`
          }
        }
      );
      if (response.data.message === "Subscription found") {
        const subscriptionId = response.data.data.plan.id;
        const subscription = subscriptionList.find(sub => sub.subscriptionId === subscriptionId);
        const startDate = new Date(+response.data.data.current_period_start * 1000);
        const endDate = new Date(+response.data.data.current_period_end * 1000);
        const newSubscription = new Subscription(subscriptionId, subscription.name, subscription.price, startDate.toDateString(), subscription.length, subscription.description, endDate.toDateString());
        setSubscriptionUser(newSubscription);
        const updatedUser = {...user, subscription: newSubscription};
        updateUser(updatedUser);
        localStorage.setItem("userData", JSON.stringify(updatedUser));
      } else {
        console.error("Retrieve subscription info failed.");
        return;
      }
    } catch (e) {
      console.log(e.response);
      if (e.response && e.response.data && e.response.data.message === "Vous n'avez pas d'abonnement actif.") {
        const updatedUser = {...user, subscription: subscriptionUser};
        updateUser(updatedUser);
        return;
      }
      console.error(e);
      console.error("Retrieve info for subscription failed");
    }
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <Header>
        <MDBox mt={5} mb={3}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={6} xl={4}>
              <PlatformSettings />
            </Grid>
            <Grid item xs={12} md={6} xl={4} sx={{ display: "flex" }}>
              <Divider orientation="vertical" sx={{ ml: 14, mr: 5 }} />
              <ProfileInfoCard
                title="profile information"
                description="You can see your profile information here."
                info={{
                  fullName: user.firstName + " " + user.lastName,
                  email: user.email,
                  Subscription : subscriptionUser.getSubscriptionInfo(),
                  tokens : user.tokens,
                }}
                // social={[
                  // {
                  //   link: "https://www.facebook.com/CreativeTim/",
                  //   icon: <FacebookIcon />,
                  //   color: "facebook",
                  // },
                  // {
                  //   link: "https://twitter.com/creativetim",
                  //   icon: <TwitterIcon />,
                  //   color: "twitter",
                  // },
                  // {
                  //   link: "https://www.instagram.com/creativetimofficial/",
                  //   icon: <InstagramIcon />,
                  //   color: "instagram",
                  // },
                // ]}
                action={{ route: "", tooltip: "Edit Profile" }}
                shadow={false}
              />
              <Divider orientation="vertical" sx={{ mx: 0 }} />
            </Grid>
          </Grid>
        </MDBox>

      </Header>
      <Footer />
    </DashboardLayout>
  );
}

export default Overview;
