import React, { useState } from "react";

// Material UI Imports
import {
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  IconButton,
  Button,
  Input,
  Alert,
  Stack,
  Typography,
} from "@mui/material";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LoginIcon from "@mui/icons-material/Login";
import axios from "axios";

// Email Validation
const isEmail = (email) =>
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

export const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);

  //Inputs
  const [usernameInput, setUsernameInput] = useState();
  const [roleInput, setRoleInput] = useState();
  const [passwordInput, setPasswordInput] = useState();

  // Inputs Errors
  const [usernameError, setUsernameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  // Overall Form Validity
  const [formValid, setFormValid] = useState();
  const [success, setSuccess] = useState();

  // Handles Display and Hide Password
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // Label for Checkbox
  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  // Validation for onBlur Username
  const handleUsername = () => {
    if (!usernameInput) {
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

    // IF username error is true
    if (usernameError || !usernameInput) {
      setFormValid(
        "Username is set btw 5 - 15 characters long. Please Re-Enter"
      );
      return;
    }

    // If Email error is true
    if (emailError || !roleInput) {
      setFormValid("Email is Invalid. Please Re-Enter");
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

    const response = await axios.post("http://localhost:8888/signup", {
      username: usernameInput,
      password: passwordInput,
      role: roleInput,
    });
    if (response.status === 200) {
      if (response.data.status !== 200) {
        alert(response.data.message);
      } else {
        alert(response.data.message);
        navigate("/signin");
      }
    }

    //Show Successfull Submittion
    setSuccess("Signup is Successful, you will be redirected to Sign In page");
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
          Sign up to Blogger Bay
        </Typography>
        <div style={{ marginTop: "10px" }}>
          <TextField
            error={usernameError}
            label="Username"
            id="standard-basic"
            variant="standard"
            sx={{ width: "100%" }}
            size="small"
            value={usernameInput}
            InputProps={{}}
            onChange={(event) => {
              setUsernameInput(event.target.value);
            }}
            onBlur={handleUsername}
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
            <div style={{ marginTop: "5px" }}>
              <TextField
                label="Role"
                fullWidth
                id="standard-basic"
                variant="standard"
                sx={{ width: "100%" }}
                value={roleInput}
                InputProps={{}}
                size="small"
                onChange={(event) => {
                  setRoleInput(event.target.value);
                }}
              />
            </div>
          </FormControl>
        </div>

        <div style={{ marginTop: "10px" }}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<LoginIcon />}
            onClick={handleSubmit}
          >
            Sign Up
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
          Already have an account ?{" "}
          <Button variant="contained" onClick={() => navigate("/signin")}>
            <small>Sign In</small>
          </Button>
        </div>
      </Box>
    </Container>
  );
};

export default SignUp;
