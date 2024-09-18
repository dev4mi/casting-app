import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Divider,
  Box,
  Typography,
  TextField,
  Grid,
  MenuItem,
  Button,
  IconButton,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

const company = [
  { id: 1, name: "C_One" },
  { id: 2, name: "C_Two" },
  { id: 3, name: "C_Three" },
  { id: 4, name: "C_Four" },
];
const products = [
  { id: 1, name: "Product_One" },
  { id: 2, name: "Product_Two" },
  { id: 3, name: "Product_Three" },
  { id: 4, name: "Product_Four" },
];
const parts = [
  { id: 1, name: "Part_One" },
  { id: 2, name: "Part_Two" },
  { id: 3, name: "Part_Three" },
  { id: 4, name: "Part_Four" },
];
const company_products = [
  { id: 1, company_id: 1, product_id: 1 },
  { id: 2, company_id: 1, product_id: 2 },
  { id: 3, company_id: 2, product_id: 3 },
  { id: 4, company_id: 3, product_id: 4 },
];
const product_parts = [
  { id: 1, company_id: 1, product_id: 1, part_id: 1, part_qty: 0 },
  { id: 2, company_id: 1, product_id: 1, part_id: 2, part_qty: 0 },
  { id: 3, company_id: 1, product_id: 2, part_id: 3, part_qty: 0 },
  { id: 4, company_id: 1, product_id: 2, part_id: 4, part_qty: 0 },
];

const MoldingView = () => {
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [records, setRecords] = useState([]);
  
  useEffect(() => {
    // Initialize records if needed
    setRecords([]);
  }, []);

  const handleCompanyChange = (event) => {
    setSelectedCompany(event.target.value);
  };

  const handleProductChange = (event) => {
    setSelectedProduct(event.target.value);
  };

  const handleAddRecord = () => {
    if (selectedCompany && selectedProduct) {
      // Get relevant parts for the selected company and product
      const relevantParts = product_parts.filter(pp =>
        pp.company_id === parseInt(selectedCompany) &&
        pp.product_id === parseInt(selectedProduct)
      );

      const newRecord = {
        id: Date.now(), // Temporary ID for new entry
        company_id: parseInt(selectedCompany),
        product_id: parseInt(selectedProduct),
        parts: relevantParts.map(pp => ({
          part_id: pp.part_id,
          part_name: parts.find(p => p.id === pp.part_id)?.name || '',
          part_qty: pp.part_qty,
        }))
      };
      
      setRecords([...records, newRecord]);
    }
  };

  const handleQuantityChange = (recordId, partId, event) => {
    const updatedRecords = records.map(record => {
      if (record.id === recordId) {
        const updatedParts = record.parts.map(part => {
          if (part.part_id === partId) {
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

  const handleRemoveRecord = (recordId) => {
    const updatedRecords = records.filter(record => record.id !== recordId);
    setRecords(updatedRecords);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Here you would usually send updated records to the server
    console.log('Updated Records:', records);
  };

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card variant="outlined">
            <Box padding="15px 30px" display="flex" alignItems="center">
              <Box flexGrow={3}>
                <Typography fontSize="18px" fontWeight="500">
                  Molding Form
                </Typography>
              </Box>
            </Box>
            <Divider />
            <CardContent padding="30px">
              <form encType='multipart/form-data' onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      id="company_id"
                      name="company_id"
                      variant="outlined"
                      select
                      label="Select Company"
                      value={selectedCompany}
                      onChange={handleCompanyChange}
                    >
                      {company.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      id="product_id"
                      name="product_id"
                      variant="outlined"
                      select
                      label="Select Product"
                      value={selectedProduct}
                      onChange={handleProductChange}
                    >
                      {products.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>

                <Box mt={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddRecord}
                    startIcon={<AddIcon />}
                  >
                    Add Record
                  </Button>
                </Box>

                {records.length > 0 && (
                  <Box mt={2}>
                    {records.map((record) => (
                      <Card variant="outlined" key={record.id} sx={{ mb: 2 }}>
                        <CardContent>
                          <Typography variant="h6">
                            Company ID: {record.company_id} | Product ID: {record.product_id}
                          </Typography>
                          {record.parts.map((part) => (
                            <Grid container spacing={2} alignItems="center" key={part.part_id}>
                              <Grid item xs={4}>
                                <TextField
                                  fullWidth
                                  variant="outlined"
                                  label={part.part_name || 'Part'}
                                  type="number"
                                  value={part.part_qty || ''}
                                  onChange={(e) => handleQuantityChange(record.id, part.part_id, e)}
                                />
                              </Grid>
                              <Grid item xs={1}>
                               
                              </Grid>
                            </Grid>
                            
                          ))}
                           <IconButton onClick={() => handleRemoveRecord(record.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}

                <Box mt={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                  >
                    Submit
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default MoldingView;
