import React, { useContext, useEffect, useRef, useState } from 'react'
import {
  Card, CardContent, Divider, Box, Typography, TextField,
  MenuItem, Grid2, Fab, 
  InputLabel, OutlinedInput, InputAdornment, FormControl,
  Button,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon, Search } from '@mui/icons-material';

import PartContext from '../../context/PartContext';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext'; 
import { Button as PrimeButton } from 'primereact/button'; 
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'; 
import { AlertContext } from "../../context/AlertContext";
import { useNavigate } from 'react-router-dom';

const PartView = (props) => {
  const navigate = useNavigate();

  const { showAlert } = useContext(AlertContext);
  const { parts, getAllParts, addPart, deletePart, updatePart } = useContext(PartContext);

  const [part, setPart] = useState({name: ""});
  const [errors, setErrors] = useState({}); // State to store errors
  const [editMode, setEditMode] = useState(false); // Flag for edit mode
  const columns = [
    { field: 'name', header: 'Part Name' },
  ];
  const indexBodyTemplate = (rowData, { rowIndex }) => {
    return <span>{rowIndex + 1}</span>; // Indexing starts from 1
  };

  useEffect(()=>{
    if(localStorage.getItem('token')){
      getAllParts();
    }
    else{
      navigate('/login')
    }
    //eslint-disable-next-line
  },[])
  const handleEdit = (part) => {
    setErrors({});
    setPart({
      id: part.id,
      name: part.name,
    });
    setEditMode(true);
    
    window.scrollTo({
      top: 0, // Scroll to the top of the page
      behavior: 'smooth' // Optional: smooth scroll
    });
  };

  // Handler for delete action
  const handleDelete = (part) => {
    
    confirmDialog({
      message: 'Are you sure you want to delete this part?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => deletingPart(part), // Call delete function if confirmed
      reject: () => console.log('Delete rejected')
    });
  };
  // Delete function after confirmation
  const deletingPart = async (part) => {
    await deletePart(part.id);
    showAlert('Part has been deleted.','success');
    console.log('Deleted part:', part);
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
    if (part.name.length < 3) {
      newErrors['name'] = 'Enter a valid First Name. It must be at least 3 characters long.';
    }
    setErrors(newErrors);

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) =>{
      e.preventDefault();
      
      try{
        if(validateForm()){
            
          if(!editMode){
            await addPart(part.name);
            showAlert('Part has been created.','success');
          }
          else{
            await updatePart(part.id, part.name);
            showAlert('Part has been updated.','success');
            setEditMode(false);
          }
          setErrors({});
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
  setPart({...part, [e.target.name]: e.target.value})
  setErrors({ ...errors, [e.target.name]: "" }); // Clear error for the field
}
const [globalFilter, setGlobalFilter] = useState(''); // State to hold the search term

// Function to handle search input change
const onGlobalFilterChange = (e) => {
  setGlobalFilter(e.target.value);
};

const resetForm = () => {
  setPart({ name: "" });
  setEditMode(false);
  setErrors({});
};
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
                Part Form
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
                    label="Part Name"
                    variant="outlined"
                    fullWidth
                    onChange={onChange}
                    value={part.name}
                    error={Boolean(errors.name)}
                    helperText={errors.name}
                    sx={{ mb: 2 }}
                />
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
                <DataTable value={parts} paginator rows={10} header="Part Data" globalFilter={globalFilter} // Apply the global filter to DataTable
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

export default PartView
