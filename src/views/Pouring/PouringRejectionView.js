import React, { useState, useEffect, useContext } from 'react';
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
import MoldingContext from '../../context/MoldingContext';
import CompanyContext from '../../context/CompanyContext';
import ProductContext from '../../context/ProductContext';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'; 
import { AlertContext } from "../../context/AlertContext";
import { useNavigate } from 'react-router-dom';
import PartContext from '../../context/PartContext';
import PouringContext from '../../context/PouringContext';

const PouringRejectionView = () => {
  const navigate = useNavigate();
  const { showAlert } = useContext(AlertContext);
  const { companies, getAllCompanies } = useContext(CompanyContext);
  const { parts, getAllParts } = useContext(PartContext);
  const { products, getAllProducts } = useContext(ProductContext);
  const [errors, setErrors] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(''); // State to hold the search term
  const [selectedPouringNumber, setSelectedPouringNumber] = useState(null); 
  const [selectedPouring, setSelectedPouring] = useState(null); 
  const [records, setRecords] = useState([]);
  const { pouringDetails, setPouringDetails, getAllPouringData, pouringWithProductsDetails, getSinglePouringData, getAllPouringWithProductsData, addPouringData, updatePouringData, deletePouringMappingRecord, deletePouringData } = useContext(PouringContext);

  useEffect(() => {
    getAllCompanies();
    getAllProducts();
    getAllPouringWithProductsData();
    getAllPouringData();
    console.log('+++++'+pouringDetails)

    const fetchPouringData = async () => {
      try {
        const res = await getAllPouringData();
        setPouringDetails(res);
      } catch (error) {
        console.error("Error fetching molding data:", error);
      }
    };

    fetchPouringData();
  }, []);

  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <Fab type='button' color="success" size="small" onClick={() => handleEdit(rowData)} style={{ marginRight: '4px' }}>
          <EditIcon />
        </Fab>
        
      </>
    );
  };
  const handleEdit = (pouring) => {
    setErrors({});
    setEditMode(true);
    // if(pouring.length > 0){
    setSelectedPouring(pouring);
    setSelectedPouringNumber(pouring.pouring_id); 

    // Populate the form with the selected pouring record
    const newRecords = pouring.companies.flatMap(company => 
        company.products.map(product => ({
            id: company.company._id,
            company_id: company.company.id,
            product_id: product.id,
            quantity: product.quantity,
            rejection_qty: product.rejection_quantity,
            final_qty: (product.quantity - product.rejection_quantity),
            rejection_reason: product.rejection_description,
           
        }))
    );
    setRecords(newRecords);
  // }

    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
};
  

  const handlePouringChange = (event) => {
    setSelectedPouringNumber(event.target.value);
    console.log('selected:'+event.target.value);
    // let molding = getAllMoldingData(event.target.value);
    const pouring = pouringDetails.filter(
      (pp) => pp.pouring_id === parseInt(event.target.value, 10)
    );
    
    console.log("------"+pouring[0].pouring_unique_number);
    handleEdit(pouring[0]);  
  };

  const handleRejectionQuantityChange = (recordId, event) => {
    const updatedRecords = records.map((record) => {
      if (record.id === recordId) {
            
        // Clear individual field error when user changes input
        setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[`product_${recordId}_rej_qty`];
            return newErrors;
        });
        return { ...record, rejection_qty: event.target.value };
        
      }
      return record;
    });
    setRecords(updatedRecords);
  };

  const handleRejectionReasonChange = (recordId, event) => {
    const updatedRecords = records.map((record) => {
      if (record.id === recordId) {
            
        // Clear individual field error when user changes input
        setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[`product_${recordId}_rej_reason`];
            return newErrors;
        });
        return { ...record, rejection_reason: event.target.value };
        
      }
      return record;
    });
    setRecords(updatedRecords);
  };

  const onGlobalFilterChange = (e) => {
    setGlobalFilter(e.target.value);
  };
  const resetForm = async () => {
    setEditMode(false);
    setSelectedPouring(null); // Clear the selected pouring
    setErrors({}); // Clear all form errors
    
    // Clear records array completely instead of adding a new empty record
    setSelectedPouringNumber(null)
    await setRecords([]); 
    
  };
  
  const validateForm = () => {
    let isValid = true;
    const newErrors = {};
  
    records.forEach((record, index) => {  
    
        const quantity = record.quantity;
        
        const rej_quantity = record.rejection_qty;

        if (rej_quantity === '' || rej_quantity === null) {
            newErrors[`product_${index}_rej_qty`] = 'Rejection Quantity is required!';
            isValid = false;
        } else if (rej_quantity < 0 || rej_quantity > quantity) {
            newErrors[`product_${index}_rej_qty`] = 'Rejection Quantity must be valid!';
            isValid = false;
        }
        if (record.rejection_reason === '' || record.rejection_reason === null) {
          newErrors[`product_${index}_rej_reason`] = 'Rejection Reason is required!';
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
       
        if (editMode && selectedPouring) {
          // Update the existing pouring record
          console.log("hi"+ selectedPouring.companies[0].products[0].rejection_reason)
          await updatePouringData(selectedPouring.pouring_id, 0, 0, records, 'rejection');
          showAlert('Molding updated successfully', 'success');
        } 
        resetForm();
        getAllPouringData();
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
                  {editMode ? `Edit Pouring Data - ${selectedPouring.heat_number}` : 'Pouring Form'}
                </Typography>
              </Box>
            </Box>
            <Divider />
            <CardContent padding="30px">
              <form encType="multipart/form-data" onSubmit={handleSubmit}>
              <Box m={2}>
                <Grid2 size={{ xs: 4, md: 4 }}>
                    <TextField
                      fullWidth
                      id="pouring_id"
                      name="pouring_id"
                      variant="outlined"
                      select
                      label="Select Pouring Transaction ID"
                      value={selectedPouringNumber}
                      onChange={(e) => handlePouringChange(e)}
                      // disabled={!record.company_id} // Disable until a company is selected
                      // error={Boolean(errors[`product_${index}`])}
                      // helperText={errors[`product_${index}`]}
                    >
                      {pouringWithProductsDetails
                      // .filter((p) => 
                      //   (!selectedProducts[record.company_id] || 
                      //     !selectedProducts[record.company_id].has(p.id)) || 
                      //   p.id === record.product_id
                      // )
                      .map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.heat_number}
                        </MenuItem>
                      ))}
                  </TextField>
                  </Grid2>
                  </Box>
                {records.length > 0 && (
                  <Box mt={2}>
                    {records.map((record, index) => (
                      <Card variant="outlined" key={record.id} sx={{ mb: 2 }}>
                        <CardContent>
                        
                        <Grid2 container spacing={{ xs: 2, md: 3 }}>
                      
                          <Grid2 size={{ xs: 4, md: 4 }}>
                              <TextField
                                fullWidth
                                id="company_id"
                                name="company_id"
                                variant="outlined"
                                select
                                label="Select Company"
                                value={record.company_id || ''}
                                // onChange={(e) => handleCompanyChange(record.id, e)}
                                // error={Boolean(errors[`company_${index}`])}
                                // helperText={errors[`company_${index}`]}
                                disabled
                              >
                                {companies.map((option) => (
                                  <MenuItem key={option.id} value={option.id}>
                                    {option.name}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </Grid2>
                            <Grid2 size={{ xs: 4, md: 4 }}>
                              <TextField
                                fullWidth
                                id="product_id"
                                name="product_id"
                                variant="outlined"
                                select
                                label="Select Product"
                                value={record.product_id || ''}
                                // onChange={(e) => handleProductChange(record.id, e)}
                                disabled // Disable until a company is selected
                                // error={Boolean(errors[`product_${index}`])}
                                // helperText={errors[`product_${index}`]}
                                >
                                {products
                                  .filter((p) => 
                                    (!selectedProducts[record.company_id] || 
                                     !selectedProducts[record.company_id].has(p.id)) || 
                                    p.id === record.product_id
                                  )
                                  .map((option) => (
                                    <MenuItem key={option.id} value={option.id}>
                                      {option.name}
                                    </MenuItem>
                                  ))}
                              </TextField>
                              </Grid2>                       
                                                      
                          <Grid2 size={{ xs: 4, md: 4 }}>
                            <Typography>{record.product_name}</Typography>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Total Quantity"
                                type="number"
                                value={record.quantity || ''}
                                // onChange={(e) => handleQuantityChange(record.id, part.part_id, e)}
                                // error={Boolean(errors[`part_${index}_${partIndex}_part_qty`])}
                                // helperText={errors[`part_${index}_${partIndex}_part_qty`]}
                                disabled
                            />
                            </Grid2>
                            <Grid2 size={{ xs: 4, md: 4 }}>
                                <TextField
                                  fullWidth
                                  variant="outlined"
                                  label="Rejection Quantity"
                                  type="number"
                                  value={record.rejection_qty || 0}
                                  onChange={(e) => handleRejectionQuantityChange(record.id, e)}
                                  error={Boolean(errors[`product_${index}_rej_qty`])}
                                  helperText={errors[`product_${index}_rej_qty`]} 
                              />
                            </Grid2>
                            <Grid2 size={{ xs: 6, md: 8 }}>
                            <TextField
                              type='text'
                              id="rej_reason"
                              label="Rejection Reason"
                              placeholder="Write your reason here..." 
                              rows={4}
                              multiline
                              fullWidth
                              value={record.rejection_reason || ''}
                              onChange={(e) => handleRejectionReasonChange(record.id, e)}
                              error={Boolean(errors[`product_${index}_rej_reason`])}
                              helperText={errors[`product_${index}_rej_reason`]} 
                            />         
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
            
                <DataTable value={pouringDetails} paginator rows={10} header="Pouring Data" globalFilter={globalFilter} sortMode="multiple">
                    <Column field="_id" header="ID" />
                    <Column field="heat_number" header="Heat Number" />

                   {/* Main Table for Company, Product, and Parts */}
                   {/* Main Table for Company, Product, and Parts */}
                    <Column header="Details" body={rowData => (
                        <div>
                          {/* Table for displaying Company, Product, and Parts */}
                          <table style={tableStyle}>
                              <thead>
                                  <tr>
                                      <th style={headerStyle}>Company</th>
                                      <th style={headerStyle}>Product</th>
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
                                                  <em>{product.name} (Qty: {product.quantity}),(Rejected Qty: {product.rejection_quantity}),(Final Qty: {product.final_quantity})</em>
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

export default PouringRejectionView;
