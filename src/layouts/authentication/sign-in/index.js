import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';
import backgroundImage from "assets/images/background-signin-signup.jpg"
import axios from "axios";
import logo from "assets/images/trasnparentLogo.png"
import {GoogleOAuthProvider, useGoogleLogin, useGoogleOAuth} from '@react-oauth/google'
import GoogleIcon from "../../../assets/images/icons/GoogleIcone/GoogleIcone"
import ErrorHandler from '../../ErrorHandling/ErrorHandling'
import { useUser } from "../../../assets/UserInformation/UserContext";
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
        "/api/api/auth/login",
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
        "/api/api/user/account", {
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

  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <Container>
      <Background src={backgroundImage} />
      <LoginBox>
        <Image src={logo} />
        <StyledInput
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
        />
        <PasswordContainer>
          <StyledInput
            type={passwordVisible ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
          />
          <ToggleButton onClick={() => setPasswordVisible(!passwordVisible)}>
            {passwordVisible ? 'Hide' : 'Show'}
          </ToggleButton>
        </PasswordContainer>
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
        <SignUpButton onClick={handleLogin}>Login</SignUpButton>
        <Text>
          Don’t have an account yet? <RegisterLink href="/authentication/sign-up">Register for free</RegisterLink>
        </Text>
        <Divider>
          <Line />
          <OrText>or</OrText>
          <Line />
        </Divider>
        <GoogleButton onClick={login}>
          <GoogleIcon /> Sign in with Google
        </GoogleButton>
      </LoginBox>
    </Container>
  );
}

export default Basic;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  position: relative;
`;

const Background = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
`;

const LoginBox = styled.div`
  background: #031C30;
  padding: 40px;
  border-radius: 30px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
  max-width: 90%;
`;

const Image = styled.img`
  width: 113px;
  height: 76px;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
  color: white;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  background-color: #042743;
  color: white;

  &::placeholder {
    color: white;
    opacity: 0.5;
  }
`;

const PasswordContainer = styled.div`
  position: relative;
  width: 100%;
`;

const ToggleButton = styled.button`
  position: absolute;
  right: 10px;
  top: 10px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #007bff;
`;

const SignUpButton = styled.button`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  background-color: #FFDE59;
  color: #031C30;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #e6c94f;
  }
`;

const Text = styled.p`
  font-size: 14px;
  color: white;
  margin-bottom: 20px;
`;

const RegisterLink = styled.a`
  color: #FFDE59;
  text-decoration: none;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const Line = styled.div`
  flex: 1;
  height: 1px;
  background-color: yellow;
`;

const OrText = styled.span`
  margin: 0 10px;
  font-size: 14px;
  color: white;
`;

const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  background-color: #F5F5F5;
  color: #4285f4;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  gap: 10px;

  &:hover {
    background-color: #e0e0e0;
  }
`;
