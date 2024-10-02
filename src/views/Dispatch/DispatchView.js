import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  Card,
  CardContent,
  Divider,
  Box,
  Typography,
  TextField,
  Grid2,
  MenuItem,
  Button,
  IconButton,
  Fab,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
} from "@mui/material";
import { Button as PrimeButton } from 'primereact/button'; 

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon, Search } from '@mui/icons-material';
import DispatchContext from '../../context/DispatchContext';
import CompanyContext from '../../context/CompanyContext';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'; 
import { AlertContext } from "../../context/AlertContext";
import { useNavigate } from 'react-router-dom';
import ProductContext from '../../context/ProductContext';

const DispatchView = () => {
  const btnCancelRef = useRef(null); 
  const navigate = useNavigate();
  const { showAlert } = useContext(AlertContext);
  const { companiesWithProducts, getAllCompaniesWithProducts } = useContext(CompanyContext);
  const { products, getAllProducts } = useContext(ProductContext);
  const [errors, setErrors] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(''); // State to hold the search term
  const [selectedDispatch, setSelectedDispatch] = useState(null); 
  const [records, setRecords] = useState([]);
  const { dispatchDetails, setDispatchDetails, getAllDispatchData, addDispatchData, updateDispatchData, deleteDispatchMappingRecord, deleteDispatchData } = useContext(DispatchContext);

  useEffect(() => {
    getAllProducts();
    getAllCompaniesWithProducts();
    handleAddRecord(); // Automatically add an initial record
    const fetchDispatchData = async () => {
      try {
        const res = await getAllDispatchData();
        setDispatchDetails(res);
      } catch (error) {
        console.error("Error fetching Dispatch data:", error);
      }
    };

    fetchDispatchData();
  }, []);

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
  const handleEdit = (dispatch) => {
    setErrors({});
    setEditMode(true);
    setSelectedDispatch(dispatch); // Set the selected dispatch record

    // Populate the form with the selected molding record
    const newRecords = dispatch.companies.flatMap(company => 
        company.products.map(product => ({
            id: company.company._id,
            detail_id: product.dispatch_details_id,
            company_id: company.company.id,
            product_id: product.id,
            quantity: product.quantity,
            rejection_qty: product.rejection_quantity
        }))
    );
    setRecords(newRecords);
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
};

  const handleDelete = (dispatch) => {
    confirmDialog({
      message: 'Are you sure you want to delete this dispatch data?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => deletingDispatch(dispatch),
      reject: () => console.log('Delete rejected'),
    });
  };

  const deletingDispatch = async (dispatch) => {
      
    await deleteDispatchData(dispatch.dispatch_id);
    // getAllCompaniesWithProducts();
    resetForm();
    showAlert('Dispatch data has been deleted.', 'success');
  };

  const handleAddRecord = () => {
    const newRecord = {
      id: Date.now(), // Temporary ID for new entry
      company_id: '',
      product_id: '',
      quantity:0
    };

    setRecords([...records, newRecord]);
  };

  const handleCompanyChange = (recordId, event) => {
    const updatedRecords = records.map((record) => {
      if (record.id === recordId) {
        return { ...record, company_id: event.target.value, product_id: '' };
      }
      return record;
    });
    setRecords(updatedRecords);
  };

  const handleProductChange = (recordId, event) => {
    const updatedRecords = records.map((record) => {
      if (record.id === recordId) {
        
        return {
          ...record,
          product_id: event.target.value,
          quantity: record.quantity,
          rejection_qty: 0,
          product_name: products.find((p) => p.id === record.product_id)?.name || "",
        };
      }
      return record;
    });
    setRecords(updatedRecords);
  };

  const handleQuantityChange = (recordId, event) => {
    const updatedRecords = records.map((record) => {
      if (record.id === recordId) {
       
             // Clear individual field error when user changes input
            setErrors((prev) => {
              const newErrors = { ...prev };
              delete newErrors[`product_${recordId}_quantity`];
              return newErrors;
            });
           
        return { ...record, quantity: event.target.value };
      }
      return record;
    });
    setRecords(updatedRecords);
  };

  const handleRemoveRecord = async (record, detail_id) => {
    if (editMode) {
      // If in edit mode, delete from the database
      try {
        if (record.company_id !== "" && record.product_id !== "") {
          // Update records by filtering out the one to be removed
          const updatedRecords = records.filter((crecord) => crecord.id !== record.id);
          setRecords(updatedRecords);
  
          // Use map() to ensure proper processing of records after the deletion
          const uniqueCompanies = new Set();
          const uniqueProducts = new Set();
          updatedRecords.map((record) => {
            if (record.company_id) uniqueCompanies.add(record.company_id);
            if (record.product_id) uniqueProducts.add(record.product_id);
          });
  
          const totalCompanies = uniqueCompanies.size;
          const totalProducts = uniqueProducts.size;
  
          // Assuming deleteDispatchMapping is a function that sends the delete request to your backend
          await deleteDispatchMappingRecord(detail_id, totalCompanies, totalProducts);
  
          // Show success alert after successful deletion
          showAlert('Record deleted successfully.', 'success');
        } else {
          // If record doesn't have valid company or product, just remove locally
          const updatedRecords = records.filter((crecord) => crecord.id !== record.id);
          setRecords(updatedRecords);
        }
  
      } catch (error) {
        showAlert('Error deleting record.', 'error');
        console.error('Error deleting record:', error);
      }
    } else {
      // If not in edit mode, just remove the record locally
      const updatedRecords = records.filter((crecord) => crecord.id !== record.id);
      setRecords(updatedRecords);
    }
  };
  

  const onGlobalFilterChange = (e) => {
    setGlobalFilter(e.target.value);
  };

  const triggerButtonClick = () => {
    if (btnCancelRef.current) {
      btnCancelRef.current.click(); 
    }
  };
  const resetForm = async () => {
    setEditMode(false);
    setSelectedDispatch(null); // Clear the selected Dispatch
    setErrors({}); // Clear all form errors
    const newRecord = {
      id: Date.now(), // Temporary ID for new entry
      company_id: '',
      product_id: '',
    };
    // Clear records array completely instead of adding a new empty record
    
    await setRecords([]);
    await setRecords([newRecord]);
    
  };
  
  const validateForm = () => {
    let isValid = true;
    const newErrors = {};
  
    records.forEach((record, index) => {
      // Validate company selection
      if (!record.company_id) {
        newErrors[`company_${index}`] = 'Company is required!';
        isValid = false;
      }
  
      // Validate product selection
      if (!record.product_id) {
        newErrors[`product_${index}`] = 'Product is required!';
        isValid = false;
      }
      const quantity = record.quantity;
      if (quantity === '' || quantity === null) {
        newErrors[`product_${index}_quantity`] = 'Quantity is required!';
        isValid = false;
      } 
      else if (quantity < 0) {
        newErrors[`product_${index}_quantity`] = 'Quantity must be valid!';
        isValid = false;
      }
      if(editMode && quantity < record.rejection_qty){
        newErrors[`product_${index}_quantity`] = 'Quantity must be greater than rejection quantity!';
        isValid = false;
      }
    });
  
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = async(event) => {
    event.preventDefault();
    try {
      if (validateForm()) {
        const uniqueCompanies = new Set();
        const uniqueProducts = new Set();
        records.forEach((record) => {
          if (record.company_id) uniqueCompanies.add(record.company_id);
          if (record.product_id) uniqueProducts.add(record.product_id);
        });
        const totalCompanies = uniqueCompanies.size;
        const totalProducts = uniqueProducts.size;

        if (editMode && selectedDispatch) {
          // Update the existing Dispatch record
          await updateDispatchData(selectedDispatch.dispatch_id, totalCompanies, totalProducts, records);
          triggerButtonClick();
          showAlert('Dispatch data updated successfully', 'success');

        } else {
          // Add new Dispatch data  
          await addDispatchData(totalCompanies, totalProducts, records);
          triggerButtonClick();
          showAlert('Dispatch data added successfully', 'success');
        }
        
        getAllDispatchData();
        // await resetForm();
      }
      } catch (error) {
        showAlert('Something went wrong! Please try again later.', 'error');
        if (error.response && error.response.data.errors) {
          setErrors(error.response.data.errors);
        }
      }
  };

  const getSelectedProducts = () => {
    const selectedProducts = {};
    records.forEach((record) => {
      if (record.company_id && record.product_id) {
        if (!selectedProducts[record.company_id]) {
          selectedProducts[record.company_id] = new Set();
        }
        selectedProducts[record.company_id].add(record.product_id);
      }
    });
    return selectedProducts;
  };

  const selectedProducts = getSelectedProducts();

   const tableStyle = {
      width: '100%',
      borderCollapse: 'collapse'
  };
  
  const cellStyle = {
      border: '1px solid #ddd',
      padding: '8px'
  };
  
  const headerStyle = {
      backgroundColor: '#f2f2f2',
      textAlign: 'left'
  };
  return (
    <div>
       <Grid2 container spacing={{ xs: 2, md: 3 }}>
       <Grid2 size={{ xs: 12, md: 12 }}>
          <Card variant="outlined">
            <Box padding="15px 30px" display="flex" alignItems="center">
              <Box flexGrow={3}>
                <Typography fontSize="18px" fontWeight="500">
                  {editMode ? `Edit Dispatch Data - ${selectedDispatch.dispatch_unique_number}` : 'Dispatch Form'}
                </Typography>
              </Box>
            </Box>
            <Divider />
            <CardContent padding="30px">
              <form encType="multipart/form-data" onSubmit={handleSubmit}>
                {records.length > 0 && (
                  <Box mt={2}>
                    {records.map((record, index) => (
                      <Card variant="outlined" key={record.id} sx={{ mb: 2 }}>
                        <CardContent>
                        <Grid2 container spacing={{ xs: 2, md: 3 }} alignItems="center">
                          <Grid2 size={{ xs: 3, md: 3 }}>
                              <TextField
                                select
                                label="Select Company"
                                fullWidth
                                id="company_id"
                                name="company_id"
                                variant="outlined"                               
                                value={record.company_id}
                                onChange={(e) => handleCompanyChange(record.id, e)}
                                error={Boolean(errors[`company_${index}`])}
                                helperText={errors[`company_${index}`]}
                              >
                                {companiesWithProducts.map((option) => (
                                  <MenuItem key={option.id} value={option.id}>
                                    {option.name}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </Grid2>
                            <Grid2 size={{ xs: 3, md: 3 }}>
                              <TextField
                                select
                                label="Select Product"
                                fullWidth
                                id="product_id"
                                name="product_id"
                                variant="outlined"
                                value={record.product_id}
                                onChange={(e) => handleProductChange(record.id, e)}
                                disabled={!record.company_id} // Disable until a company is selected
                                error={Boolean(errors[`product_${index}`])}
                                helperText={errors[`product_${index}`]}
                              >
                                 {companiesWithProducts
                                    .find((company) => company.id === record.company_id) // Find the selected company
                                    ?.products
                                    .filter((p) => 
                                    (!selectedProducts[record.company_id] ||  // If selected products don't exist for this company, show the product
                                    !selectedProducts[record.company_id].has(p.id)) ||  // If product is not already selected, show the product
                                    p.id === record.product_id  // Always show the currently selected product even if it's already selected elsewhere
                                    )
                                    .map((option) => ( // Map over filtered products
                                    <MenuItem key={option.id} value={option.id}>
                                        {option.name}
                                    </MenuItem>
                                    ))}
                              </TextField>
                            </Grid2>
                                
                            <Grid2 size={{ xs: 3, md: 3 }}>
                            {/* <Typography>{record.product_name}</Typography> */}
                            <TextField
                                // sx={{ mt: '10px' }}
                                fullWidth
                                variant="outlined"
                                label="Quantity"
                                type="number"
                                value={record.quantity || 0}
                                onChange={(e) => handleQuantityChange(record.id, e)}
                                error={Boolean(errors[`product_${index}_quantity`])}
                                helperText={errors[`product_${index}_quantity`]}
                            />
                            </Grid2>
  
                              <Grid2 size={{ xs: 2, md: 2 }}>
                              <Box>
                                {records.length > 1 && (
                                  <Fab 
                                    type='button' 
                                    color="error" 
                                    onClick={() => handleRemoveRecord(record, record.detail_id)} 
                                    size="small"  
                                  >
                                    <DeleteIcon />
                                  </Fab>
                                )}
                                {records.length === (index + 1) && (
                                  <Fab 
                                    sx={{ml:'5px'}}
                                    type='button'
                                    color="success" 
                                    onClick={ 
                                      record.company_id && record.product_id ? handleAddRecord : null 
                                    } 
                                    size="small"  
                                    disabled={!record.company_id || !record.product_id} 
                                  >
                                    <AddIcon />
                                  </Fab>                              
                                )}
                              </Box>
                            </Grid2>
                          </Grid2>
                          
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}

                <Box m={2} mb={6}>
                  <PrimeButton variant="contained" color="primary" type="submit">
                    {editMode ? 'Update' : 'Add'}
                  </PrimeButton>
                  <PrimeButton
                        type="button" 
                        ref={btnCancelRef}
                        variant="contained"
                        color="secondary"
                        onClick={resetForm}
                        style={{ marginLeft: '10px' }}
                      >
                        Cancel
                      </PrimeButton>
                </Box>
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
            
                <DataTable value={dispatchDetails} paginator rows={10} header="Dispatch Data" globalFilter={globalFilter} sortMode="multiple">
                    <Column field="_id" header="ID" />
                    <Column field="dispatch_unique_number" header="Dispatch Unique Number" />

                   {/* Main Table for Company, Product */}
                    <Column header="Details" body={rowData => (
                        <div>
                          {/* Table for displaying Company, Product, and Parts */}
                          <table style={tableStyle}>
                              <thead>
                                  <tr>
                                      <th style={headerStyle}>Company</th>
                                      <th style={headerStyle}>Product</th>
                                      <th style={headerStyle}>Quantity</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {rowData.companies.map(company => (
                                      company.products.map((product, index) => (
                                          <tr key={product._id}>
                                              {/* Display the company name only once for the first product row */}
                                              {index === 0 ? (
                                                  <td rowSpan={company.products.length} style={cellStyle}>
                                                      <strong>{company.company.name}</strong>
                                                  </td>
                                              ) : null}
                                              
                                              {/* Display product name */}
                                              <td style={cellStyle}>
                                                  <em>{product.name}</em>
                                              </td>
                                               {/* Display product name */}
                                               <td style={cellStyle}>
                                                  <em>{product.quantity}</em>
                                              </td>
                            
                                          </tr>
                                      ))
                                  ))}
                              </tbody>
                          </table>

                        </div>
                    )} />

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

export default DispatchView;
