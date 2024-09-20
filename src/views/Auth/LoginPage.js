import React, { useContext, useState } from 'react';
import { Container, Box, Typography, TextField, Button, Paper, Checkbox, FormControlLabel, Link } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AlertContext } from '../../context/AlertContext';
import CustomSnackbar from "../../views/Components/CustomSnackbar";

const LoginPage = (props) => {
  const { snackbarOpen, alert, closeAlert } = useContext(AlertContext);
  const { showAlert } = useContext(AlertContext);
  const theme = useTheme();
  const host = "http://localhost:5000";
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({}); // State to store errors
  const { login } = useAuth();

  let navigate = useNavigate();

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  
  const validateForm = () => {
    const newErrors = {};
  
    // Required field validation for email
    if (!credentials.email) {
      newErrors['email'] = 'Email is required.';
    } else {
      // Email format validation
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(credentials.email)) {
        newErrors['email'] = 'Enter a valid Email.';
      }
    }
  
    // Required field validation for password
    if (!credentials.password) {
      newErrors['password'] = 'Password is required.';
    } else {
      // Password length validation
      if (credentials.password.length < 6) {
        newErrors['password'] = 'Password must be at least 6 characters long.';
      }
    }
  
    setErrors(newErrors);
  
    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(validateForm()){
          const response = await fetch(`${host}/api/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password }),
          });

          const json = await response.json();
          // console.log(json.error)
          if (json.error) {
            showAlert(""+json.error,'error');
            // Handle error, show alert
          } else {
            login( json.user , json.authtoken);
            localStorage.setItem("token", json.authtoken);
            showAlert('Logged in successfully.','success');
            navigate("/users");
          }
        }
    } catch (error) {
      showAlert('Something went wrong! Please try again later.','error');
      console.error("Login failed:", error);
    }
  };

  return (
    <Box
      sx={{
        // background: 'linear-gradient(135deg, #6b73ff 10%, #000dff 100%)',
        minHeight: '90vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center', 
      }}
    >
      <Container component="main" maxWidth="xs">
        <Paper elevation={6} sx={{ p: 4, borderRadius: 2, boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.2)' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
              Welcome Back
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: '#777' }}>
              Please sign in to your account
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={onChange}
                value={credentials.email}
                error={Boolean(errors.email)} 
                helperText={errors.email} 
                autoFocus
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <TextField
                margin="normal"
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                onChange={onChange}
                value={credentials.password}
                error={Boolean(errors.password)} 
                helperText={errors.password} 
                autoComplete="current-password"
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <FormControlLabel
                  control={<Checkbox checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} color="primary" />}
                  label="Remember me"
                />
                <Link href="#" variant="body2" sx={{ textDecoration: 'none' }}>
                  Forgot password?
                </Link>
              </Box>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{
                  mt: 2,
                  py: 1.5,
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.2)',
                }}
              >
                Sign In
              </Button>
            </Box>
          </Box>
        </Paper>
        <CustomSnackbar open={snackbarOpen} onClose={closeAlert} alert={alert} />
      </Container>
    </Box>
  );
};

export default LoginPage;
