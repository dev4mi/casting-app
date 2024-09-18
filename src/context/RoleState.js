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
        //   "auth-token":localStorage.getItem('token'),
          "Content-Type": "application/json",
        }
      });
      const json = await response.json();
    //   console.log(json);
      setRoles(json);
  }

  return (
        <RoleContext.Provider value={{roles, setRoles, getAllRoles }}>
            {props.children}
        </RoleContext.Provider>
    )
};

export default RoleState;
