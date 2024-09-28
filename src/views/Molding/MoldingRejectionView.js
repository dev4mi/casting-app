import React, { useState, useEffect, useContext } from 'react';
import {
  Card,
  CardContent,
  Divider,
  Box,
  Typography,
  TextField,
  Grid,
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
import ProductPartsContext from '../../context/ProductPartsContext';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'; 
import { AlertContext } from "../../context/AlertContext";
import { useNavigate } from 'react-router-dom';
import PartContext from '../../context/PartContext';

const MoldingRejectionView = () => {
  const navigate = useNavigate();
  const { showAlert } = useContext(AlertContext);
  const { companies, getAllCompanies } = useContext(CompanyContext);
  const { parts, getAllParts } = useContext(PartContext);
  const { products, getAllProducts } = useContext(ProductContext);
  const { productParts, getAllProductParts } = useContext(ProductPartsContext);
  const [errors, setErrors] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(''); // State to hold the search term
  const [selectedMoldingNumber, setSelectedMoldingNumber] = useState(null); 
  const [selectedMolding, setSelectedMolding] = useState(null); 
  const [records, setRecords] = useState([]);
  const { moldingDetails, setMoldingDetails, getAllMoldingData, moldingWithProductsDetails, getSingleMoldingData, getAllMoldingWithProductsData, addMoldingData, updateMoldingData, deleteMoldingMappingRecord, deleteMoldingData } = useContext(MoldingContext);

  useEffect(() => {
    getAllCompanies();
    getAllProducts();
    getAllProductParts();
    getAllMoldingWithProductsData();
    getAllMoldingData();
    console.log('+++++'+moldingDetails)

    const fetchMoldingData = async () => {
      try {
        const res = await getAllMoldingData();
        setMoldingDetails(res);
      } catch (error) {
        console.error("Error fetching molding data:", error);
      }
    };

    fetchMoldingData();
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
  const handleEdit = (molding) => {
    setErrors({});
    setEditMode(true);
    // if(molding.length > 0){
    setSelectedMolding(molding);
    setSelectedMoldingNumber(molding.molding_id); 

    // Populate the form with the selected molding record
    const newRecords = molding.companies.flatMap(company => 
        company.products.map(product => ({
            id: company.company._id,
            company_id: company.company.id,
            product_id: product.id,
            parts: product.parts.map(part => ({
                part_id: part.id,
                part_name: part.name,
                part_qty: part.part_quantity,
                rejection_qty: part.rejection_quantity,
                final_qty: (part.part_quantity - part.rejection_quantity)
            })) || []
        }))
    );
    setRecords(newRecords);
  // }

    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
};
  

  const handleCompanyChange = (recordId, event) => {
    const updatedRecords = records.map((record) => {
      if (record.id === recordId) {
        return { ...record, company_id: event.target.value, product_id: '', parts: [] };
      }
      return record;
    });
    setRecords(updatedRecords);
  };
  const handleMoldingChange = (event) => {
    setSelectedMoldingNumber(event.target.value);
    console.log('selcted:'+event.target.value);
    // let molding = getAllMoldingData(event.target.value);
    const molding = moldingDetails.filter(
      (pp) => pp.molding_id === parseInt(event.target.value, 10)
    );
    
    console.log("------"+molding[0].molding_unique_number);
    handleEdit(molding[0]);  
  };

  const handleProductChange = (recordId, event) => {
    const updatedRecords = records.map((record) => {
      if (record.id === recordId) {
        const relevantParts = productParts.filter(
          (pp) => pp.product_id === parseInt(event.target.value)
        );
        return {
          ...record,
          product_id: event.target.value,
          parts: relevantParts.map((pp) => ({
            part_id: pp.part_id,
            part_name: parts.find((p) => p.id === pp.part_id)?.name || "",
            part_qty: pp.part_quantity,
            rejection_qty: pp.rejection_quantity,
            final_qty: (pp.part_quantity - pp.rejection_quantity)
          })),
        };
      }
      return record;
    });
    setRecords(updatedRecords);
  };

  const handleQuantityChange = (recordId, partId, event) => {
    const updatedRecords = records.map((record) => {
      if (record.id === recordId) {
        const updatedParts = record.parts.map((part) => {
          if (part.part_id === partId) {
             // Clear individual field error when user changes input
            setErrors((prev) => {
              const newErrors = { ...prev };
              delete newErrors[`part_${recordId}_${partId}`];
              return newErrors;
            });
            return { ...part, part_qty: event.target.value };
          }
          return part;
        });
        return { ...record, parts: updatedParts };
      }
      return record;
    });
    setRecords(updatedRecords);
  };
  const handleRejectionQuantityChange = (recordId, partId, event) => {
    const updatedRecords = records.map((record) => {
      if (record.id === recordId) {
        const updatedParts = record.parts.map((part) => {
          if (part.part_id === partId) {
             // Clear individual field error when user changes input
            setErrors((prev) => {
              const newErrors = { ...prev };
              delete newErrors[`part_${recordId}_${partId}_part_rej_qty`];
              return newErrors;
            });
            return { ...part, rejection_qty: event.target.value };
          }
          return part;
        });
        return { ...record, parts: updatedParts };
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
    setSelectedMolding(null); // Clear the selected molding
    setErrors({}); // Clear all form errors
    
    // Clear records array completely instead of adding a new empty record
    setSelectedMoldingNumber(null)
    await setRecords([]); 
    
  };
  
  const validateForm = () => {
    let isValid = true;
    const newErrors = {};
  
    records.forEach((record, index) => {
  
      // Validate parts and quantities for each product
      record.parts.forEach((part, partIndex) => {
       
        const quantity = part.part_qty;
       
        const rej_quantity = part.rejection_qty;

        if (rej_quantity === '' || rej_quantity === null) {
          newErrors[`part_${index}_${partIndex}_part_rej_qty`] = 'Rejection Quantity is required!';
          isValid = false;
        } else if (rej_quantity < 0 || rej_quantity > quantity) {
          newErrors[`part_${index}_${partIndex}_part_rej_qty`] = 'Rejection Quantity must be valid!';
          isValid = false;
        }
      });
    });
  
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = async(event) => {
    event.preventDefault();
    try {
      if (validateForm()) {
       
        if (editMode && selectedMolding) {
          // Update the existing molding record
          await updateMoldingData(selectedMolding.molding_id, 0, 0, records, 'rejection');
          showAlert('Molding updated successfully', 'success');
        } 
        resetForm();
        getAllMoldingData();
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
                  {editMode ? `Edit Molding Data - ${selectedMolding.molding_unique_number}` : 'Molding Form'}
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
                    id="molding_id"
                    name="molding_id"
                    variant="outlined"
                    select
                    label="Select Molding Transaction ID"
                    value={selectedMoldingNumber}
                    onChange={(e) => handleMoldingChange(e)}
                    // disabled={!record.company_id} // Disable until a company is selected
                    // error={Boolean(errors[`product_${index}`])}
                    // helperText={errors[`product_${index}`]}
                  >
                    {moldingWithProductsDetails
                      // .filter((p) => 
                      //   (!selectedProducts[record.company_id] || 
                      //     !selectedProducts[record.company_id].has(p.id)) || 
                      //   p.id === record.product_id
                      // )
                      .map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.molding_unique_number}
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
                        
                        <Grid2 container spacing={{ xs: 2, md: 3 }} alignItems="center">
                          <Grid2 size={{ xs: 4, md: 4 }}>
                              <TextField
                                fullWidth
                                id="company_id"
                                name="company_id"
                                variant="outlined"
                                select
                                label="Select Company"
                                value={record.company_id}
                                onChange={(e) => handleCompanyChange(record.id, e)}
                                error={Boolean(errors[`company_${index}`])}
                                helperText={errors[`company_${index}`]}
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
                                value={record.product_id}
                                onChange={(e) => handleProductChange(record.id, e)}
                                disabled // Disable until a company is selected
                                error={Boolean(errors[`product_${index}`])}
                                helperText={errors[`product_${index}`]}
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
                              <Grid2 size={{ xs: 2, md: 2 }}>
                            
                            </Grid2>
                          </Grid2>
                          {record.parts.length > 0 && (
                            <Box mt={2}>
                               <Grid2 container spacing={{ xs: 2, md: 3 }} alignItems="center">
                                {record.parts.map((part, partIndex) => (
                                  <Grid2 size={{ xs: 4, md: 4 }} key={part.part_id}>
                                    <Typography>{part.part_name}</Typography>
                                    <TextField
                                      sx={{ mt: '10px' }}
                                      fullWidth
                                      variant="outlined"
                                      label="Total Quantity"
                                      type="number"
                                      value={part.part_qty || ''}
                                      onChange={(e) => handleQuantityChange(record.id, part.part_id, e)}
                                      error={Boolean(errors[`part_${index}_${partIndex}_part_qty`])}
                                      helperText={errors[`part_${index}_${partIndex}_part_qty`]}
                                      disabled
                                    /><br/>
                                      <TextField
                                      sx={{ mt: '10px' }}
                                      fullWidth
                                      variant="outlined"
                                      label="Rejection Quantity"
                                      type="number"
                                      value={part.rejection_qty}
                                      onChange={(e) => handleRejectionQuantityChange(record.id, part.part_id, e)}
                                      error={Boolean(errors[`part_${index}_${partIndex}_part_rej_qty`])}
                                      helperText={errors[`part_${index}_${partIndex}_part_rej_qty`]}
                                      
                                    />
                                  </Grid2>
                                ))}
                              </Grid2>
                            </Box>
                          )}
                          
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
            
                <DataTable value={moldingDetails} paginator rows={10} header="Molding Data" globalFilter={globalFilter} sortMode="multiple">
                    <Column field="_id" header="ID" />
                    <Column field="molding_unique_number" header="Molding Unique Number" />

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
                                      <th style={headerStyle}>Parts</th>
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
                                              
                                              {/* Display list of parts */}
                                              <td style={cellStyle}>
                                                  <ul>
                                                      {product.parts.map(part => (
                                                          <li key={part._id}>
                                                              {part.name} (Qty: {part.part_quantity}),(Rejected Qty: {part.rejection_quantity}),(Final Qty: {part.final_quantity})
                                                          </li>
                                                      ))}
                                                  </ul>
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

export default MoldingRejectionView;
