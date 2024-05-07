import { AppBar, Toolbar, Typography } from "@mui/material";
import colorConfigs from "../../themeConfig/colorConfig";
import sizeConfigs from "../../themeConfig/sizeConfig";
import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import Badge from "@mui/material/Badge";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import ModalClose from "@mui/joy/ModalClose";
import Stack from "@mui/joy/Stack";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import RealTimeSearch from "../Search/Search";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";
import CustomGoogleMap from "../../pages/Maps/GoogleMap";

const Topbar = () => {
  const [open, setOpen] = React.useState(false);
  const [activityOpen, setActivityOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleActivityOpen = () => {
    setActivityOpen(true);
  };

  const handleActivityClose = () => {
    setActivityOpen(false);
  };
  const navigate = useNavigate();

  const [blogs, setblogs] = useState([]);

  const [subscriptions, setSubscriptions] = useState([]);

  const [layout, setLayout] = React.useState(undefined);
  const [scroll, setScroll] = React.useState(true);
  const [recommendations, setRecommendations] = React.useState(undefined);

  const [weather, setWeather] = React.useState(undefined);

  const [locationCoordinates, setLocationCoordinates] = useState([]);
  const handleCoordinates = (data) => {
    let array =
      data.restaurants.map((key, index) => {
        return {
          latitude: key.locationCoordinates.latitude,
          longitude: key.locationCoordinates.longitude,
          locationName: key.locationName,
          timings: key.timings,
          category: "restaurant",
        };
      }) || [];

    let music_events =
      data.music_events.map((key, index) => {
        return {
          latitude: key.locationCoordinates.latitude,
          longitude: key.locationCoordinates.longitude,
          locationName: key.locationName,
          timings: key.timings,
          category: "music",
        };
      }) || [];

    let sport_events =
      data.sport_events.map((key, index) => {
        return {
          latitude: key.locationCoordinates.latitude,
          longitude: key.locationCoordinates.longitude,
          locationName: key.locationName,
          timings: key.timings,
          category: "sports",
        };
      }) || [];
    setLocationCoordinates([...array, ...music_events, ...sport_events]);
  };

  const fetchInfo = () => {
    return fetch("http://localhost:8888/blogs")
      .then((res) => res.json())
      .then((d) => setblogs(d));
  };

  const fetchSubscriptions = () => {
    return fetch("http://localhost:8888/subscriptions")
      .then((res) => res.json())
      .then((d) => setSubscriptions(d));
  };

  const fetchRecommendations = () => {
    return fetch("http://localhost:8888/recommendations")
      .then((res) => res.json())
      .then((d) => {
        setRecommendations(d.activitieData);
        setWeather(d.weather);
        handleCoordinates(d.activitieData);
      });
  };

  useEffect(() => {
    fetchInfo();
    fetchSubscriptions();
    fetchRecommendations();
  }, []);
  let array = [];

  const filteredRows = subscriptions.filter(
    (key) => key.user_id === localStorage.getItem("user_id")
  );

  for (let index = 0; index < filteredRows.length; index++) {
    const element = filteredRows[index];
    let rows = blogs.filter(
      (key) =>
        key.category.toLowerCase().split(" ").join("_") === element.category &&
        new Date(key.blogCreatedDate) > new Date(element.time_stamp) &&
        key.user_id !== element.user_id
    );

    rows.map((key) =>
      array.push(`${key.username} added a post on ${key.category}`)
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const response = await axios.post("http://localhost:8888/createblog", {
      title: data.get("post_title"),
      category: data.get("category"),
      image_url: data.get("image_url"),
      blog_creation_date: new Date(),
      description: data.get("description"),
      user_id: localStorage.getItem("user_id"),
    });
    if (response.status === 200) {
      if (response.data.status === 200) {
        fetchInfo();
        handleClose();
        navigate("/dashboard");
        window.location.reload();
      } else {
        alert(response.data.message);
      }
    }
  };

  const handleMarkAsRead = async () => {
    const response = await axios.post(
      "http://localhost:8888/updatesubscription",
      {
        user_id: localStorage.getItem("user_id"),
      }
    );
    if (response.data.status === 200) {
      array.length = 0;
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${sizeConfigs.sidebar.width})`,
        ml: sizeConfigs.sidebar.width,
        boxShadow: "unset",
        backgroundColor: colorConfigs.topbar.bg,
        color: colorConfigs.topbar.color,
      }}
    >
      <Toolbar>
        <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
          Blogger Bay
        </Typography>
        <RealTimeSearch />
        <Button
          onClick={() => {
            setLayout("center");
          }}
        >
          <Badge badgeContent={array.length} color="success">
            <NotificationsActiveIcon color="error" />
          </Badge>
        </Button>
        <Button
          color="success"
          sx={{
            fontSize: "20px",
            textTransform: "none",
            paddingRight: "8px",
            fontWeight: "500",
          }}
          onClick={handleActivityOpen}
          variant="contained"
        >
          Recommended for you
        </Button>
        <Button
          color="info"
          sx={{
            fontSize: "20px",
            textTransform: "none",
            paddingRight: "8px",
            fontWeight: "500",
            ml: 1,
          }}
          onClick={handleClickOpen}
          variant="contained"
        >
          Add Blog
        </Button>

        <Button
          color="error"
          sx={{
            fontSize: "20px",
            textTransform: "none",
            fontWeight: "500",
            ml: 1,
          }}
          onClick={() => {
            localStorage.removeItem("username");
            localStorage.removeItem("user_id");
            localStorage.removeItem("role");
            navigate("/signin");
          }}
          variant="contained"
        >
          Sign out
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle align="center">Add a Blog</DialogTitle>
          <DialogContent>
            <Container component="main" maxWidth="xs">
              <CssBaseline />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  noValidate
                  sx={{ mt: 1 }}
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="post_title"
                    label="Title"
                    variant="standard"
                    name="post_title"
                    autoComplete="post_title"
                    autoFocus
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="image_url"
                    variant="standard"
                    label="Image Url"
                    id="image_url"
                    autoComplete="image_url"
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    variant="standard"
                    name="category"
                    label="Category"
                    id="category"
                    autoComplete="category"
                  />
                  <TextField
                    margin="normal"
                    fullWidth
                    required
                    variant="standard"
                    name="description"
                    label="Description"
                    id="description"
                    autoComplete="description"
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="success"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Add Blog
                  </Button>
                </Box>
              </Box>
            </Container>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={activityOpen} onClose={handleActivityClose} width="800px">
          <DialogTitle align="center">
            <Typography variant="h5" fontWeight={600}>
              Recommended Activity
            </Typography>
            <Typography variant="h6" fontWeight={500}>
              by Open AI
            </Typography>
          </DialogTitle>
          <Divider></Divider>
          <DialogContent>
            <Container component="main" maxWidth="xs">
              <CssBaseline />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box component="form" noValidate sx={{ mt: 1 }}>
                  {recommendations ? (
                    <>
                      <Typography variant="h5">Musical Events</Typography>
                      <ul>
                        {recommendations.music_events.map((event, index) => (
                          <li key={index}>
                            <Typography variant="body1" fontWeight={550}>
                              {event.locationName}
                            </Typography>
                            <Typography variant="body2">
                              {event.details}
                            </Typography>
                          </li>
                        ))}
                      </ul>
                      <br />
                      <Typography variant="h5">Restaurants</Typography>
                      <ul>
                        {recommendations.restaurants.map((event, index) => (
                          <li key={index}>
                            <Typography variant="body1" fontWeight={550}>
                              {event.locationName}
                            </Typography>
                            <Typography variant="body2">
                              {event.details}
                            </Typography>
                          </li>
                        ))}
                      </ul>

                      <br />
                      <Typography variant="h5">Sports Events</Typography>
                      <ul>
                        {recommendations.sport_events.map((event, index) => (
                          <li key={index}>
                            <Typography variant="body1" fontWeight={550}>
                              {event.locationName}
                            </Typography>
                            <Typography variant="body2">
                              {event.details}
                            </Typography>
                          </li>
                        ))}
                      </ul>
                      <Divider />
                      <CustomGoogleMap
                        locationDetails={locationCoordinates}
                        weather={weather}
                      />
                    </>
                  ) : (
                    <>
                      <Typography>
                        Fetching recommendations for you, please wait
                      </Typography>

                      <Box sx={{ width: "100%" }}>
                        <LinearProgress color="success" />
                      </Box>
                    </>
                  )}
                </Box>
              </Box>
            </Container>
          </DialogContent>
          <Divider></Divider>
          <DialogActions>
            <Button
              onClick={handleActivityClose}
              sx={{ textTransform: "none" }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <React.Fragment>
          <Stack direction="row" spacing={1}></Stack>
          <Modal
            open={!!layout}
            onClose={() => {
              setLayout(undefined);
              handleMarkAsRead();
              window.location.reload();
            }}
          >
            <ModalDialog layout={layout}>
              <ModalClose />
              <DialogTitle>Notifications:</DialogTitle>
              <List
                sx={{
                  overflow: scroll ? "scroll" : "initial",
                  mx: "calc(-1 * var(--ModalDialog-padding))",
                  px: "var(--ModalDialog-padding)",
                  listStyleType: "disc",
                }}
              >
                {array.map((item, index) => (
                  <ListItem key={index} sx={{ display: "list-item" }}>
                    <Typography color={"red"}>{item}</Typography>
                  </ListItem>
                ))}
              </List>
              <Button
                mt={1}
                disabled={array.length === 0}
                color="info"
                sx={{ textTransform: "none" }}
                onClick={() => {
                  handleMarkAsRead();
                  setLayout(undefined);
                  window.location.reload();
                }}
              >
                Mark as read
              </Button>
            </ModalDialog>
          </Modal>
        </React.Fragment>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
