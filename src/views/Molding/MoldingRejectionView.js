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
  const [selectedMolding, setSelectedMolding] = useState(null); 
  const [records, setRecords] = useState([]);
  const { moldingDetails, setMoldingDetails, getAllMoldingData, addMoldingData, updateMoldingData, deleteMoldingMappingRecord, deleteMoldingData } = useContext(MoldingContext);

  useEffect(() => {
    getAllCompanies();
    getAllProducts();
    getAllProductParts();
    handleAddRecord(); // Automatically add an initial record
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
        <Fab type='button' color="error" size="small" onClick={() => handleDelete(rowData)}>
          <DeleteIcon />
        </Fab>
      </>
    );
  };
  const handleEdit = (molding) => {
    setErrors({});
    setEditMode(true);
    setSelectedMolding(molding); // Set the selected molding record

    // Populate the form with the selected molding record
    const newRecords = molding.companies.flatMap(company => 
        company.products.map(product => ({
            id: company.company._id,
            company_id: company.company.id,
            product_id: product.id,
            parts: product.parts.map(part => ({
                part_id: part.id,
                part_name: part.name,
                part_qty: part.part_quantity
            })) || []
        }))
    );
    setRecords(newRecords);

    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
};


  const handleDelete = (molding) => {
    confirmDialog({
      message: 'Are you sure you want to delete this molding data?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => deletingMolding(molding),
      reject: () => console.log('Delete rejected'),
    });
  };

  const deletingMolding = async (molding) => {
    await deleteMoldingData(molding.molding_id);
    // getAllCompaniesWithProducts();
    resetForm();
    showAlert('Molding has been deleted.', 'success');
  };

// Function to handle the rendering of parts
const renderParts = (parts) => {
    return parts.map(part => (
        <div key={part._id}>
            {part.name} (Quantity: {part.part_quantity})
        </div>
    ));
};
  const handleAddRecord = () => {
    const newRecord = {
      id: Date.now(), // Temporary ID for new entry
      company_id: '',
      product_id: '',
      parts: [],
    };

    setRecords([...records, newRecord]);
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

  const handleRemoveRecord = async (record) => {
    if (editMode) {
      // If in edit mode, delete from the database
      try {
        if(record.company_id != "" && record.product_id != ""){
          // Assuming deleteMoldingMapping is a function that sends the delete request to your backend
          await deleteMoldingMappingRecord(selectedMolding.molding_unique_number, record.company_id, record.product_id);
          // After successful deletion, remove the record locally
          await setRecords(records.filter((crecord) => crecord.id !== record.id));
          showAlert('Record deleted successfully.', 'success');
        }
        else {
          // If not in edit mode, just remove the record locally
          const updatedRecords = records.filter((crecord) => crecord.id !== record.id);
          await setRecords(updatedRecords);
        }

      } catch (error) {
        showAlert('Error deleting record.', 'error');
        console.error('Error deleting record:', error);
      }
    } else {
      // If not in edit mode, just remove the record locally
      const updatedRecords = records.filter((crecord) => crecord.id !== record.id);
      await setRecords(updatedRecords);
    }
  };

  const onGlobalFilterChange = (e) => {
    setGlobalFilter(e.target.value);
  };
  const resetForm = async () => {
    setEditMode(false);
    setSelectedMolding(null); // Clear the selected molding
    setErrors({}); // Clear all form errors
    const newRecord = {
      id: Date.now(), // Temporary ID for new entry
      company_id: '',
      product_id: '',
      parts: [],
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
  
      // Validate parts and quantities for each product
      record.parts.forEach((part, partIndex) => {
        if (!part.part_id) {
          newErrors[`part_${index}_${partIndex}_part_id`] = 'Part is required!';
          isValid = false;
        }
  
        const quantity = part.part_qty;
        if (quantity === '' || quantity === null) {
          newErrors[`part_${index}_${partIndex}_part_qty`] = 'Quantity is required!';
          isValid = false;
        } else if (quantity <= 0) {
          newErrors[`part_${index}_${partIndex}_part_qty`] = 'Quantity must be greater than 0!';
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
        const uniqueCompanies = new Set();
        const uniqueProducts = new Set();
        records.forEach((record) => {
          if (record.company_id) uniqueCompanies.add(record.company_id);
          if (record.product_id) uniqueProducts.add(record.product_id);
        });
        const totalCompanies = uniqueCompanies.size;
        const totalProducts = uniqueProducts.size;

        if (editMode && selectedMolding) {
          // Update the existing molding record
          await updateMoldingData(selectedMolding.molding_id, totalCompanies, totalProducts, records);
          showAlert('Molding updated successfully', 'success');
        } else {
          // Add new molding data  
          await addMoldingData(totalCompanies, totalProducts, records);
          showAlert('Molding added successfully', 'success');
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
                                disabled={!record.company_id} // Disable until a company is selected
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
                              <Box>
                                {records.length > 1 && (
                                  <Fab 
                                    type='button' 
                                    color="error" 
                                    onClick={() => handleRemoveRecord(record)} 
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
                                    disabled={!record.company_id || !record.product_id} // Disable if company or product is not selected
                                  >
                                    <AddIcon />
                                  </Fab>                              
                                )}
                              </Box>
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
                                      label="Quantity"
                                      type="number"
                                      value={part.part_qty || ''}
                                      onChange={(e) => handleQuantityChange(record.id, part.part_id, e)}
                                      error={Boolean(errors[`part_${index}_${partIndex}_part_qty`])}
                                      helperText={errors[`part_${index}_${partIndex}_part_qty`]}
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
                                                              {part.name} (Qty: {part.part_quantity})
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

export default MoldingView;
