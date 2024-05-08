import { Card, CardContent, Typography } from "@mui/material";
import * as React from "react";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import FormControl from "@mui/joy/FormControl";
import Switch from "@mui/joy/Switch";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import ModalClose from "@mui/joy/ModalClose";
import DialogTitle from "@mui/joy/DialogTitle";
import Stack from "@mui/joy/Stack";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

const Blog = (props) => {
  const [blogs, setblogs] = useState([]);
  const [comments, setComments] = React.useState([...props.blog.comments]);
  const [message, setMessage] = React.useState("");
  const [prevMessage, setPrevMessage] = React.useState("");

  const onChange = (event) => {
    setMessage(event.target.value);
  };

  const fetchInfo = () => {
    return fetch("http://localhost:8888/blogs")
      .then((res) => res.json())
      .then((d) => setblogs(d));
  };
  const navigate = useNavigate();

  useEffect(() => {
    fetchInfo();
  }, []);

  const handleDelete = async (id) => {
    const response = await axios.post("http://localhost:8888/deleteBlog", {
      blog_id: id,
      role: localStorage.getItem("role"),
    });
    if (response.status === 200) {
      if (response.data.status !== 200) {
        alert(response.data.message);
      } else {
        fetchInfo();
        navigate("/dashboard");
        window.location.reload();
      }
    }
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddReply = async (message) => {
    comments.push({ reply: message });
    setComments([...comments]);
    const response = await axios.post("http://localhost:8888/addComment", {
      message: message,
      blog_id: props.blog.id,
    });
    if (response.status === 200) {
      alert("comment added successfully");
    }
    handleClose();
  };

  const [layout, setLayout] = React.useState(undefined);
  const [scroll, setScroll] = React.useState(true);
  const [settingEnabled, setSettingEnabled] = useState(false);

  const hangleToggleButton = async () => {
    if (!settingEnabled) {
      console.log("Generate AI response");
      console.log("message  ", message);
      setPrevMessage(message);
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo-0613",
          messages: [
            {
              role: "user",
              content: message + " give me in 6 words",
            },
          ],
          max_tokens: 50,
          temperature: 0.5,
        },
        {
          headers: {
            Authorization:
              "replace-with-your-key",
          },
        }
      );
      setMessage(response.data.choices[0].message.content.trim());
    } else {
      setMessage(prevMessage);
    }
    setSettingEnabled(!settingEnabled);
  };

  return (
    <Card sx={{ maxWidth: 345, minHeight: "400px" }}>
      <CardMedia
        component="img"
        alt={props.blog.title}
        height="140"
        image={props.blog.imageUrl}
      />
      <CardContent sx={{ minHeight: "200px" }}>
        <Typography gutterBottom variant="h5" component="div">
          {props.blog.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {props.blog.description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          variant="contained"
          sx={{ textTransform: "none" }}
          onClick={handleClickOpen}
        >
          Comment
        </Button>
        <Button
          size="small"
          variant="contained"
          color="error"
          disabled={!(localStorage.getItem("role") === "moderator")}
          sx={{ textTransform: "none" }}
          onClick={() => handleDelete(props.blog.id)}
        >
          Delete
        </Button>
        <Button
          size="small"
          variant="contained"
          color="success"
          sx={{ textTransform: "none" }}
          onClick={() => {
            setLayout("center");
          }}
        >
          view comments
        </Button>
        <React.Fragment>
          <Stack direction="row" spacing={1}></Stack>
          <Modal
            open={!!layout}
            onClose={() => {
              setLayout(undefined);
            }}
          >
            <ModalDialog layout={layout}>
              <ModalClose />
              <DialogTitle>Comments:</DialogTitle>
              <List
                sx={{
                  overflow: scroll ? "scroll" : "initial",
                  mx: "calc(-1 * var(--ModalDialog-padding))",
                  px: "var(--ModalDialog-padding)",
                  listStyleType: "disc",
                }}
              >
                {comments.map((item, index) => (
                  <ListItem key={index} sx={{ display: "list-item" }}>
                    {item.reply}
                  </ListItem>
                ))}
              </List>
            </ModalDialog>
          </Modal>
        </React.Fragment>
        <Dialog open={open} onClose={handleClose}>
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
                <TextField
                  margin="normal"
                  variant="standard"
                  required
                  fullWidth
                  id="comment"
                  label="Add a comment"
                  name="comment"
                  autoComplete="comment"
                  autoFocus
                  onChange={onChange}
                  value={message}
                />
              </Box>
            </Container>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              size="small"
              endIcon={<AddIcon />}
              onClick={() => handleAddReply(message)}
            >
              Add
            </Button>

            <Button
              onClick={handleClose}
              variant="contained"
              color="error"
              size="small"
            >
              Cancel
            </Button>

            <FormControlLabel
              control={
                <Switch
                  disabled={!message.length}
                  checked={settingEnabled}
                  onChange={hangleToggleButton}
                />
              }
              label="Enable response by Open AI"
            />
          </DialogActions>
        </Dialog>
      </CardActions>
    </Card>
  );
};

export default Blog;
