import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const LoginPage = (props) => {
  const theme = useTheme();
  const host = "http://localhost:5000"
  const [credentials, setCredentials] = useState({email: "", password: ""})
  let navigate = useNavigate();
  const onChange = (e) =>{
      setCredentials({...credentials, [e.target.name]: e.target.value})
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        console.log('hi');
      const response = await fetch(`${host}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: credentials.email, password: credentials.password }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();

      if (!json.success) {
        // props.showAlert("Please login with correct credentials.", "danger");
      } else {
        localStorage.setItem("token", json.authtoken);
        navigate("/users");
        // props.showAlert("Logged in successfully.", "success");
      }
    } catch (error) {
      console.error("Login failed:", error);
    //   props.showAlert("An error occurred. Please try again later.", "danger");
    }
  };
  return (
    <Container component="main" maxWidth="xs" sx={{ height: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ padding: 4 }}>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Login
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <form>

                <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={onChange}
                value={credentials.email} 
                autoFocus
                />
                <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                onChange={onChange}
                value={credentials.password}
                autoComplete="current-password"
                />
                <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleSubmit}
                >
                Sign In
                </Button>
                {/* <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2">
                    Don't have an account? <a href="/signup">Sign Up</a>
                </Typography>
                </Box> */}
        
            </form>
            </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
