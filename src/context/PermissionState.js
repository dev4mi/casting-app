import React from "react";
import PermissionContext from "./PermissionContext";
import { useState } from "react";
const PermissionState = (props) => {
  const host = process.env.REACT_APP_HOST_URL;
    const permissionsInitial = [];
      const [permissions, setPermissions]= useState(permissionsInitial);
      const getAllPermissions = async () =>{
          const response = await fetch(`${host}/api/permissions/fetchallpermissions`, {
            method: "GET",
            headers: {
              "auth-token":localStorage.getItem('token'),
              "Content-Type": "application/json",
            }
          });
          const json = await response.json();
          // console.log(json);
          setPermissions(json);
      }
   
      const addPermission = async (name) => {
       
        const response = await fetch(`${host}/api/permissions/addpermission`, {
          method: 'POST',
          headers: {
            "auth-token":localStorage.getItem('token'),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name })
          
        });
      
        if (!response.ok) {
          const errorData = await response.json();
          const error = new Error('Request failed');
          error.response = { data: errorData };
          throw error;
      
        }
        const json = await response.json();
        setPermissions(permissions.concat(json.permission));
        return json;
      };
      
      const deletePermission = async (id) =>{
        const response = await fetch(`${host}/api/permissions/deletepermission/${id}`, {
          method: "DELETE",
          headers: {
            "auth-token":localStorage.getItem('token'),
            "Content-Type": "application/json",
          },
        });
        const json = await response.json();
        const newPermissions = permissions.filter((permission)=>{return permission.id!==id})
        setPermissions(newPermissions);
      }
      const updatePermission = async (id, name) =>{
       
        const response = await fetch(`${host}/api/permissions/updatepermission/${id}`, {
          method: "PUT",
          headers: {
            "auth-token":localStorage.getItem('token'),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name }),
        });
        const json = await response.json();
        let newPermissions = JSON.parse(JSON.stringify(permissions));
        for (let index = 0; index < newPermissions.length; index++) {
          const element = newPermissions[index];
          if(element.id == id){
            newPermissions[index].name = name;
            setPermissions(newPermissions);
            break;
          }
        }
      }
    return (
        <PermissionContext.Provider value={{ permissions, setPermissions, getAllPermissions, addPermission, updatePermission, deletePermission }}>
            {props.children}
        </PermissionContext.Provider>
    )
}
export default PermissionState;