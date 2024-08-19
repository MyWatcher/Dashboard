import { useState } from "react";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockResetIcon from '@mui/icons-material/LockReset';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import MDInput from "components/MDInput";
import axios from "axios";
import { useUser } from "assets/UserInformation/UserContext";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function PlatformSettings() {
  const [openModal, setOpenModal] = useState(false);
  const [openModalDeletePassword, setOpenModalDeletePassword] = useState(false);
  const [openModalDeleteAccount, setOpenModalDeleteAccount] = useState(false);
  const [deletePhrase, setDeletePhrase] = useState("");
  const [deletePhraseUser, setDeletePhraseUser] = useState({
    phrase : "",
  })
  const [error, setError] = useState("");
  const {user, updateUser} = useUser();
  const [changePasswordData, setChangePasswordData] = useState({
    password : "",
    newPassword : "",
    confirmPassword : "",
  });
  const [newMailData, setNewMailData] = useState({
    email : "",
    newEmail : "",
    password : "",
  });

  const handleOpenModal = () => setOpenModal(true);

  const handleOpenModalDeleteAccount = async () => {
    setOpenModalDeleteAccount(true);
    try {

      const responseDeletePhrase = await axios.post(
        "/api/api/auth/generate-delete-phrase",
      {},
      {
        headers : {
          "Content-Type" : "application/json",
        accept : "application/json",
      Authorization : `Bearer ${localStorage.getItem("authToken")}`
      }
      }
    )
    setDeletePhrase(responseDeletePhrase.data.deletePhrase);
  } catch (error) {
    console.error("test +", error)
    setOpenModalDeleteAccount(false);
    toast.error("Error while trying to delete account, try again later.")
  }
  }
  const handleCloseModalDeleteAccount = () => {
    setDeletePhrase("");
    setDeletePhraseUser({
      phrase : "",
    })
    setOpenModalDeleteAccount(false);
  }

  const handleOpenModalDeletePassword = () => setOpenModalDeletePassword(true);
  const handleCloseModalDeletePassword = () => setOpenModalDeletePassword(false);

  const handleCloseModal = () => {
    setNewMailData({
      email : "",
      newEmail : "",
      password : "",
    });
    setError("");
    setOpenModal(false);
  }
  const changeEmail = (e) => {
    setNewMailData({
      ...newMailData,
      [e.target.name]: e.target.value
    });
    setError("");
  };
  const changePassword = (e) => {
    setChangePasswordData({
      ...changePasswordData,
      [e.target.name]: e.target.value
    });
    setError("");
  }

  const handleSubmitDeleteAccount = async (e) => {
    e.preventDefault();

    if (!deletePhraseUser.phrase) {
      setError("You must fill all fields.")
      return;
    }
    if (deletePhraseUser.phrase !== deletePhrase) {
      setError("Delete phrase is incorrect.")
      return;
    }

    try {
      const response = await axios.delete(
        "/api/api/auth/confirm-delete-account/" + deletePhrase,
        {
          headers: {
            accept : "application/json",
            "Content-Type" : "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );
      setOpenModalDeleteAccount(false);
      localStorage.clear();
      window.location.href = "/authentication/sign-in?accountDeleted=true";
    } catch (error) {
      console.error(error.data);
      setOpenModalDeleteAccount(false);
      toast.error("Delete account failed. Try again later")
    }
  }


  const handleSubmitEmail = async (e) => {
    e.preventDefault();

    if (!newMailData.email || !newMailData.newEmail || !newMailData.password) {
      setError("You must fill all fields.")
      return;
    }
    if (newMailData.email === newMailData.newEmail) {
      setError("New email must be different from current email.")
      return;
    }
    if (newMailData.email !== user.email) {
      setError("Current email is incorrect.")
      return;
    }
    // if (newMailData.password !== user.password && user.password != "") {
    //   setError("Password is incorrect.")
    //   console.log(user.password);
    //   return;
    // }
    try {
      const response = await axios.put(
        "/api/api/user/account/email",
        {
          newEmail : newMailData.newEmail,
        },
        {
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          }
        },
      );
      setOpenModal(false);
      localStorage.clear();
      window.location.href = "authentication/sign-in?emailChanged=true";
      } catch (error) {
      console.error(error.data);
      setOpenModal(false);
      toast.error("Change email failed.")
    }
  }

  const handleSubmitNewPassword = async (e) => {
    e.preventDefault();

    if (!changePasswordData.password || !changePasswordData.newPassword || !changePasswordData.confirmPassword) {
      setError("You must fill all fields.")
      return;
    }
    if (changePasswordData.newPassword !== changePasswordData.confirmPassword) {
      setError("New password and confirm password must match.")
      return;
    }
    // if (changePasswordData.password !== user.password && user.password != "") {
    //   setError("Current password is incorrect.")
    //   return;
    // }
    if (changePasswordData.password === changePasswordData.newPassword) {
      setError("New password must be different from current password.")
      return;
    }
    try {
      const response = await axios.put(
        "/api/api/auth/change-password",
        {
          password : changePasswordData.newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          }
        },
      );
      setOpenModalDeletePassword(false);
      toast.success("Change password successful.")
      } catch (error) {
      console.error(error.data);
      setOpenModalDeletePassword(false);
      toast.error("Change password failed.")
      }
  }

  return (
    <Card sx={{ boxShadow: "none" }}>
      <MDBox p={2}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          Account Settings
        </MDTypography>
      </MDBox>
      <MDBox pt={1} pb={2} px={2} lineHeight={1.25}>
        <MDTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
          account
        </MDTypography>
        <MDBox display="flex" alignItems="center" mb={0.5} ml={-1.5}>
          <MDBox width="80%" ml={0.5} >
            <MDButton variant="contained" size="medium" color="info" circular={true} onClick={handleOpenModal}>
              <MailOutlineIcon size="large">MailIcon</MailOutlineIcon>&nbsp;
              Change email
            </MDButton>
          </MDBox>
        </MDBox>
        <MDBox display="flex" alignItems="center" mb={0.5} ml={-1.5}>
          <MDBox width="80%" ml={0.5}>
            <MDButton variant="contained" size="medium" color="info" circular={true} onClick={handleOpenModalDeletePassword}>
              <LockResetIcon size="large">LockIcon</LockResetIcon>&nbsp;
              Change Password
            </MDButton>
          </MDBox>
        </MDBox>
        <MDBox display="flex" alignItems="center" mb={0.5} ml={-1.5}>
          <MDBox width="80%" ml={0.5}>
            <MDButton variant="contained" size="medium" color="error" circular={true} onClick={handleOpenModalDeleteAccount}>
              <DeleteForeverIcon size="large">DeleteIcon</DeleteForeverIcon>&nbsp;
                Delete Account
            </MDButton>
          </MDBox>
        </MDBox>
        </MDBox>

        <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <MDBox sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Change Email
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {/* Modal content goes here, such as form inputs */}
            Enter your new email address.
            <MDBox mb={2}>
              <MDInput
                  type="email"
                  label="Email"
                  name="email"
                  value={newMailData.email}
                  onChange={changeEmail}
                  fullWidth
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                  type="email"
                  label="New email"
                  name="newEmail"
                  value={newMailData.newEmail}
                  onChange={changeEmail}
                  fullWidth
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                  type="password"
                  label="Password"
                  name="password"
                  value={newMailData.password}
                  onChange={changeEmail}
                  fullWidth
              />
            </MDBox>
          </Typography>
          {/* You can add form here */}
          <MDButton onClick={handleSubmitEmail}>Submit</MDButton>
          <MDButton onClick={handleCloseModal}>Close</MDButton>
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
        </MDBox>
      </Modal>
      <Modal
        open={openModalDeleteAccount}
        onClose={handleCloseModalDeleteAccount}
      >
        <MDBox sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            To delete your account please enter the following phrase:
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {/* Modal content goes here, such as form inputs */}
            {deletePhrase}
          </Typography>
          {/* You can add form here */}
          <MDBox mb={2}>
              <MDInput
                  type="phrase"
                  label="Delete Phrase"
                  name="phrase"
                  value={deletePhraseUser.phrase}
                  onChange={(e) => setDeletePhraseUser({
                    ...deletePhraseUser,
                    [e.target.name]: e.target.value
                  })}
                  fullWidth
              />
            </MDBox>
          <MDButton onClick={handleSubmitDeleteAccount}>Delete Account</MDButton>
          <MDButton onClick={handleCloseModalDeleteAccount}>Close</MDButton>
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
        </MDBox>
      </Modal>
      <Modal
        open={openModalDeletePassword}
        onClose={handleCloseModalDeletePassword}
      >
        <MDBox sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Change Password
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {/* Modal content goes here, such as form inputs */}
            A password reset link will be sent to your email address.
          </Typography>
          {/* You can add form here */}
          <MDBox mb={2}>
              <MDInput
                  type="password"
                  label="Current Password"
                  name="password"
                  value={changePasswordData.password}
                  onChange={changePassword}
                  fullWidth
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                  type="password"
                  label="New Password"
                  name="newPassword"
                  value={changePasswordData.newPassword}
                  onChange={changePassword}
                  fullWidth
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                  type="password"
                  label="Confirm New Password"
                  name="confirmPassword"
                  value={changePasswordData.confirmPassword}
                  onChange={changePassword}
                  fullWidth
              />
            </MDBox>
          <MDButton onClick={handleSubmitNewPassword}>Change password</MDButton>
          <MDButton onClick={handleCloseModalDeletePassword}>Close</MDButton>
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
        </MDBox>
      </Modal>
      <ToastContainer/>
    </Card>
  );
}

export default PlatformSettings;

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
