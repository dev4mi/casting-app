import React from "react";
import RoleContext from "./RoleContext";
import { useState } from "react";

const RoleState = (props) => {
  const [roles, setRoles] = useState([]);
  const host = "http://localhost:5000";
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
    //   console.log(json);
      setRoles(json);
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
    let newRoles = JSON.parse(JSON.stringify(roles));
    for (let index = 0; index < newRoles.length; index++) {
      const element = newRoles[index];
      if(element.id == id){
        newRoles[index].name = name;
        setRoles(newRoles);
        break;
      }
    }
  }

  return (
        <RoleContext.Provider value={{roles, setRoles, getAllRoles, addRole, updateRole, deleteRole }}>
            {props.children}
        </RoleContext.Provider>
    )
};

export default RoleState;
