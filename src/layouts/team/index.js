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
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ErrorHandler from "../ErrorHandling/ErrorHandling";

function TeamList({ teams, handleDeleteTeam }) {
  const [open, setOpen] = React.useState(null);

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
              <ListItemSecondaryAction>
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
            </ListItem>
            <Collapse in={open === team._id} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem>
                  <Typography variant="body2" color="textSecondary">
                    Members: {team.members.length} | Admins:{" "}
                    {team.admins.length}
                  </Typography>
                </ListItem>
              </List>
            </Collapse>
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
          {/* <Paper style={{ marginTop: 20 }}>
            <List>
              {teams.map((team) => (
                <ListItem
                  key={team.id}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteTeam(team.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText primary={team.name} />
                </ListItem>
              ))}
            </List>
          </Paper> */}
          <TeamList teams={teams} handleDeleteTeam={handleDeleteTeam} />
        </Grid>
      </Grid>
      <Footer />
    </DashboardLayout>
  );
}

export default TeamPage;
