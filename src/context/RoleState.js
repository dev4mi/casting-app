import React, { useContext } from "react";
import RoleContext from "./RoleContext";
import { useState } from "react";
import { useAuth } from "./AuthContext"; 

const RoleState = (props) => {
  const [roles, setRoles] = useState([]);
  const [rolesWithPermissions, setRolesWithPermissions] = useState([]);
  // const { getVarWithExpiry } = useAuth();
  const host = process.env.REACT_APP_HOST_URL;
  // Function to fetch roles (example with API call)
  const getAllRoles = async () =>{
      const response = await fetch(`${host}/api/roles/fetchallroles`, {
        method: "GET",
        headers: {
          "auth-token":localStorage.getItem('token'),
          "Content-Type": "application/json",
        }
      });
      const json = await response.json();
      setRoles(json);
  }
  const getAllRolesWithPermissions = async () =>{
    const response = await fetch(`${host}/api/roles/fetchallroleswithpermissions`, {
      method: "GET",
      headers: {
        "auth-token":localStorage.getItem('token'),
        "Content-Type": "application/json",
      }
    });
    const json = await response.json();
    setRolesWithPermissions(json);
  }

  const addRole = async (name, permissions) => {
    
    const response = await fetch(`${host}/api/roles/addrole`, {
      method: 'POST',
      headers: {
        "auth-token":localStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, permissions})
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      const error = new Error('Request failed');
      error.response = { data: errorData };
      throw error;
  
    }
    const json = await response.json();
    setRoles(roles.concat(json.role));
    getAllRolesWithPermissions();
    return json;
  };
  
  const deleteRole = async (id) =>{
    const response = await fetch(`${host}/api/roles/deleterole/${id}`, {
      method: "DELETE",
      headers: {
        "auth-token":localStorage.getItem('token'),
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();
    const newRoles = roles.filter((role)=>{return role.id!==id})
    setRoles(newRoles);
    getAllRolesWithPermissions();

  }
  const updateRole = async (id, name, permissions) =>{
    
    const response = await fetch(`${host}/api/roles/updaterole/${id}`, {
      method: "PUT",
      headers: {
        "auth-token":localStorage.getItem('token'),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, permissions }),
    });
    const json = await response.json();
    if(json.success){
      let newRoles = JSON.parse(JSON.stringify(roles));
      for (let index = 0; index < newRoles.length; index++) {
        const element = newRoles[index];
        if(element.id == id){
          newRoles[index].name = name;
          setRoles(newRoles);
          break;
        }
      }
      getAllRolesWithPermissions();
    }
    return json;
  }

  return (
        <RoleContext.Provider value={{roles, setRoles, rolesWithPermissions, setRolesWithPermissions, getAllRolesWithPermissions, getAllRoles, addRole, updateRole, deleteRole }}>
            {props.children}
        </RoleContext.Provider>
    )
};

export default RoleState;
