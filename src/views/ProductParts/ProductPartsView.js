import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  Card, CardContent, Divider, Box, Typography, TextField, MenuItem, Chip, 
  InputAdornment,
  InputLabel,
  FormControl,
  OutlinedInput,
  Grid2,
} from "@mui/material";

import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon, Search } from '@mui/icons-material';
import { Fab } from '@mui/material';
import ProductContext from '../../context/ProductContext';
import PartContext from '../../context/PartContext';
import ProductPartsContext from '../../context/ProductPartsContext';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

const ProductPartsView = () => {
  const { products, setProducts, getAllProducts, addProduct } = useContext(ProductContext);
  const { parts, getAllParts } = useContext(PartContext);
  const { productParts, getAllProductParts, productWithParts, setProductWithParts, getAllProductWithParts, addProductParts, updateProductParts,
     deleteProductParts, getProductParts, deleteProduct } = useContext(ProductPartsContext);

  const [selectedProductId, setSelectedProductId] = useState('');
  const [productName, setProductName] = useState('');
  const [currProductParts, setCurrProductParts] = useState([{ part_id: '', part_quantity: 0 }]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [filter, setFilter] = useState('');
  const [partsFilter, setPartsFilter] = useState('');
  const [editMode, setEditMode] = useState(false); // Flag for edit mode
  const [editProductId, setEditProductId] = useState(null); // ID for product being edited
  const [deletedParts, setDeletedParts] = useState([]); // Store deleted parts to send to the backend
  const [errors, setErrors] = useState({}); // State to store errors
  const partsFilterRef = useRef(null);

  // Columns for the data table
  const columns = [
    { field: 'name', header: 'Product' },
  ];

  // Fetch all products, parts, and product parts when component mounts
  useEffect(() => {
    getAllProducts();
    getAllParts();
    getAllProductParts();
    getAllProductWithParts();
    if (partsFilterRef.current) {
      partsFilterRef.current.focus();
    }
  }, [partsFilter]);

    // Custom body template to format the parts column
    const partsBodyTemplate = (rowData) => {
      return (
        <div>
          {rowData.parts.map((part, index) => (
               <Chip
                key={index}
                sx={{
                  pl: "4px",
                  pr: "4px",
                  mr: "4px",
                  backgroundColor: "primary.main",
                  color: "#fff",
                }}
                size="small"
                label={`${part.name}: ${part.quantity}`} 
              ></Chip>
             
           
          ))}
        </div>
      );
    };
    // Filter rows based on both product name and parts
  const filteredProducts = productWithParts.filter(product => {
    const filterLower = filter.toLowerCase();
    const productNameMatch = product.name.toLowerCase().includes(filterLower);
    const partsMatch = product.parts.some(part =>
      part.name.toLowerCase().includes(filterLower) ||
      part.quantity.toString().includes(filterLower)
    );
    return productNameMatch || partsMatch;
  });

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
    let isValid = true;
    const newErrors = {};
  
    // Validate only the last part record
    const lastIndex = currProductParts.length - 1;
    const lastPart = currProductParts[lastIndex];
  
    if (!lastPart.part_id) {
      newErrors[`part_${lastIndex}_part_id`] = 'Part is required!';
      isValid = false;
    }
    if (lastPart.part_quantity == '' && lastPart.part_quantity != '0')
    {
      newErrors[`part_${lastIndex}_part_quantity`] = 'Quantity is required!';
      isValid = false;
    }
    else if(lastPart.part_quantity < 0)
    {
      newErrors[`part_${lastIndex}_part_quantity`] = 'Quantity must be greater than 0!';
      isValid = false;
    }
  
    setErrors(newErrors);
  
    if (!isValid) {
      return; // Prevent form submission if validation fails
    }
    setCurrProductParts([...currProductParts, { part_id: '', part_quantity: 0 }]);
  };
  const handleProductNameChange = (e) => {
    setProductName(e.target.value);
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
    setSelectedProductId('');
    setProductName('');
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
          newErrors[`part_${index}_part_id`] = 'Part is required!';
          isValid = false;
        }
        if (part.part_quantity == '' && part.part_quantity != '0'){
          newErrors[`part_${index}_part_quantity`] = 'Quantity is required!';
          isValid = false;
        } 
        else if(part.part_quantity < 0) {
          newErrors[`part_${index}_part_quantity`] = 'Quantity must be greater than 0!';
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
            await updateProductParts(part.id, selectedProductId, part.part_id, part.part_quantity);
          }
          else{
            await updateProductParts(-1, selectedProductId, part.part_id, part.part_quantity);
          }
        }

        // Remove deleted parts from the product if any
        for (const partId of deletedParts) {
          await deleteProductParts(partId);
        }
        setErrors({});
      } else {
        // Add new product parts
        let newproduct = await addProduct(productName);
        for (let part of currProductParts) {
          await addProductParts(newproduct.product.id, part.part_id, part.part_quantity);
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
    setSelectedProductId(product.id);
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



  // Handler for delete action
  const handleDelete = (product) => {
    // setUser(user); // Store the user to delete
    confirmDialog({
      message: 'Are you sure you want to delete this product?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => deletingProduct(product), // Call delete function if confirmed
      reject: () => console.log('Delete rejected')
    });
  };
  // Delete function after confirmation
  const deletingProduct = async (product) => {
    
    await deleteProduct(product.id);
    const updatedProducts = products.filter((pro) => pro.id !== product.id);

    // Update the state with the new products array after deletion
    setProducts(updatedProducts);
    resetForm();
 
  };
  // Action buttons for DataTable (Edit/Delete)
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

  return (
    <div>
      <Grid2 container spacing={{ xs: 2, md: 3 }}>
        <Grid2 size={{ xs: 12, md: 12 }}>
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
                <Grid2 container spacing={{ xs: 2, md: 3 }}>
                <Grid2 size={{ xs: 6, md: 4 }}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name ="product_name"
                      label="Product Name"
                      onChange={handleProductNameChange}
                      value={productName}
                      disabled={editMode} // Disable product selection in edit mode
                      error={Boolean(errors.product_name)} // Highlights the input field if there's an error
                      helperText={errors.product_name} // Displays the error message
                      sx={{
                        mb: 2,
                      }}
                    >                      
                    </TextField>
                  </Grid2>

                  {Array.isArray(currProductParts) && currProductParts.map((part, index) => (
                     <Grid2 container size={{xs:12}} spacing={{ xs: 2, md: 3 }} key={index}>
                      <Grid2 size={{ xs: 6, md: 4 }}>
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
                      </Grid2>

                      <Grid2 size={{ xs: 4, md: 4 }}>
                        <TextField
                          fullWidth
                          type="number"
                          label="Part Quantity"
                          value={part.part_quantity}
                          onChange={(e) => handlePartChange(index, 'part_quantity', e.target.value)}
                          error={Boolean(errors[`part_${index}_part_quantity`])}
                          helperText={errors[`part_${index}_part_quantity`]}
                        />
                      </Grid2>

                      {currProductParts.length > 1 && (
                        <Grid2 size={{ xs: 0.5 }}>
                        {/* // <Grid2 item xs={0.3} style={{ marginRight: '8px', marginTop: '4px' }}> Reduced the margin */}
                          <Fab 
                            type='button' 
                            color="error" 
                            onClick={() => handlePartDelete(index)} 
                            size="small"  
                          >
                            <DeleteIcon />
                          </Fab>
                        </Grid2>
                      )}

                      {currProductParts.length === (index + 1) && (
                        <Grid2 size={{ xs: 2, md: 2 }}>
                        {/* <Grid2 item style={{ marginLeft: '8px', marginTop: '4px' }}> Reduced the margin */}
                          <Fab 
                            type='button'
                            color="success" 
                            onClick={addPart} 
                            aria-label="add part"
                            size="small"  
                          >
                            <AddIcon />
                          </Fab>
                        </Grid2>
                      )}

                    </Grid2>
                  ))}
                                 
                  <Grid2 size={{ xs: 12, md: 12 }}>
                    <Button variant="contained" color="primary" type="submit">
                      {editMode ? 'Update' : 'Add'}
                    </Button>
                      <Button
                        type="button" 
                        variant="contained"
                        color="secondary"
                        onClick={resetForm}
                        style={{ marginLeft: '10px' }}
                      >
                        Cancel
                      </Button>
                  </Grid2>
                </Grid2>
              </form>
             
              <div className="card" style={{ marginTop: '2rem' }}>
                <ConfirmDialog />
                <div className="p-mb-4">
                  <FormControl sx={{ m: 1 }}>
                    <InputLabel htmlFor="search-input">Search</InputLabel>
                    <OutlinedInput
                      id="search-input"
                      startAdornment={<InputAdornment position="start"><Search></Search></InputAdornment>}
                      label="Search"
                      onInput={(e) => setFilter(e.target.value)}
                      placeholder="Search..."
                      value={filter}
                    />
                  </FormControl>
                </div>
            
                <DataTable value={filteredProducts}  header="Product Data" globalFilter={globalFilter} sortMode="multiple" paginator rows={10}>
                    <Column field="name" header="Product Name" sortable />
                    <Column header="Parts and Quantities" body={partsBodyTemplate} />
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

export default ProductPartsView;
