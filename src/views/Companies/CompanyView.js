import React, { useContext, useEffect, useState } from 'react';
import {
  Card, CardContent, Divider, Box, Typography, TextField,
  Grid2, Fab, FormControlLabel, Checkbox,
  InputLabel, OutlinedInput, InputAdornment, Button,
  FormControl,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon, Label, Search } from '@mui/icons-material';

import CompanyContext from '../../context/CompanyContext';
import ProductContext from '../../context/ProductContext';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column'; 
import { Button as PrimeButton } from 'primereact/button'; 
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'; 
import { AlertContext } from "../../context/AlertContext";
import { useNavigate } from 'react-router-dom';

const CompanyView = (props) => {
  const navigate = useNavigate();
  const { showAlert } = useContext(AlertContext);
  const { companiesWithProducts, getAllCompaniesWithProducts, addCompany, deleteCompany, updateCompany } = useContext(CompanyContext);
  const { products, getAllProducts } = useContext(ProductContext);

  const [company, setCompany] = useState({ id: 0, name: "" });
  const [errors, setErrors] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(''); // State to hold the search term

  const columns = [
    { field: 'name', header: 'Company Name' },
  ];

  const indexBodyTemplate = (rowData, { rowIndex }) => {
    return <span>{rowIndex + 1}</span>;
  };

  useEffect(() => {
    if (localStorage.getItem('token')) {
      getAllProducts();
      getAllCompaniesWithProducts();
    } else {
      navigate('/login');
    }
    //eslint-disable-next-line
  }, []);

  const handleEdit = (company) => {
    setErrors({});

    // Find the company from allRolesWithPermissions using the provided companyId
    const selectedProduct = companiesWithProducts.find(currcompany => currcompany.id === company.id);

    if (selectedProduct) {
        setCompany({
            id: selectedProduct.id,
            name: selectedProduct.name,
        });

        // Set the selected products based on the found company
        setSelectedProducts(selectedProduct.products.map(p => p.id)); 
        setEditMode(true);

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    } else {
        console.error('Company not found:', company.id);
    }
};
    

  const handleDelete = (company) => {
    confirmDialog({
      message: 'Are you sure you want to delete this company?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => deletingCompany(company),
      reject: () => console.log('Delete rejected'),
    });
  };

  const deletingCompany = async (company) => {
    await deleteCompany(company.id);
    // getAllCompaniesWithProducts();
    resetForm();
    showAlert('Company has been deleted.', 'success');
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <Fab type='button' color="success" size="small" onClick={() => handleEdit(rowData)} style={{ marginRight: '4px' }}>
          <EditIcon />
        </Fab>
        <Fab type='button' color="error" size="small" onClick={() => handleDelete(rowData)}>
          <DeleteIcon />
        </Fab>
      </>
    );
  };

  const validateForm = () => {
    const newErrors = {};
    if (company.name.length < 3) {
      newErrors['name'] = 'Enter a valid Company Name. It must be at least 3 characters long.';
    }
    if(selectedProducts.length <= 0){
      newErrors['products'] = 'Product is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (validateForm()) {
        const productName= company.name;

        if (!editMode) {
          let res = await addCompany( productName, selectedProducts );
          if(res.success){
            showAlert('Company has been created.', 'success');
            setErrors({});
            resetForm();
          }
          else{
            showAlert('Something went wrong! Please try again later.', 'error');
          }
        } else {
          let res = await updateCompany(company.id, productName, selectedProducts );
          if(!res.success)
          {
            setErrors(res.errors);
          }
          else{
            showAlert('Company has been updated.', 'success');
            setEditMode(false);
            setErrors({});
            resetForm();
          }
        }
       
      }
    } catch (error) {
      showAlert('Something went wrong! Please try again later.', 'error');
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      }
    }
  };

  const onChange = (e) => {
    setCompany({ ...company, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const onGlobalFilterChange = (e) => {
    setGlobalFilter(e.target.value);
  };

  const resetForm = () => {
    setCompany({ name: "" });
    setSelectedProducts([]);
    setEditMode(false);
    setErrors({});
  };

  const handleProductChange = (event) => {
    const {
        target: { value },
    } = event;

    // Update the selected products
    setSelectedProducts(value);

    // Check if there are no selected products
    if (value.length === 0) {
        setErrors({ products: 'Product is required.' });
    } else {
        setErrors({}); // Clear error if at least one product is selected
    }
};


  return (
    <div>
      <Grid2 container spacing={{ xs: 2, md: 3 }}>
        <Grid2 size={{ xs: 12, md: 12 }}>
          <Card variant="outlined" sx={{ p: 0 }}>
            <Box sx={{ padding: "15px 30px" }} display="flex" alignItems="center">
              <Box flexGrow={1}>
                <Typography sx={{ fontSize: "18px", fontWeight: "500" }}>Company Form</Typography>
              </Box>
            </Box>
            <Divider />
            <CardContent sx={{ padding: "30px" }}>
              <form encType='multipart/form-data' onSubmit={handleSubmit}>
                <Grid2 container spacing={{ xs: 2, md: 3 }}>
                  <Grid2 size={{ xs: 6, md: 4 }}>
                    <TextField
                      id="name"
                      name="name"
                      label="Company Name"
                      size="small"
                      variant="outlined"
                      fullWidth
                      onChange={onChange}
                      value={company.name}
                      error={Boolean(errors.name)}
                      helperText={errors.name}
                      sx={{ mb: 2 }}
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 10, md: 10 }}>
                  
                  <FormControl fullWidth error={Boolean(errors.products)}>
                        <InputLabel id="products_select">Products</InputLabel>
                        <Select
                            labelId="products_select"
                            label="Products"
                            size="small" 
                            multiple
                            value={selectedProducts}
                            onChange={handleProductChange}
                            renderValue={(selected) => (
                                <Box size="small" sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => (
                                        <Chip size="small" key={value} label={products.find(p => p.id === value)?.name} 
                                        sx={{
                                            backgroundColor: 'primary.main',
                                            color: 'white',
                                            margin: '2px',
                                        }} />
                                    ))}
                                </Box>
                            )}
                            sx={{ height: '56px' }}
                        >
                            {products.map(product => (
                                <MenuItem key={product.id} value={product.id}>
                                    {product.name}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.products && (
                            <Typography variant="body2" color="error">
                                {errors.products}
                            </Typography>
                        )}
                    </FormControl>
                     
                  </Grid2>
                  <Grid2 size={{ xs: 12, md: 12 }}>
                    <PrimeButton variant="contained" color="primary" type="submit">
                      {editMode ? "Update" : "Add"}
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
                    />
                  </FormControl>
                </div>
                <DataTable value={companiesWithProducts} paginator rows={10} header="Company Data" globalFilter={globalFilter} sortMode="multiple">
                  <Column header="Id" body={indexBodyTemplate} style={{ width: '80px' }} />
                  {columns.map((col, index) => (
                    <Column key={index} field={col.field} header={col.header} sortable />
                  ))}
                  <Column header="Actions" body={actionBodyTemplate} />
                </DataTable>
              </div>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </div>
  );
};

export default CompanyView;
