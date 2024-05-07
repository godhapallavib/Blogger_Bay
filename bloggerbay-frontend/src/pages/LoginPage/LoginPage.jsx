import React, { useState } from "react";
import {
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  IconButton,
  Button,
  Input,
  Checkbox,
  Typography,
  Alert,
  Stack,
} from "@mui/material";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LoginIcon from "@mui/icons-material/Login";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [usernameInput, setUsernameInput] = useState();
  const [passwordInput, setPasswordInput] = useState();
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [formValid, setFormValid] = useState();
  const [success, setSuccess] = useState();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const navigate = useNavigate();

  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  const isUsername = (username) =>
    /^[a-zA-Z][a-zA-Z0-9_-]{2,15}$/i.test(username);

  // Validation for onBlur Username
  const handleUsername = () => {
    if (!isUsername(usernameInput)) {
      setUsernameError(true);
      return;
    }

    setUsernameError(false);
  };

  // Validation for onBlur Password
  const handlePassword = () => {
    if (
      !passwordInput ||
      passwordInput.length < 5 ||
      passwordInput.length > 20
    ) {
      setPasswordError(true);
      return;
    }

    setPasswordError(false);
  };

  //handle Submittion
  const handleSubmit = async () => {
    setSuccess(null);
    //First of all Check for Errors

    // If Username error is true
    if (usernameError || !usernameInput) {
      setFormValid("Username is Invalid. Please Re-Enter");
      return;
    }

    // If Password error is true
    if (passwordError || !passwordInput) {
      setFormValid(
        "Password is set btw 5 - 20 characters long. Please Re-Enter"
      );
      return;
    }
    setFormValid(null);

    const response = await axios.post("http://localhost:8888/signin", {
      user_name: usernameInput,
      password: passwordInput,
    });
    if (response.status === 200) {
      if (response.data.status !== 200) {
        setSuccess(response.data.message);
      } else {
        localStorage.setItem("username", usernameInput);
        localStorage.setItem("user_id", response.data.user.user_id);
        localStorage.setItem("role", response.data.user.role);
        navigate("/dashboard");
      }
    }

    //Show Successfull Submittion
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,

          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h5"
          align="center"
          color={"green"}
          paddingBottom={4}
        >
          Sign in to Blogger Bay
        </Typography>
        <div style={{ marginTop: "5px" }}>
          <TextField
            label="Username"
            fullWidth
            error={usernameError}
            id="standard-basic"
            variant="standard"
            sx={{ width: "100%" }}
            value={usernameInput}
            InputProps={{}}
            size="small"
            onBlur={handleUsername}
            onChange={(event) => {
              setUsernameInput(event.target.value);
            }}
          />
        </div>
        <div style={{ marginTop: "5px" }}>
          <FormControl sx={{ width: "100%" }} variant="standard">
            <InputLabel
              error={passwordError}
              htmlFor="standard-adornment-password"
            >
              Password
            </InputLabel>
            <Input
              error={passwordError}
              onBlur={handlePassword}
              id="standard-adornment-password"
              type={showPassword ? "text" : "password"}
              onChange={(event) => {
                setPasswordInput(event.target.value);
              }}
              value={passwordInput}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </div>

        <div style={{ marginTop: "10px" }}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<LoginIcon />}
            onClick={handleSubmit}
          >
            Sign In
          </Button>
        </div>

        {/* Show Form Error if any */}
        {formValid && (
          <Stack sx={{ width: "100%", paddingTop: "10px" }} spacing={2}>
            <Alert severity="error" size="small">
              {formValid}
            </Alert>
          </Stack>
        )}

        {/* Show Success if no issues */}
        {success && (
          <Stack sx={{ width: "100%", paddingTop: "10px" }} spacing={2}>
            <Alert severity="success" size="small">
              {success}
            </Alert>
          </Stack>
        )}

        <div style={{ marginTop: "7px", fontSize: "10px" }} margin="left">
          Don't have an account ?{" "}
          <Button variant="contained" onClick={() => navigate("/signup")}>
            <small>Sign Up</small>
          </Button>
        </div>
      </Box>
    </Container>
  );
};

export default Login;
