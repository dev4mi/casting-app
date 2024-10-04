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

import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'; 
import { AlertContext } from "../../context/AlertContext";
import { useNavigate } from 'react-router-dom';

import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ReportContext from '../../context/ReportContext';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }
  
  CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
 
const ReportView = (props) => {
  const btnCancelRef = useRef(null); 
  const navigate = useNavigate();
  const { showAlert } = useContext(AlertContext);
  const [errors, setErrors] = useState({});
  const [globalFilter, setGlobalFilter] = useState(''); // State to hold the search term
  const [records, setRecords] = useState([]);
  const [value, setValue] = React.useState(0);
  const { moldingDetails, setMoldingDetails, getAllMoldingData, pouringDetails, setPouringDetails, getAllPouringData, dispatchDetails, setDispatchDetails, getAllDispatchData } = useContext(ReportContext);

  useEffect(() => {
    getAllMoldingData();
    getAllPouringData();
    getAllDispatchData();
  }, []);
 
  const onGlobalFilterChange = (e) => {
    setGlobalFilter(e.target.value);
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
      
    });
  
    setErrors(newErrors);
    return isValid;
  };

  const [mstartDate, setMStartDate] = useState(null);
  const [mendDate, setMEndDate] = useState(null);
  const [pstartDate, setPStartDate] = useState(null);
  const [pendDate, setPEndDate] = useState(null);
  const [dstartDate, setDStartDate] = useState(null);
  const [dendDate, setDEndDate] = useState(null);

  const resetMoldingForm = () => {
    setMStartDate(null);
    setMEndDate(null);
    getAllMoldingData();
  };
  const resetPouringForm = () => {
    setPStartDate(null);
    setPEndDate(null);
    getAllPouringData();
  };
  const resetDispatchForm = () => {
    setDStartDate(null);
    setDEndDate(null);
    getAllDispatchData();
  };

  const getFilteredMoldingData = async () => {
    const newErrors = {};
    
    // Check if startDate and endDate are provided
    if (mstartDate && mendDate) {
        const startDate = new Date(mstartDate);
        const endDate = new Date(mendDate);

        // Validate the date range
        if (startDate > endDate) {
            newErrors[`mstartdate`] = 'Start date cannot be greater than end date!';
            showAlert('Start date cannot be greater than end date!', 'error');
            setErrors(newErrors);
            return null; // Return null to indicate a failure in validation
        }

        // Fetch the data using your API logic
        const fetchedData = await getAllMoldingData(mstartDate, mendDate);
        setMoldingDetails(fetchedData); // Update state for UI
        if(fetchedData.length <= 0)
            showAlert('No Data Found!!','error');
        return fetchedData; // Return fetched data directly
    } else {
        showAlert('Please select start & end date first!', 'error');
    }

    // Set errors if no valid dates were provided
    setErrors(newErrors);
    return null; // Return null if no valid dates
};

  const exportData = async (data)=>{
    if(data=='molding'){
        const fetchedData = await getFilteredMoldingData();

        // Only call export if data fetching was successful
        if (fetchedData) {
            if(fetchedData.length > 0)
                exportToExcel(fetchedData);  
            else
                showAlert('No Data Found!!','error');
        }       
    }  
    else if(data=='pouring'){
        const fetchedData = await getFilteredPouringData();

        // Only call export if data fetching was successful
        if (fetchedData) {
            if(fetchedData.length > 0)
                exportPouringDataToExcel(fetchedData);  
            else
                showAlert('No Data Found!!','error');
        }       
    }  
    else if(data=='dispatch'){
        const fetchedData = await getFilteredDispatchData();

        // Only call export if data fetching was successful
        if (fetchedData) {
            if(fetchedData.length > 0)
                exportDispatchDataToExcel(fetchedData);  
            else
                showAlert('No Data Found!!','error');
        }       
    }  
   }

  const getFilteredPouringData = async ()=>{
        
    const newErrors = {};
    
    // Check if startDate and endDate are provided
    if (pstartDate && pendDate) {
        const startDate = new Date(pstartDate);
        const endDate = new Date(pendDate);

        // Validate the date range
        if (startDate > endDate) {
            newErrors[`pstartdate`] = 'Start date cannot be greater than end date!';
            showAlert('Start date cannot be greater than end date!', 'error');
            setErrors(newErrors);
            return null; // Return null to indicate a failure in validation
        }

        // Fetch the data using your API logic
        const fetchedData = await getAllPouringData(pstartDate, pendDate);
        setPouringDetails(fetchedData); // Update state for UI
        if(fetchedData.length <= 0)
            showAlert('No Data Found!!','error');
        return fetchedData; // Return fetched data directly
    } else {
        showAlert('Please select start & end date first!', 'error');
    }

    // Set errors if no valid dates were provided
    setErrors(newErrors);
    return null; // Return null if no valid dates
        
    }
    const getFilteredDispatchData = async ()=>{
        const newErrors = {};
    
        // Check if startDate and endDate are provided
        if (dstartDate && dendDate) {
            const startDate = new Date(dstartDate);
            const endDate = new Date(dendDate);
    
            // Validate the date range
            if (startDate > endDate) {
                newErrors[`dstartdate`] = 'Start date cannot be greater than end date!';
                showAlert('Start date cannot be greater than end date!', 'error');
                setErrors(newErrors);
                return null; // Return null to indicate a failure in validation
            }
    
            // Fetch the data using your API logic
            const fetchedData = await getAllDispatchData(dstartDate, dendDate);
            setDispatchDetails(fetchedData); // Update state for UI
            if(fetchedData.length <= 0)
                showAlert('No Data Found!!','error');
            return fetchedData; // Return fetched data directly
        } else {
            showAlert('Please select start & end date first!', 'error');
        }
    
        // Set errors if no valid dates were provided
        setErrors(newErrors);
        return null; // Return null if no valid dates
    }
   
  const handleSubmit = async(event) => {
    event.preventDefault();

    try {
      if (validateForm()) {
        
      }
      } catch (error) {
        showAlert('Something went wrong! Please try again later.', 'error');
        if (error.response && error.response.data.errors) {
          setErrors(error.response.data.errors);
        }
      }
  };
 
  const exportToExcel = (moldingDetails) => {

        const worksheetData = [];

        // Prepare header row
        const header = [
            'ID',
            'Molding Unique Number',
            'Generate Date',
            'Company',
            'Product',
            'Part Name',
            'Total Quantity',
            'Rejected Quantity',
            'Rejected Date',
            'Final Quantity'
        ];
        worksheetData.push(header);

        // Populate the worksheet data
        moldingDetails.forEach(molding => {
            const { _id, molding_unique_number, generate_date, companies } = molding;

            companies.forEach(company => {
                company.products.forEach(product => {
                    product.parts.forEach(part => {
                        worksheetData.push([
                            _id,
                            molding_unique_number,
                            dayjs(generate_date).format('DD-MM-YYYY'),
                            company.company.name,
                            product.name,
                            part.name,
                            part.part_quantity,
                            part.rejection_quantity,
                            part.rejection_date ? dayjs(part.rejection_date).format('DD-MM-YYYY') : '-',
                            part.final_quantity,
                        ]);
                    });
                });
            });
        });

        // Create a new workbook and add the worksheet
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Molding Data');

        // Export the workbook to a file
        XLSX.writeFile(workbook, 'molding_data.xlsx');
    };
    const exportPouringDataToExcel = (pouringDetails) => {
        const worksheetData = [];

        // Prepare header row
        const header = [
            'ID',
            'Heat Number',
            'Generate Date',
            'Company',
            'Product Name',
            'Total Quantity',
            'Rejected Quantity',
            'Rejected Date',
            'Final Quantity'
        ];
        worksheetData.push(header);

        // Populate the worksheet data
        pouringDetails.forEach(pouring => {
            const { _id, heat_number, generate_date, companies } = pouring;

            companies.forEach(company => {
                company.products.forEach(product => {
                    worksheetData.push([
                        _id,
                        heat_number,
                        dayjs(generate_date).format('DD-MM-YYYY'),
                        company.company.name,
                        product.name,
                        product.quantity,
                        product.rejection_quantity,
                        product.rejection_date ? dayjs(product.rejection_date).format('DD-MM-YYYY') : '-',
                        product.final_quantity,
                    ]);
                });
            });
        });

        // Create a new workbook and add the worksheet
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Pouring Data');

        // Export the workbook to a file
        XLSX.writeFile(workbook, 'pouring_data.xlsx');
    };

    const exportDispatchDataToExcel = (dispatchDetails) => {
        const worksheetData = [];
    
        // Prepare header row
        const header = [
            'ID',
            'Dispatch Unique Number',
            'Generate Date',
            'Company',
            'Product Name',
            'Total Quantity',
            'Rejected Quantity',
            'Rejected Date',
            'Final Quantity'
        ];
        worksheetData.push(header);
    
        // Populate the worksheet data
        dispatchDetails.forEach(dispatch => {
            const { _id, dispatch_unique_number, generate_date, companies } = dispatch;
    
            companies.forEach(company => {
                company.products.forEach(product => {
                    worksheetData.push([
                        _id,
                        dispatch_unique_number,
                        dayjs(generate_date).format('DD-MM-YYYY'),
                        company.company.name,
                        product.name,
                        product.quantity,
                        product.rejection_quantity,
                        product.rejection_date ? dayjs(product.rejection_date).format('DD-MM-YYYY') : '-',
                        product.final_quantity,
                    ]);
                });
            });
        });
    
        // Create a new workbook and add the worksheet
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Dispatch Data');
    
        // Export the workbook to a file
        XLSX.writeFile(workbook, 'dispatch_data.xlsx');
    };

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

    const handleChangeTab = (event, newValue) => {
    setValue(newValue);
    };

  return (
    <div>
       <Grid2 container spacing={{ xs: 2, md: 3 }}>
       <Grid2 size={{ xs: 12, md: 12 }}>
          <Card variant="outlined">
            <Box padding="15px 30px" display="flex" alignItems="center">
              <Box flexGrow={3}>
                <Typography fontSize="18px" fontWeight="500">
                   Report
                </Typography>
              </Box>
            </Box>
            <Divider />
            <CardContent padding="30px">
              <form encType="multipart/form-data" onSubmit={handleSubmit}>
             
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChangeTab} aria-label="report">
                        <Tab label="Molding Report" {...a11yProps(0)} />
                        <Tab label="Pouring Report" {...a11yProps(1)} />
                        <Tab label="Dispatch Report" {...a11yProps(2)} />
                    </Tabs>
                </Box>
             
                <CustomTabPanel value={value} index={0}>
               
                    <Grid2 container spacing={{ xs: 2, md: 3 }}>
                        {/* <Grid2 size={{ xs: 12, md: 12 }}>
                            <h3>Select Date Range</h3>
                            </Grid2> */}
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Grid2 size={{ xs: 6, md: 3 }}>
                                <DatePicker
                                    label="Start Date"
                                    value={mstartDate}
                                    fullWidth
                                    sx={{ width:'100%'}}
                                    onChange={(newValue) => setMStartDate(newValue)}
                                    error={Boolean(errors[`mstartdate`])}
                                    helperText={errors[`mstartdate`]} 
                                    renderInput={(params) => <TextField {...params}
                                    />}
                                />
                                </Grid2>
                                <Grid2 size={{ xs: 6, md: 3 }}>
                                <DatePicker
                                    label="End Date"
                                    value={mendDate}
                                    sx={{ width:'100%'}}
                                    onChange={(newValue) => setMEndDate(newValue)}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                                
                                </Grid2>
                                <Grid2 size={{ xs: 6, md: 4 }}>
                                    <PrimeButton variant="contained" color="primary" type="submit" sx={{mt: 4 }} onClick={getFilteredMoldingData}>
                                        Submit
                                    </PrimeButton>
                                    <PrimeButton
                                        type="button" 
                                        ref={btnCancelRef}
                                        variant="contained"
                                        color="secondary"
                                        onClick={resetMoldingForm}
                                        style={{ marginLeft: '10px', marginTop:'-5px'  }}
                                    >
                                    Cancel
                                    </PrimeButton>
                                    <PrimeButton
                                        type="button" 
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => exportData('molding')}
                                        style={{ marginLeft: '10px', marginTop:'-5px'  }}
                                    >
                                    Export to Excel
                                    </PrimeButton>
                                   
                                </Grid2>
                                            
                        </LocalizationProvider>
                        </Grid2>
                        <Grid2 container spacing={{ xs: 2, md: 3 }}>
                            <Grid2 size={{ xs: 12, md: 12 }}> 
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

                            </div>
                            
                            <DataTable value={moldingDetails}  id="moldingDataTable" paginator rows={10} header="Molding Data" globalFilter={globalFilter} sortMode="multiple">
                            <Column field="_id" header="ID" />
                            <Column field="molding_unique_number" header="Molding Unique Number" />
                            <Column 
                                field="generate_date" 
                                header="Generate Date" 
                                body={(rowData) => dayjs(rowData.generate_date).format('DD-MM-YYYY')} 
                                />
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
                                                                    {part.name}<br/>(Total Quantity: {part.part_quantity})<br/>(Rejected Quantity: {part.rejection_quantity})<br/>(Rejected Date: {(part.rejection_date != null)?dayjs(part.rejection_date).format('DD-MM-YYYY'):'-'})<br/>(Final Quantity: {part.final_quantity})
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

                        </DataTable>
                        </Grid2>
                    </Grid2>               
                </CustomTabPanel>

                <CustomTabPanel value={value} index={1}>                    
                    <Grid2 container spacing={{ xs: 2, md: 3 }}>
                        {/* <Grid2 size={{ xs: 12, md: 12 }}>
                            <h3>Select Date Range</h3>
                            </Grid2> */}
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Grid2 size={{ xs: 6, md: 3 }}>
                                <DatePicker
                                    label="Start Date"
                                    value={pstartDate}
                                    fullWidth
                                    sx={{ width:'100%'}}
                                    error={Boolean(errors[`pstartdate`])}
                                    helperText={errors[`pstartdate`]} 
                                    onChange={(newValue) => setPStartDate(newValue)}
                                    renderInput={(params) => <TextField {...params}
                                    />}
                                />
                                </Grid2>
                                <Grid2 size={{ xs: 6, md: 3 }}>
                                <DatePicker
                                    label="End Date"
                                    value={pendDate}
                                    sx={{ width:'100%'}}
                                    onChange={(newValue) => setPEndDate(newValue)}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                                
                                </Grid2>
                                <Grid2 size={{ xs: 6, md: 4 }}>
                                    <PrimeButton variant="contained" color="primary" type="submit" sx={{mt: 4 }} onClick={getFilteredPouringData}>
                                        Submit
                                    </PrimeButton>
                                    <PrimeButton
                                        type="button" 
                                        ref={btnCancelRef}
                                        variant="contained"
                                        color="secondary"
                                        onClick={resetPouringForm}
                                        style={{ marginLeft: '10px', marginTop:'-5px'  }}
                                    >
                                    Cancel
                                    </PrimeButton>
                                    <PrimeButton
                                        type="button" 
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => exportData('pouring')}
                                        style={{ marginLeft: '10px', marginTop:'-5px'  }}
                                    >
                                    Export to Excel
                                    </PrimeButton>
                                </Grid2>
                                            
                        </LocalizationProvider>
                        </Grid2>
                        <Grid2 container spacing={{ xs: 2, md: 3 }}>
                            <Grid2 size={{ xs: 12, md: 12 }}> 
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

                            </div>
                            
                            <DataTable value={pouringDetails} paginator rows={10} header="Pouring Data" globalFilter={globalFilter} sortMode="multiple">
                                <Column field="_id" header="ID" />
                                <Column field="heat_number" header="Heat Number" />
                                <Column 
                                    field="generate_date" 
                                    header="Generate Date" 
                                    body={(rowData) => dayjs(rowData.generate_date).format('DD-MM-YYYY')} 
                                    />
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
                                                            <em>{product.name}<br/>(Total Quantity: {product.quantity})<br/>(Rejected Quantity: {product.rejection_quantity})<br/>(Rejected Date: {(product.rejection_date != null)?dayjs(product.rejection_date).format('DD-MM-YYYY'):'-'})<br/>(Final Quantity: {product.final_quantity})</em>
                                                        </td>
                                                        
                                                    </tr>
                                                ))
                                            ))}
                                        </tbody>
                                    </table>

                                    </div>
                                )} />

                            </DataTable>
                        </Grid2>
                    </Grid2>  
                </CustomTabPanel>
                
                
                <CustomTabPanel value={value} index={2}>
                <Grid2 container spacing={{ xs: 2, md: 3 }}>
                        {/* <Grid2 size={{ xs: 12, md: 12 }}>
                            <h3>Select Date Range</h3>
                            </Grid2> */}
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Grid2 size={{ xs: 6, md: 3 }}>
                                <DatePicker
                                    label="Start Date"
                                    value={dstartDate}
                                    fullWidth
                                    sx={{ width:'100%'}}
                                    error={Boolean(errors[`dstartdate`])}
                                    helperText={errors[`dstartdate`]} 
                                    onChange={(newValue) => setDStartDate(newValue)}
                                    renderInput={(params) => <TextField {...params}
                                    />}
                                />
                                </Grid2>
                                <Grid2 size={{ xs: 6, md: 3 }}>
                                <DatePicker
                                    label="End Date"
                                    value={dendDate}
                                    sx={{ width:'100%'}}
                                    onChange={(newValue) => setDEndDate(newValue)}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                                
                                </Grid2>
                                <Grid2 size={{ xs: 6, md: 4 }}>
                                    <PrimeButton variant="contained" color="primary" type="submit" sx={{mt: 4 }} onClick={getFilteredDispatchData}>
                                        Submit
                                    </PrimeButton>
                                    <PrimeButton
                                        type="button" 
                                        ref={btnCancelRef}
                                        variant="contained"
                                        color="secondary"
                                        onClick={resetDispatchForm}
                                        style={{ marginLeft: '10px', marginTop:'-5px'  }}
                                    >
                                    Cancel
                                    </PrimeButton>
                                    <PrimeButton
                                        type="button" 
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => exportData('dispatch')}
                                        style={{ marginLeft: '10px', marginTop:'-5px'  }}
                                    >
                                    Export to Excel
                                    </PrimeButton>
                                </Grid2>
                                            
                        </LocalizationProvider>
                        </Grid2>
                        <Grid2 container spacing={{ xs: 2, md: 3 }}>
                            <Grid2 size={{ xs: 12, md: 12 }}> 
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

                            </div>
                            
                            <DataTable value={dispatchDetails} paginator rows={10} header="Dispatch Data" globalFilter={globalFilter} sortMode="multiple">
                            <Column field="_id" header="ID" />
                            <Column field="dispatch_unique_number" header="Dispatch Unique Number" />
                            <Column 
                                field="generate_date" 
                                header="Generate Date" 
                                body={(rowData) => dayjs(rowData.generate_date).format('DD-MM-YYYY')} 
                                />

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
                                                        <em>{product.name}<br/>(Total Quantity: {product.quantity})<br/>(Rejected Quantity: {product.rejection_quantity})<br/>(Rejected Date: {(product.rejection_date != null)?dayjs(product.rejection_date).format('DD-MM-YYYY'):'-'})<br/>(Final Quantity: {product.final_quantity})</em>
                                                    </td>
                                                    
                                                </tr>
                                            ))
                                        ))}
                                    </tbody>
                                </table>

                                </div>
                            )} />

                        </DataTable>
                        </Grid2>
                    </Grid2>     
                </CustomTabPanel>
                </Box>
               
              </form>
            
             
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </div>
  );
  };
export default ReportView;
