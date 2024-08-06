import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import axios from "axios";
import {GoogleOAuthProvider, useGoogleLogin, useGoogleOAuth} from '@react-oauth/google'
import GoogleIcon from "../../../assets/images/icons/GoogleIcone/GoogleIcone"
import ErrorHandler from '../../ErrorHandling/ErrorHandling'
import { useUser } from "../../../assets/UserInformation/UserContext";
import { token } from "stylis";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

function Basic() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const {user, updateUser} = useUser();
  const searchParams = new URLSearchParams(window.location.search);
  const notificationShownRef = useRef(false)
  const [rememberMe, setRememberMe] = useState(false);


  const [userInfo, setUserInfo] = useState([]);
  const [profileInfo, setProfileInfo] = useState([]);

  const handleRememberMeChange = (event) => {
    setRememberMe(event.target.checked);
  };

  useEffect(() => {
    const justRegistered = searchParams.get("justRegistered");
    const emailChanged = searchParams.get("emailChanged");
    const accountDeleted = searchParams.get("accountDeleted");
    if (emailChanged === "true") {
      toast.success("You must confirm your email before connecting.")
    }
    if (justRegistered === "true" && !notificationShownRef.current) {
      toast.success("User registered, confirm your email address to activate your account.")
      notificationShownRef.current = true
    }
    if (accountDeleted === "true") {
      toast.success("Account deleted successfully.")
    }
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      console.error("Email or password is empty.");
      return;
    }

    try {
      const response = await axios.post(
        "http://20.199.106.94" + "/api/auth/login",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess(response.data.message);
      if (response.status === 200 || response.data.message === "Login success") {
        console.log("Login successful!");
      } else {
        console.error("Login failed.");
        return;
      }
      localStorage.setItem("authToken", response.data.data.token);
      localStorage.setItem("rememberUser", rememberMe);
      await getUserInfo();
      navigate("/");
      navigate(0);
      window.location.reload();
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      setError(errorMessage);
      setTimeout(() => {
        setError("");
      }, 5000);
      console.error("Error during login:", error);
    }
  };

  const login = useGoogleLogin({
    onSuccess: (response) => {
      console.log("result => ", JSON.stringify(response));
      localStorage.setItem("authToken", response.access_token);
      getUserInfoGoogle(response.access_token);
      navigate("/")
     },
    onError: (error) => console.log(`Login Failed: ${error}`, )
  });

  const getUserInfoGoogle = async (token) => {
    try {
      const response = await axios.get("https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=" + token)
      console.log(response.data.email);
      const updatedUser = {...user,
        height : 0,
        subscription : undefined,
        weight : 0,
        birthDate : "",
        createdAt: new Date(),
        email : response.data.email,
        firstName : response.data.given_name,
        gender : "",
        lastName : response.data.family_name,
        password: "",
        updatedAt : "",
        stripeCustomerId : "",
        userId : response.data.id,
        token : token,
        tokens : 0,
        heartRate : [],
      }
      updateUser(updatedUser);
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    }
  }

  const getUserInfo = async () => {
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
        const updatedUser = {...user, 
          height: 0,
          subscription: undefined,
          weight: 0,
          birthDate: response.data.birthDate.toString(),
          createdAt: response.data.createdAt.toString(),
          email: response.data.email,
          firstName: response.data.firstName,
          gender: response.data.gender,
          lastName: response.data.lastName,
          password: formData.password,
          updatedAt: "",
          stripeCustomerId: response.data.stripeCustomerId,
          userId: response.data._id,
          token: localStorage.getItem("authToken"),
          tokens : response.data.tokens,
          heartRate : response.data.heartRate,
        }
        updateUser(updatedUser);
        console.log(updatedUser)
        localStorage.removeItem("userData");
        localStorage.setItem("userData", JSON.stringify(response.data));
      } else {
        console.error("Retrieve info user failed.");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox pt={4} pb={3} px={3}>
          <MDButton
              type="submit"
              variant="gradient"
              color="info"
              fullWidth
              onClick={login}
              endIcon={<GoogleIcon/>}>
            Sign in
          </MDButton>
        </MDBox>
        <hr/>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleLogin}>

            <MDBox mb={2}>
              <MDInput
                  type="email"
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  fullWidth
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                  type="password"
                  label="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  fullWidth
              />
            </MDBox>
            {success && (
                <span
                    style={{
                      width: "100%",
                      display: "inline-block",
                      borderRadius: "0.75rem",
                      padding: "0.25rem",
                      backgroundColor: "green",
                      color: "white",
                      textAlign: "center",
                      fontSize: "1.25rem",
                      marginBottom: 16,
                    }}
                >
                {success}
              </span>
            )}
            {error && (
                <span
                    style={{
                      width: "100%",
                      display: "inline-block",
                      borderRadius: "0.75rem",
                      padding: "0.25rem",
                      backgroundColor: "red",
                      color: "white",
                      textAlign: "center",
                      fontSize: "1.25rem",
                      marginBottom: 16,
                    }}
                >
                {error}
                  <ErrorHandler message={error}/>
              </span>
            )}
          
            <MDBox mt={4} mb={1}>
            {/*<FormControlLabel
                control={
                  <Switch
                    checked={rememberMe}
                    onChange={handleRememberMeChange}
                    name="rememberMe"
                    color="primary"
                  />
                }
                label="Remember Me"
              />*/}
              <MDButton type="submit" variant="gradient" color="info" fullWidth>
                Sign in
              </MDButton>
            </MDBox>
            {/* ... Other components ... */}
          </MDBox>
        </MDBox>
      </Card>
      <ToastContainer/>
    </BasicLayout>
  );
}

export default Basic;
