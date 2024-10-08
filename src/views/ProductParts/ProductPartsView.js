import React, { useState, useEffect, useContext } from 'react';
import {
  Card,
  CardContent,
  Divider,
  Box,
  Typography,
  TextField,
  Grid,
  MenuItem,
  IconButton,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

import ProductContext from '../../context/ProductContext';
import PartContext from '../../context/PartContext';
import ProductPartsContext from '../../context/ProductPartsContext';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

const ProductPartsView = () => {
  const { products, getAllProducts } = useContext(ProductContext);
  const { parts, getAllParts } = useContext(PartContext);
  const { productParts, getAllProductParts, addProductParts, updateProductParts, deleteProductParts, getProductParts } = useContext(ProductPartsContext);

  const [selectedProductId, setSelectedProductId] = useState('');
  const [productName, setProductName] = useState('');
  const [currProductParts, setCurrProductParts] = useState([{ part_id: '', part_quantity: 0 }]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [editMode, setEditMode] = useState(false); // Flag for edit mode
  const [editProductId, setEditProductId] = useState(null); // ID for product being edited
  const [deletedParts, setDeletedParts] = useState([]); // Store deleted parts to send to the backend
  const [errors, setErrors] = useState({}); // State to store errors
  
  // Columns for the data table
  const columns = [
    { field: 'name', header: 'Product' },
  ];

  // Fetch all products, parts, and product parts when component mounts
  useEffect(() => {
    getAllProducts();
    getAllParts();
    getAllProductParts();
  }, []);

  // Handle product selection change
  const handleProductChange = (event) => {
    setSelectedProductId(event.target.value);
    setErrors((prev) => ({ ...prev, product_id: '' })); // Clear product error
  };

  // Handle part change (for both part selection and quantity change)
  const handlePartChange = (index, field, value) => {
    const updatedParts = [...currProductParts];
    updatedParts[index][field] = value;
    setCurrProductParts(updatedParts);
    if (field === 'part_id' || field === 'part_quantity') {
      // Clear individual field error when user changes input
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`part_${index}_${field}`];
        return newErrors;
      });
    }
  };

  // Add a new part entry
  const addPart = () => {
    setCurrProductParts([...currProductParts, { part_id: '', part_quantity: 0 }]);
  };

  // Remove a part entry (both from UI and, if in edit mode, from the database)
  const handlePartDelete = async (index) => {
    const partId = currProductParts[index].id; // Get the ID of the part to delete
    const updatedParts = currProductParts.filter((_, i) => i !== index);
    setCurrProductParts(updatedParts);
  
    if (editMode && partId) {
      try {
        // Send a request to delete the part from the product_parts table
        await deleteProductParts(partId);
      } catch (error) {
        console.error("Error deleting product part:", error);
      }
    } else {
      // If we're not in edit mode, just update the state to remove the part locally
      const updatedDeletedParts = [...deletedParts, partId];
      setDeletedParts(updatedDeletedParts);
    }
  };

  // Reset the form state
  const resetForm = () => {
    setCurrProductParts([{ part_id: '', part_quantity: 0 }]);
    setSelectedProduct('');
    setEditMode(false);
    setEditProductId(null);
    setDeletedParts([]); // Reset deleted parts
    setErrors({});
  };

  // Handle form submission for adding or updating product parts
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate product selection and parts
    // if (selectedProduct === '' || !currProductParts.some(p => p.part_id && p.part_quantity > 0)) {
    //     setFormErrors("Please select a product and ensure at least one part has a valid ID and quantity.");
    //     return;
    // }

      // Validation
      let isValid = true;
      const newErrors = {};
  
      // Check if product is selected
      if (!productName) {
        newErrors.product_name = 'Product is required';
        isValid = false;
      }
  
      // Check if at least one part is valid
      currProductParts.forEach((part, index) => {
        if (!part.part_id) {
          newErrors[`part_${index}_part_id`] = 'Part is required';
          isValid = false;
        }
        if (!part.part_quantity || part.part_quantity <= 0) {
          newErrors[`part_${index}_part_quantity`] = 'Quantity must be greater than 0';
          isValid = false;
        }
      });
  
      if (!isValid) {
        setErrors(newErrors); // Set the validation errors
        return;
      }
  
      // If the form is valid, clear errors and proceed with API requests
      setErrors({}); // Clear previous errors
  
    try {
      if (editMode) { 
        // Update existing product parts
        for(const part of currProductParts)
        {
          if(part.id != undefined){
            await updateProductParts(part.id, selectedProduct, part.part_id, part.part_quantity);
          }
          else{
            await updateProductParts(-1, selectedProduct, part.part_id, part.part_quantity);
          }
        }

        // Remove deleted parts from the product if any
        for (const partId of deletedParts) {
          await deleteProductParts(partId);
        }
        setErrors({});
      } else {
        // Add new product parts
        for (let part of currProductParts) {
          await addProductParts(selectedProduct, part.part_id, part.part_quantity);
        }
      }
      resetForm();  // Reset the form after successful submission
    }catch (error) {
      console.error('Error:', error); // Log the full error object
      // Assuming error response contains error messages for each field
      if (error.response && error.response.data.errors) {
        console.log(error.response);
        setErrors(error.response.data.errors);
      }
    }
  };

  // Get available parts that are not yet selected
  const getAvailableParts = (index) => {
    const selectedParts = currProductParts.map(part => part.part_id);
    return parts.filter(part => part.id === currProductParts[index].part_id || !selectedParts.includes(part.id));
  };

  const handleEdit = async (product) => {
    console.log('Editing product:', product);
    setErrors({});
    setProductName(product.name); // Select the product
    try {
        const response = await getProductParts(product.id); // Fetch product parts
        console.log('Fetched parts:', response);
        if (Array.isArray(response)) {
            const partsForEditing = response.map(pp => ({
                id: pp.id,
                part_id: pp.part_id,
                part_quantity: pp.part_quantity
            }));
            console.log('Parts for editing:', partsForEditing);
            setCurrProductParts(partsForEditing);
        } else {
            console.error('Response is not an array:', response);
            setCurrProductParts([]); // Set to empty array in case of error
        }
    } catch (error) {
        console.error('Error fetching product parts:', error);
        setCurrProductParts([]); // Set to empty array in case of error
    }
    setEditMode(true); // Enable edit mode
    setEditProductId(product.id); // Store the ID for future updates
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top
};



  // Handle delete action (you can add the logic here)
  const handleDelete = (product) => {
    // Add your delete logic here
  };

  // Action buttons for DataTable (Edit/Delete)
  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success"
          onClick={() => handleEdit(rowData)}
          style={{ marginRight: '4px' }}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger"
          onClick={() => handleDelete(rowData)}
        />
      </>
    );
  };

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card variant="outlined">
            <Box padding="15px 30px" display="flex" alignItems="center">
              <Box flexGrow={3}>
                <Typography fontSize="18px" fontWeight="500">
                  {editMode ? 'Edit Product' : 'Product Form'}
                </Typography>
              </Box>
            </Box>
            <Divider />
            <CardContent padding="30px">
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name ="product_name"
                      label="Product Name"
                      value={productName}
                      onChange={handleProductChange}
                      disabled={editMode} // Disable product selection in edit mode
                      error={Boolean(errors.product_name)} // Highlights the input field if there's an error
                      helperText={errors.product_name} // Displays the error message
                      sx={{
                        mb: 2,
                      }}
                    >                      
                    </TextField>
                  </Grid>

                  {Array.isArray(currProductParts) && currProductParts.map((part, index) => (
                    <Grid container spacing={2} m={1} key={index}>
                      <Grid item xs={4}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          select
                          label="Select Part"
                          value={part.part_id}
                          onChange={(e) => handlePartChange(index, 'part_id', e.target.value)}
                          error={Boolean(errors[`part_${index}_part_id`])}
                          helperText={errors[`part_${index}_part_id`]}
                        >
                          {getAvailableParts(index).map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                              {option.name}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>

                      <Grid item xs={4}>
                        <TextField
                          fullWidth
                          type="number"
                          label="Part Quantity"
                          value={part.part_quantity}
                          onChange={(e) => handlePartChange(index, 'part_quantity', e.target.value)}
                          error={Boolean(errors[`part_${index}_part_quantity`])}
                          helperText={errors[`part_${index}_part_quantity`]}
                        />
                      </Grid>

                      <Grid item xs={2}>
                        <IconButton type="button" onClick={() => handlePartDelete(index)}>
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))}
                  
                  <Grid item xs={12}>
                    <Button
                      type="button" 
                      variant="contained"
                      color="primary"
                      startIcon={<AddIcon />}
                      onClick={addPart}
                    >
                      Add Part
                    </Button>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Button variant="contained" color="primary" type="submit">
                      {editMode ? 'Update Parts' : 'Submit'}
                    </Button>
                    {editMode && (
                      <Button
                        type="button" 
                        variant="contained"
                        color="secondary"
                        onClick={resetForm}
                        style={{ marginLeft: '10px' }}
                      >
                        Cancel Edit
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </form>
             
              <div className="card" style={{ marginTop: '2rem' }}>
                <ConfirmDialog />
                <div className="p-mb-4">
                  <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText
                      type="search"
                      onInput={(e) => setGlobalFilter(e.target.value)}
                      placeholder="    Search..."
                      value={globalFilter}
                    />
                  </span>
                </div>
                <DataTable value={products} paginator rows={10} globalFilter={globalFilter} sortMode="multiple">
                  {columns.map((col, index) => (
                    <Column key={index} field={col.field} header={col.header} sortable />
                  ))}
                  <Column header="Actions" body={actionBodyTemplate} />
                </DataTable>
              </div>
              
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default ProductPartsView;
