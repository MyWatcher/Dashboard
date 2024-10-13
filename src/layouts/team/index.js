import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Grid,
  Paper,
  Tooltip,
  Typography,
  ListItemSecondaryAction,
  Collapse,
  ListSubheader,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EmailIcon from "@mui/icons-material/Email";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ErrorHandler from "../ErrorHandling/ErrorHandling";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { func } from "prop-types";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function formatDate(dateString) {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return "Invalid Date"; // Handle invalid date format
  }

  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

function TeamReports({ team }) {
  const [reports, setReports] = useState([]);

  const retrieveMonthlyReports = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };
      const res = await axios.get("/api/api/report/road", config);
      console.log(res.data.data);
      setReports(res.data.data);
    } catch (error) {
      throw error.response?.data?.error || "An error occurred.";
    }
  };

  useEffect(() => {
    retrieveMonthlyReports();
  }, []);

  return (
    <Box sx={style}>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        Team: {team.name}
      </Typography>
      <Typography
        id="modal-modal-description"
        sx={{ mt: 2 }}
        style={{
          maxHeight: "30rem",
          overflow: "scroll",
        }}
      >
        {team.members.map((member) => (
          <div>
            <h4 style={{ marginTop: 10, marginBottom: 10 }}>{member.email}</h4>
            {reports
              .filter((report) => report.user._id !== member._id)
              .map((report) => (
                <div
                  style={{
                    display: "inline-flex",
                    gap: "1rem",
                    width: "100rem",
                  }}
                >
                  <p style={{ whiteSpace: "nowrap" }}>
                    date: {formatDate(report.startDate)}
                  </p>
                  <p style={{ whiteSpace: "nowrap" }}>
                    average bpm: {report.averageBpm}
                  </p>
                  <p style={{ whiteSpace: "nowrap" }}>
                    min bpm: {report.minBpm}
                  </p>
                  <p style={{ whiteSpace: "nowrap" }}>
                    max bpm: {report.maxBpm}
                  </p>
                  <p style={{ whiteSpace: "nowrap" }}>
                    average km: {report.averageBpm}
                  </p>
                  <p style={{ whiteSpace: "nowrap" }}>
                    total driving time: {report.totalDrivingTime}
                  </p>
                  <p style={{ whiteSpace: "nowrap" }}>
                    total drowsiness: {report.totalDrowsiness}
                  </p>
                  <p style={{ whiteSpace: "nowrap" }}>
                    total near drowsiness time: {report.totalNearDrowsinessTime}
                  </p>
                  <p style={{ whiteSpace: "nowrap" }}>
                    trip count: {report.tripCount}
                  </p>
                </div>
              ))}
          </div>
        ))}
      </Typography>
    </Box>
  );
}

function TeamList({ teams, handleDeleteTeam, handleInviteTeam }) {
  const [open, setOpen] = React.useState(null);
  const user = JSON.parse(localStorage.getItem("userData"));
  const [openModal, setOpenModal] = useState(false);

  const handleClick = (id) => {
    setOpen(open === id ? null : id);
  };

  return (
    <Paper style={{ marginTop: 20, padding: "0 20px 20px" }}>
      <List subheader={<ListSubheader component="div">Teams</ListSubheader>}>
        {teams.map((team) => (
          <React.Fragment key={team._id}>
            <ListItem button onClick={() => handleClick(team._id)}>
              <ListItemText
                primary={team.name}
                secondary={
                  team.description
                    ? team.description
                    : "No description provided"
                }
              />
              {open === team._id ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open === team._id} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem>
                  <Typography variant="body2" color="textSecondary">
                    Members: {team.members.length} | Admins:{" "}
                    {team.admins.length}
                  </Typography>
                </ListItem>
                {user._id === team.admins[0]._id && (
                  <ListItemSecondaryAction>
                    <Tooltip title="View team's reports">
                      <IconButton edge="end" onClick={() => setOpenModal(true)}>
                        <FolderOpenIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Add user to team">
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleInviteTeam(team.name)}
                      >
                        <EmailIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete team">
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteTeam(team._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                )}
              </List>
            </Collapse>
            <Modal
              open={openModal}
              onClose={() => setOpenModal(false)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <TeamReports team={team} />
            </Modal>
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
}

function TeamPage() {
  const [teams, setTeams] = useState([]);
  const [open, setOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [error, setError] = useState("");
  const [errorInvitation, setErrorInvitation] = useState("");
  const [openInvite, setOpenInvite] = useState(false);
  const [teamInvitation, setTeamInvitation] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };
    try {
      const response = await axios.get("/api/api/team/getMyTeams", config);
      console.log("response", response);
      setTeams(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCreateTeam = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };
    const body = {
      name: teamName,
      description: teamDescription,
    };
    try {
      const response = await axios.post(
        "/api/api/team/createTeam",
        body,
        config
      );
      setTeamName("");
      setTeamDescription("");
      fetchTeams();
      handleClose();
    } catch (error) {
      console.error(error);
      const errorMessage = "Duplicate team's name";
      setError(errorMessage);
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  const handleDeleteTeam = async (teamId) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };
    try {
      const response = await axios.delete(
        `/api/api/team/deleteTeam/${teamId}`,
        config
      );
      console.log("response", response);
      fetchTeams();
    } catch (error) {
      console.error(error);
    }
  };

  const handleInviteTeam = async (email, teamName) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    };
    const body = {
      teamName: teamName,
      email: email,
    };
    try {
      const response = await axios.post(
        "/api/api/team/addUserToTeam",
        body,
        config
      );
      fetchTeams();
      handleClose();
    } catch (error) {
      console.error(error);
      setErrorInvitation("Error in the request");
      setTimeout(() => {
        setErrorInvitation("");
      }, 5000);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid container spacing={2} style={{ padding: 20 }}>
        <Grid item xs={12} md={6}>
          <Button variant="contained" color="success" onClick={handleOpen}>
            Create Team
          </Button>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Create a New Team</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Team Name"
                type="text"
                fullWidth
                variant="outlined"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />
              <TextField
                margin="dense"
                label="Description"
                type="text"
                fullWidth
                variant="outlined"
                value={teamDescription}
                onChange={(e) => setTeamDescription(e.target.value)}
              />
            </DialogContent>
            {error && (
              <span
                style={{
                  width: "90%",
                  display: "inline-block",
                  borderRadius: "0.75rem",
                  padding: "0.25rem",
                  backgroundColor: "red",
                  color: "white",
                  textAlign: "center",
                  fontSize: "1.25rem",
                  marginBottom: 16,
                  marginLeft: "5%",
                }}
              >
                {error}
                <ErrorHandler message={error} />
              </span>
            )}
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleCreateTeam}>Create</Button>
            </DialogActions>
          </Dialog>
          <Dialog open={openInvite} onClose={() => setOpenInvite(false)}>
            <DialogTitle>
              Invite a user to the team {teamInvitation}
            </DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="user email"
                type="text"
                fullWidth
                variant="outlined"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </DialogContent>
            {errorInvitation && (
              <span
                style={{
                  width: "90%",
                  display: "inline-block",
                  borderRadius: "0.75rem",
                  padding: "0.25rem",
                  backgroundColor: "red",
                  color: "white",
                  textAlign: "center",
                  fontSize: "1.25rem",
                  marginBottom: 16,
                  marginLeft: "5%",
                }}
              >
                {errorInvitation}
                <ErrorHandler message={errorInvitation} />
              </span>
            )}
            <DialogActions>
              <Button onClick={() => setOpenInvite(false)}>Cancel</Button>
              <Button
                onClick={() => {
                  handleInviteTeam(inviteEmail, teamInvitation);
                }}
              >
                Invite
              </Button>
            </DialogActions>
          </Dialog>
          <TeamList
            teams={teams}
            handleDeleteTeam={handleDeleteTeam}
            handleInviteTeam={(team) => {
              setOpenInvite(true);
              setTeamInvitation(team);
            }}
          />
        </Grid>
      </Grid>
      <Footer />
    </DashboardLayout>
  );
}

export default TeamPage;
