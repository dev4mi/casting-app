import React from "react";
import PartContext from "./PartContext";
import { useState } from "react";
const PartState = (props) => {
  const host = process.env.REACT_APP_HOST_URL;
    const partsInitial = [];
      const [parts, setParts]= useState(partsInitial);
      const getAllParts = async () =>{
          const response = await fetch(`${host}/api/parts/fetchallparts`, {
            method: "GET",
            headers: {
              "auth-token":localStorage.getItem('token'),
              "Content-Type": "application/json",
            }
          });
          const json = await response.json();
          // console.log(json);
          setParts(json);
      }
   
      const addPart = async (name) => {
       
        const response = await fetch(`${host}/api/parts/addpart`, {
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
        setParts(parts.concat(json.part));
        return json;
      };
      
      const deletePart = async (id) =>{
        const response = await fetch(`${host}/api/parts/deletepart/${id}`, {
          method: "DELETE",
          headers: {
            "auth-token":localStorage.getItem('token'),
            "Content-Type": "application/json",
          },
        });
        const json = await response.json();
        const newparts = parts.filter((part)=>{return part.id!==id})
        setParts(newparts);
      }
      const updatePart = async (id, name) =>{
       
        const response = await fetch(`${host}/api/parts/updatepart/${id}`, {
          method: "PUT",
          headers: {
            "auth-token":localStorage.getItem('token'),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name }),
        });
        const json = await response.json();
        let newparts = JSON.parse(JSON.stringify(parts));
        for (let index = 0; index < newparts.length; index++) {
          const element = newparts[index];
          if(element.id == id){
            newparts[index].name = name;
            setParts(newparts);
            break;
          }
        }
      }
    return (
        <PartContext.Provider value={{ parts, setParts, getAllParts, addPart, updatePart, deletePart }}>
            {props.children}
        </PartContext.Provider>
    )
}
export default PartState;