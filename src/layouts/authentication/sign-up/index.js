import { useState } from "react";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import axios from "axios";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import styled from "styled-components";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import backgroundImage from "assets/images/background-signin-signup.jpg";

function Cover() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const genderList = ["Men", "Women"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRegistration = async (e) => {
    e.preventDefault();

    for (const key in formData) {
      if (!formData[key]) {
        setError(`${key} est manquant`);
        console.error(`${key} is empty.`);
        return;
      }
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      console.error("Passwords do not match.");
      return;
    }
    const requestBody = {
      birthDate: "1",
      email: formData.email,
      firstName: formData.firstName,
      gender: formData.gender.toLowerCase(),
      height: 0,
      lastName: formData.lastName,
      password: formData.password,
      weight: 0,
    };

    try {
      const response = await axios.post("/api/api/auth/register", requestBody, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setSuccess(response.data.message);
      // window.location.href = "/authentication/sign-in?justRegistered=true"
      if (response.status === 200) {
        console.log("Registration successful!");
      } else {
        console.error("Registration failed.");
        const errorMessage = error.response?.data?.error;
        setError(errorMessage);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      setError(errorMessage);
      setTimeout(() => {
        setError("");
      }, 5000);
      console.error("Error during registration:", error);
    }
  };

  return (
    <Container>
      <Background src={backgroundImage} />
      <LoginBox>
        <Title>Registration</Title>
        <StyledInput
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleInputChange}
        />
        <StyledInput
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleInputChange}
        />
        <select
          id="gender"
          name="gender"
          disabled={!genderList.length}
          value={formData.gender}
          onChange={(e) => {
            const updatedFormData = {
              ...formData,
              gender: e.target.value,
            };
            setFormData(updatedFormData);
          }}
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "8px",
            background: "#FFFFFF",
          }}
        >
          <option
            defaultValue={"Men"}
            value=""
            disabled
            hidden={formData.gender !== ""}
          >
            Gender
          </option>
          {genderList.length > 0 &&
            genderList.map((gender, index) => (
              <option key={index} value={gender}>
                {gender}
              </option>
            ))}
        </select>
        <StyledInput
          type="text"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
        />
        <StyledInput
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
        />
        <StyledInput
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleInputChange}
        />
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
          </span>
        )}
        <SignUpButton onClick={handleRegistration}>Sign Up</SignUpButton>
        <Text>
          <RegisterLink href="/authentication/sign-in">
            Return to Login
          </RegisterLink>
        </Text>
      </LoginBox>
    </Container>
  );
}

export default Cover;

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
  background: #031c30;
  padding: 40px;
  border-radius: 30px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
  max-width: 90%;
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

const SignUpButton = styled.button`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  background-color: #ffde59;
  color: #031c30;
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
  color: #ffde59;
  text-decoration: none;
`;
