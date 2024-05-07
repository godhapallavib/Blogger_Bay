import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Blog from "../../components/Blog/Blog";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import axios from "axios";

const DashboardIndex = (props) => {
  const currentUrl = window.location.href.split("/") || [];
  const endpoint = currentUrl[currentUrl.length - 1];

  const [blogs, setblogs] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);

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

  let isSubscribed =
    subscriptions.findIndex(
      (subscription) =>
        subscription.category === endpoint &&
        subscription.user_id === localStorage.getItem("user_id")
    ) !== -1;

  useEffect(() => {
    fetchInfo();
    fetchSubscriptions();
  }, []);

  const isDashboard = endpoint === "dashboard";

  const finalBlogs = blogs.filter(
    (blog) =>
      isDashboard ||
      blog.category.toLowerCase().split(" ").join("_") === endpoint
  );

  const handleSubscribe = async () => {
    const response = await axios.post("http://localhost:8888/addsubscription", {
      user_id: localStorage.getItem("user_id"),
      category: endpoint,
    });

    if (response.data.status === 200) {
      alert(response.data.message);
      fetchSubscriptions();
      isSubscribed =
        subscriptions.findIndex(
          (subscription) =>
            subscription.category === endpoint &&
            subscription.user_id === localStorage.getItem("user_id")
        ) !== -1;
    } else {
      alert(response.data.message);
    }
  };

  const handleUnsubscribe = async () => {
    const response = await axios.post(
      "http://localhost:8888/deletesubscription",
      {
        user_id: localStorage.getItem("user_id"),
        category: endpoint,
      }
    );

    if (response.data.status === 200) {
      alert(response.data.message);
      fetchSubscriptions();
      isSubscribed =
        subscriptions.findIndex(
          (subscription) =>
            subscription.category === endpoint &&
            subscription.user_id === localStorage.getItem("user_id")
        ) !== -1;
    } else {
      alert(response.data.message);
    }
  };

  return (
    <Container>
      <Typography align="center" variant="h4">
        Blogs
      </Typography>
      <Box sx={{ display: "flex" }}>
        <Grid container spacing={3} paddingTop={8} sx={{ display: "flex" }}>
          {finalBlogs.length > 0 ? (
            finalBlogs
              .filter(
                (blog) =>
                  isDashboard ||
                  blog.category.toLowerCase().split(" ").join("_") === endpoint
              )
              .map((blog) => (
                <Grid item>
                  <Blog blog={blog} />
                </Grid>
              ))
          ) : (
            <Typography>No Blogs to show</Typography>
          )}
        </Grid>
      </Box>
      {!isDashboard && (
        <Box sx={{ display: "flex", paddingTop: "16px" }}>
          <Button
            onClick={() => handleSubscribe()}
            variant="contained"
            color="primary"
            sx={{ textTransform: "none", mr: 1 }}
            disabled={isSubscribed}
          >
            Subscribe
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleUnsubscribe()}
            sx={{ textTransform: "none", ml: 1 }}
            disabled={!isSubscribed}
          >
            Un-Subscribe
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default DashboardIndex;
