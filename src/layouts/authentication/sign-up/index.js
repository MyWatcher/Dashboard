import { useState } from "react";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import axios from "axios";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import bgImage from "assets/images/bg-sign-up-cover.jpeg";

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
      height : 0,
      lastName: formData.lastName,
      password : formData.password,
      weight : 0
    }

    try {
      const response = await axios.post(
        "http://20.199.106.94/api/auth/register",
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setSuccess(response.data.message);
      window.location.href = "/authentication/sign-in?justRegistered=true"
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
    <CoverLayout image={bgImage}>
      <Card>
        <MDBox pt={4} pb={3} px={3}>
          <MDTypography variant="h4" fontWeight="medium" mt={1} mb={1}>
            Registration
          </MDTypography>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
              />
            </MDBox>
            <MDBox mb={2}>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
              />
            </MDBox>
            <MDBox mb={2}>
            <select id="gender" name="gender" disabled={!genderList.length}
                value={formData.gender}
                onChange={(e) => {
                  const updatedFormData = {
                    ...formData,
                    gender : e.target.value
                  };
                  setFormData(updatedFormData);
                }}
                style={{ width: "100%", padding: "8px", marginBottom: "8px" }}>
                <option defaultValue={"Men"} value="" disabled hidden={formData.gender !== ""}>Gender</option>
                {genderList.length > 0 && genderList.map((gender, index) => (
                  <option key={index} value={gender}>{gender}</option>
                ))}
            </select>

            </MDBox>
            <MDBox mb={2}>
              <input
                type="text"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
              />
            </MDBox>
            <MDBox mb={2}>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
              />
            </MDBox>
            <MDBox mb={2}>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
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
              </span>
            )}
            <button
              style={{
                width: "100%",
                borderRadius: "0.75rem",
                padding: "1rem",
                backgroundColor: "blue",
                color: "white",
                fontSize: "1.25rem",
                cursor: "pointer",
              }}
              onClick={handleRegistration}
            >
              Sign in
            </button>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default Cover;
