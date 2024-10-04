import React, { useContext, useEffect, useRef, useState } from 'react'
import {
  Card, CardContent, Divider, Box, Typography, TextField,
  MenuItem, Grid2, Fab, 
  InputLabel, OutlinedInput, InputAdornment, FormControl,
  Button,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon, Search } from '@mui/icons-material';

import UserContext from '../../context/UserContext';
import RoleContext  from '../../context/RoleContext';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext'; 
import { Button as PrimeButton } from 'primereact/button'; 
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'; 
import { AlertContext } from "../../context/AlertContext";
import { useNavigate } from 'react-router-dom';

const UserView = (props) => {
  const navigate = useNavigate();

  const { showAlert } = useContext(AlertContext);
  const fileInputRef = useRef(null);
  const { users, getAllUsers, addUser, deleteUser, updateUser } = useContext(UserContext);
  const { roles, setRoles, getAllRoles } = useContext(RoleContext);

  const [user, setUser] = useState({name: "", lastname: "", email: "", password:"", confirm_password: "", contact_number:"", role_id: 0, profile_pic: ""});
  const [errors, setErrors] = useState({}); // State to store errors
  const [editMode, setEditMode] = useState(false); // Flag for edit mode
  const columns = [
    { field: 'name', header: 'First Name' },
    { field: 'lastname', header: 'Last Name' },
    { field: 'email', header: 'Email' },
    { field: 'contact_number', header: 'Contact No' }
  ];
  const indexBodyTemplate = (rowData, { rowIndex }) => {
    return <span>{rowIndex + 1}</span>; // Indexing starts from 1
  };

  const [number, setNumber] = React.useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);  // State for image preview
  const handleChange3 = (event) => {
    setNumber(event.target.value);
    // user.role_id = event.target.value;
    setUser((prevUser) => ({ ...prevUser, role_id: event.target.value }));
  };
  useEffect(()=>{
    if(localStorage.getItem('token')){
      getAllUsers();
      getAllRoles();
    }
    else{
      navigate('/login')
    }
    //eslint-disable-next-line
    
  },[user])
  const handleEdit = (user) => {
    setErrors({});
    setUser({
      _id: user._id,
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      contact_number: user.contact_number,
      password:"",
      confirm_password:"",
      role_id: user.role_id,
      profile_pic: user.profile_pic,
    });
    setNumber(user.role_id);
    setEditMode(true);
     // Set the preview image for the existing user profile picture
    if (user.profile_pic) {
      // Assuming the image is served from 'http://localhost:5000/uploads/'
      setPreviewImage(`http://localhost:5000/uploads/${user.profile_pic}`);
    } else {
      setPreviewImage(null);  // Clear the preview if no image exists
    }
    window.scrollTo({
      top: 0, // Scroll to the top of the page
      behavior: 'smooth' // Optional: smooth scroll
    });
    console.log('Edit clicked for user:', user);
    // Add your edit logic here
  };

  // Handler for delete action
  const handleDelete = (user) => {
    // setUser(user); // Store the user to delete
    confirmDialog({
      message: 'Are you sure you want to delete this user?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => deletingUser(user), // Call delete function if confirmed
      reject: () => console.log('Delete rejected')
    });
  };
  // Delete function after confirmation
  const deletingUser = async (user) => {
    await deleteUser(user._id);
    showAlert('User has been deleted.','success');
    console.log('Deleted user:', user);
    // Add your actual delete logic here (e.g., API call)
  };

  // Action buttons column
  const actionBodyTemplate = (rowData) => {
    return (
      <>        
        <Fab 
          type='button'
          color="success" 
          size="small" 
          onClick={() => handleEdit(rowData)} 
          style={{ marginRight: '4px' }}
        >
          <EditIcon />
        </Fab>

        <Fab 
          type='button'
          color="error" 
          size="small" 
          onClick={() => handleDelete(rowData)}
        >
          <DeleteIcon />
        </Fab>
      </>
    );
  };
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (user.name.length < 3) {
      newErrors['name'] = 'Enter a valid First Name. It must be at least 3 characters long.';
    }

    // Lastname validation
    if (user.lastname.length < 3) {
      newErrors['lastname'] = 'Enter a valid Last Name. It must be at least 3 characters long.';
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(user.email)) {
      newErrors['email'] = 'Enter a valid Email.';
    }

    // Contact number validation
    if (user.contact_number.length < 10) {
      newErrors['contact_number'] = 'Contact number must be at least 10 characters long.';
    }

    // Password validation
    if (user.password.length < 6) {
      newErrors['password'] = 'Password must be at least 6 characters long.';
    }

    // Confirm password validation
    if (user.confirm_password === '') {
      newErrors['confirm_password'] = 'Confirm password field is required.';
    } else if (user.password !== user.confirm_password) {
      newErrors['confirm_password'] = 'Passwords do not match.';
    }

    if (user.role_id==0) {
      newErrors['role_id'] = 'Role is required.';
    }
    setErrors(newErrors);

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) =>{
      e.preventDefault();
      
      try{
        if(validateForm()){
          console.log('all ok');
          if(!editMode){
            await addUser(user.name, user.lastname, user.email, user.contact_number, user.password, user.role_id, selectedFile);
            showAlert('User has been created.','success');

          }
          else{
            await updateUser(user._id, user.name, user.lastname, user.email, user.contact_number, user.password, user.role_id, selectedFile);
            showAlert('User has been updated.','success');
            setEditMode(false);
          }
          setErrors({});
          // props.showAlert("User added successfully.","success");
          resetForm();
        }
      }
      catch (error) {
        showAlert('Something went wrong! Please try again later.','error');

        console.error('Error:', error); // Log the full error object
        // Assuming error response contains error messages for each field
        if (error.response && error.response.data.errors) {
          console.log(error.response);
          setErrors(error.response.data.errors);
        }
      }
  }
const onChange = (e) =>{
  setUser({...user, [e.target.name]: e.target.value})
  setErrors({ ...errors, [e.target.name]: "" }); // Clear error for the field
}
const [globalFilter, setGlobalFilter] = useState(''); // State to hold the search term

// Function to handle search input change
const onGlobalFilterChange = (e) => {
  setGlobalFilter(e.target.value);
};

const onFileChange = (e) => {
  const file = e.target.files[0];
  setSelectedFile(file);

  // Set the file name in the user state just for display purposes
  setUser((prevUser) => ({ ...prevUser, profile_pic: file })); 
  // Generate image preview
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);  // Set the image preview URL
    };
    reader.readAsDataURL(file);  // Read the image file
  } else {
    setPreviewImage(null);
  }
};
const resetForm = () => {
  setUser({ name: "", lastname: "", email: "", contact_number: "", password: "", confirm_password: "", role_id: 0, profile_pic: "" });
  setNumber(0);
  setSelectedFile(null);
  setPreviewImage(null); 
  setEditMode(false);
  setErrors({});
  fileInputRef.current.value = ''; // Reset the file input
};
  // const [state, setState] = React.useState({
  //   checkedA: false,
  //   checkedB: false,
  //   checkedC: false,
  // });

  // const handleChange = (event) => {
  //   setState({ ...state, [event.target.name]: event.target.checked });
  // };

  // const [value, setValue] = React.useState("");

  // const handleChange2 = (event) => {
  //   setValue(event.target.value);
  // };

  return (
    <div>
     
      <Grid2 container spacing={{ xs: 2, md: 3 }}>
      <Grid2 size={{ xs: 12, md: 12 }}>
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

            <form encType='multipart/form-data' onSubmit={handleSubmit}>
            <Grid2 container spacing={{ xs: 2, md: 3 }}>
            <Grid2 size={{ xs: 6, md: 4 }}>
                <TextField
                    id="name"
                    name="name"
                    label="First Name"
                    variant="outlined"
                    fullWidth
                    onChange={onChange}
                    value={user.name}
                    error={Boolean(errors.name)}
                    helperText={errors.name}
                    sx={{ mb: 2 }}
                />
              </Grid2>
              <Grid2 size={{ xs: 6, md: 4 }}>
                <TextField
                  id="lastname"
                  name="lastname"
                  label="Last Name"
                  variant="outlined"
                  // defaultValue="George deo"
                  fullWidth
                  onChange={onChange}
                  value={user.lastname}
                  error={Boolean(errors.lastname)} // Highlights the input field if there's an error
                  helperText={errors.lastname} // Displays the error message
                  sx={{
                    mb: 2,
                  }}
                />
              </Grid2>
              <Grid2 size={{ xs: 6, md: 4 }}>
                <TextField
                  id="email"
                  name="email"
                  label="Email"
                  type="email"
                  variant="outlined"
                  fullWidth
                  onChange={onChange}
                  value={user.email}
                  error={Boolean(errors.email)} // Highlights the input field if there's an error
                  helperText={errors.email} // Displays the error message
                  sx={{
                    mb: 2,
                  }}
                />
                </Grid2>
                <Grid2 size={{ xs: 6, md: 4 }}>
                <TextField
                  id="contact_number"
                  name="contact_number"
                  label="Contact Number"
                  type="number"
                  variant="outlined"
                  // defaultValue="George deo"
                  fullWidth
                  onChange={onChange}
                  value={user.contact_number}
                  error={Boolean(errors.contact_number)} // Highlights the input field if there's an error
                  helperText={errors.contact_number} // Displays the error message
                  sx={{
                    mb: 2,
                  }}
                />
              </Grid2>
              <Grid2 size={{ xs: 6, md: 4 }}>
                <TextField
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  // autoComplete="current-password"
                  variant="outlined"
                  fullWidth
                  onChange={onChange}
                  value={user.password}
                  error={Boolean(errors.password)} // Highlights the input field if there's an error
                  helperText={errors.password} // Displays the error message
                  sx={{
                    mb: 2,
                  }}
                />
              </Grid2>
              <Grid2 size={{ xs: 6, md: 4 }}>
                <TextField
                  id="confirm_password"
                  name="confirm_password"
                  label="Confirm Password"
                  type="password"
                  // autoComplete="current-password"
                  variant="outlined"
                  fullWidth
                  onChange={onChange}
                  value={user.confirm_password}
                  error={Boolean(errors.confirm_password)} // Highlights the input field if there's an error
                  helperText={errors.confirm_password} // Displays the error message
                  sx={{
                    mb: 2,
                  }}
                />
              </Grid2>
              <Grid2 size={{ xs: 6, md: 4 }}>
             
                <TextField
                  fullWidth
                  id="role_id"
                  name="role_id"
                  variant="outlined"
                  select
                  label="Select User Role"
                  value={number}                
                  onChange={handleChange3}
                  error={Boolean(errors.role_id)} // Highlights the input field if there's an error
                  helperText={errors.role_id} // Displays the error message
                  sx={{
                    mb: 2,
                  }}
                >
                {Array.isArray(roles) && roles.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid2>
              <Grid2 size={{ xs: 6, md: 4 }}>
                {/* File input for profile picture */}
                <TextField
                    id="profile_pic"
                    name="profile_pic"
                    type="file"
                    variant="outlined"
                    fullWidth
                    accept="image/*"
                    onChange={onFileChange}
                    ref={fileInputRef}
                    sx={{ mb: 2 }}
                  />
              </Grid2>
              <Grid2 size={{ xs: 6, md: 4 }}>
                {previewImage && (
                    <div>
                      <img
                        src={previewImage}
                        alt="Preview"
                        style={{ width: '100px', height: '100px', marginTop: '0px' }}
                      />
                    </div>
                  )}
                   
              </Grid2>
              <Grid2 size={{ xs: 12, md: 12 }}>
                <PrimeButton
                  variant="contained" // For Material-UI
                  color="primary"     // For Material-UI
                  type="submit"
                >
                  {editMode ? "Update": "Add" }
                </PrimeButton>
                <PrimeButton
                  type="button" 
                  variant="contained"
                  color="secondary"
                  onClick={resetForm}
                  style={{ marginLeft: '10px' }}
                >
                  Cancel
                </PrimeButton>
            </Grid2>
        
            </Grid2>
            </form>
            {/* {users.map((user)=>{
                return <p>{user.name}</p>
            })} */}
            <div className="card" style={{ marginTop: '2rem' }}>
            <ConfirmDialog />
             <div className="p-mb-4">
             <FormControl sx={{ m: 1 }} variant="outlined">
                <InputLabel htmlFor="search-input">Search</InputLabel>
                <OutlinedInput
                  id="search-input"
                  startAdornment={
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  }
                  label="Search" 
                  onChange={onGlobalFilterChange} 
                  placeholder="Search..."
                  value={globalFilter}
                />
              </FormControl>

              </div>
                <DataTable value={users} paginator rows={10} header="User Data" globalFilter={globalFilter} // Apply the global filter to DataTable
                  sortMode="multiple" // Allow multiple column sorting
                >
                  <Column header="Id" body={indexBodyTemplate} style={{ width: '80px' }} />
                  {columns.map((col, index) => (
                    <Column key={index} field={col.field} header={col.header} sortable />
                  ))}
                   {/* Add an action column at the end for Edit/Delete buttons */}
                    <Column header="Actions" body={actionBodyTemplate} />
                </DataTable>
              </div>
          </CardContent>
        </Card>
      </Grid2>
    </Grid2>
    </div>
  )
}

export default UserView
