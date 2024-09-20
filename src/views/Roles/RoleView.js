import React, { useContext, useEffect, useState } from 'react';
import {
  Card, CardContent, Divider, Box, Typography, TextField,
  Grid2, Fab, FormControlLabel, Checkbox,
  InputLabel, OutlinedInput, InputAdornment, Button,
  FormControl,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon, Search } from '@mui/icons-material';

import RoleContext from '../../context/RoleContext';
import PermissionContext from '../../context/PermissionContext';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column'; 
import { Button as PrimeButton } from 'primereact/button'; 
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'; 
import { AlertContext } from "../../context/AlertContext";
import { useNavigate } from 'react-router-dom';

const RoleView = (props) => {
  const navigate = useNavigate();
  const { showAlert } = useContext(AlertContext);
  const { roles, getAllRoles, addRole, deleteRole, updateRole } = useContext(RoleContext);
  const { permissions, getAllPermissions } = useContext(PermissionContext);

  const [role, setRole] = useState({ name: "" });
  const [rolePermissions, setRolePermissions] = useState([]);
  const [errors, setErrors] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(''); // State to hold the search term

  const columns = [
    { field: 'name', header: 'Role Name' },
  ];

  const indexBodyTemplate = (rowData, { rowIndex }) => {
    return <span>{rowIndex + 1}</span>;
  };

  useEffect(() => {
    if (localStorage.getItem('token')) {
      getAllPermissions();
      getAllRoles();
    } else {
      navigate('/login');
    }
    //eslint-disable-next-line
  }, []);

  const handleEdit = (role) => {
    setErrors({});
    setRole({
      id: role.id,
      name: role.name,
    });
    setSelectedPermissions(role.permissions.map(p => p.id)); // Assuming permissions have an _id field
    setEditMode(true);
    
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleDelete = (role) => {
    confirmDialog({
      message: 'Are you sure you want to delete this role?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => deletingRole(role),
      reject: () => console.log('Delete rejected'),
    });
  };

  const deletingRole = async (role) => {
    await deleteRole(role.id);
    showAlert('Role has been deleted.', 'success');
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
    if (role.name.length < 3) {
      newErrors['name'] = 'Enter a valid Role Name. It must be at least 3 characters long.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (validateForm()) {
        if (!editMode) {
          await addRole({ name: role.name, permissions: selectedPermissions });
          showAlert('Role has been created.', 'success');
        } else {
          await updateRole(role.id, { name: role.name, permissions: selectedPermissions });
          showAlert('Role has been updated.', 'success');
          setEditMode(false);
        }
        setErrors({});
        resetForm();
      }
    } catch (error) {
      showAlert('Something went wrong! Please try again later.', 'error');
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      }
    }
  };

  const onChange = (e) => {
    setRole({ ...role, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const onGlobalFilterChange = (e) => {
    setGlobalFilter(e.target.value);
  };

  const resetForm = () => {
    setRole({ name: "" });
    setSelectedPermissions([]);
    setEditMode(false);
    setErrors({});
  };

  const handlePermissionChange = (permissionId) => {
    setSelectedPermissions((prevSelected) =>
      prevSelected.includes(permissionId)
        ? prevSelected.filter(id => id !== permissionId)
        : [...prevSelected, permissionId]
    );
  };

  return (
    <div>
      <Grid2 container spacing={{ xs: 2, md: 3 }}>
        <Grid2 size={{ xs: 12, md: 12 }}>
          <Card variant="outlined" sx={{ p: 0 }}>
            <Box sx={{ padding: "15px 30px" }} display="flex" alignItems="center">
              <Box flexGrow={1}>
                <Typography sx={{ fontSize: "18px", fontWeight: "500" }}>Role Form</Typography>
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
                      label="Role Name"
                      variant="outlined"
                      fullWidth
                      onChange={onChange}
                      value={role.name}
                      error={Boolean(errors.name)}
                      helperText={errors.name}
                      sx={{ mb: 2 }}
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12, md: 12 }}>
                    <Typography variant="h6">Permissions</Typography>
                    {permissions.map(permission => (
                      <FormControlLabel
                        key={permission.id}
                        control={
                          <Checkbox
                            checked={selectedPermissions.includes(permission.id)}
                            onChange={() => handlePermissionChange(permission.id)}
                          />
                        }
                        label={permission.name}
                      />
                    ))}
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
                <DataTable value={roles} paginator rows={10} header="Role Data" globalFilter={globalFilter} sortMode="multiple">
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

export default RoleView;
