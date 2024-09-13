import React, { useContext, useState } from 'react'
import {
  Card,
  CardContent,
  Divider,
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Grid,
  RadioGroup,
  Radio,
  FormControl,
  MenuItem,
} from "@mui/material";
import userContext from '../../context/UserContext';

const numbers = [
  {
    value: 1,
    label: "One",
  },
  {
    value: 2,
    label: "Two",
  },
  {
    value: 3,
    label: "Three",
  },
  {
    value: 4,
    label: "Four",
  },
];

const User = (props) => {
  const context = useContext(userContext);
const {addUser}= context;
const [user, setUser] = useState({name: "", lastname: "", email: "", contact_number:"", role_id: 0});
const handleClick = (e) =>{
    e.preventDefault();
    addUser(user.name, user.lastname, user.email, user.contact_number, user.role_id);
    // props.showAlert("User added successfully.","success");
    setUser({name: "", lastname: "", email: "", contact_number:"", role_id: 0});
}
const onChange = (e) =>{
  setUser({...user, [e.target.name]: e.target.value})
}
  const [state, setState] = React.useState({
    checkedA: false,
    checkedB: false,
    checkedC: false,
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const [value, setValue] = React.useState("");

  const handleChange2 = (event) => {
    setValue(event.target.value);
  };

  const [number, setNumber] = React.useState("");

  const handleChange3 = (event) => {
    setNumber(event.target.value);
  };
  return (
    <div>
      <Grid container spacing={0}>
      <Grid item lg={12} md={12} xs={12}>
        <Card
          variant="outlined"
          sx={{
            p: 0,
          }}
        >
          <Box
            sx={{
              padding: "15px 30px",
            }}
            display="flex"
            alignItems="center"
          >
            <Box flexGrow={1}>
              <Typography
                sx={{
                  fontSize: "18px",
                  fontWeight: "500",
                }}
              >
                User Form
              </Typography>
            </Box>
          </Box>
          <Divider />
          <CardContent
            sx={{
              padding: "30px",
            }}
          >
            <form>
              <TextField
                id="name"
                name="name"
                label="First Name"
                variant="outlined"
                // defaultValue="George deo"
                fullWidth
                onChange={onChange}
                value={user.name}
                sx={{
                  mb: 2,
                }}
              />
               <TextField
                id="lastname"
                name="lastname"
                label="Last Name"
                variant="outlined"
                // defaultValue="George deo"
                fullWidth
                onChange={onChange}
                value={user.lastname}
                sx={{
                  mb: 2,
                }}
              />
              <TextField
                id="email"
                name="email"
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                onChange={onChange}
                value={user.email}
                sx={{
                  mb: 2,
                }}
              />
               <TextField
                id="contact-number"
                label="Contact Number"
                type="number"
                // maxSize="10"
                variant="outlined"
                // defaultValue="George deo"
                fullWidth
                onChange={onChange}
                value={user.name}
                sx={{
                  mb: 2,
                }}
              />
              <TextField
                id="outlined-password-input"
                label="Password"
                type="password"
                autoComplete="current-password"
                variant="outlined"
                fullWidth
                sx={{
                  mb: 2,
                }}
              />
             
              <Grid
                container
                spacing={0}
                sx={{
                  mb: 2,
                }}
              >
               
             
              </Grid>
              <TextField
                fullWidth
                id="role_id"
                variant="outlined"
                select
                label="Select User Role"
                value={number}
                
                onChange={[handleChange3,onChange]}
                sx={{
                  mb: 2,
                }}
              >
                {numbers.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <div>
                <Button color="primary" variant="contained">
                  Submit
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
    </div>
  )
}

export default User
