import React from "react";
import DispatchContext from "./DispatchContext";
import { useState } from "react";
const DispatchState = (props) => {
  const host = "http://localhost:5000";
    const dispatchInitial = [];
      const [dispatchDetails, setDispatchDetails]= useState(dispatchInitial);
      const [dispatchWithProductsDetails, setDispatchWithProductsDetails]= useState(dispatchInitial);
  
      const getAllDispatchData = async (id = 0) =>{
        let url=`${host}/api/dispatch/fetchalldispatchdata`;

        if(id!=0){
          url=`${host}/api/dispatch/fetchalldispatchdata?id=`+id;
        }
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "auth-token":localStorage.getItem('token'),
            "Content-Type": "application/json",
          }
        });
        const json = await response.json();
        let dispatchDetails = Array.isArray(json) ? json : [];
        setDispatchDetails(dispatchDetails);
        return json;
       
      }
      const getAllDispatchWithProductsData = async () =>{
        const response = await fetch(`${host}/api/dispatch/fetchalldispatchwithproducts`, {
          method: "GET",
          headers: {
            "auth-token":localStorage.getItem('token'),
            "Content-Type": "application/json",
          }
        });
        const json = await response.json();
        let dispatchWithProductsDetails = Array.isArray(json) ? json : [];
        setDispatchWithProductsDetails(dispatchWithProductsDetails);
        return dispatchWithProductsDetails;
       
      }

      const getSingleDispatchData = async (id) =>{
        const response = await fetch(`${host}/api/dispatch/fetchspecificdispatchdata/${id}`, {
          method: "GET",
          headers: {
            "auth-token":localStorage.getItem('token'),
            "Content-Type": "application/json",
          }
        });
        const json = await response.json();
        let dispatchDetails = Array.isArray(json) ? json : [];
        // setDispatchDetails(dispatchDetails);
        return dispatchDetails;
      }
      
      const addDispatchData = async (totalCompanies, totalProducts, records) => {
        
        const response = await fetch(`${host}/api/dispatch/adddispatchdata`, {
          method: 'POST',
          headers: {
            "auth-token":localStorage.getItem('token'),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ totalCompanies, totalProducts, records })
        });
      
        if (!response.ok) {
          const errorData = await response.json();
          const error = new Error('Request failed');
          error.response = { data: errorData };
          throw error;
      
        }
        const json = await response.json();
        getAllDispatchData();
        return json;
      };

      const updateDispatchData = async (id, totalCompanies, totalProducts, records) => {
        
        const response = await fetch(`${host}/api/dispatch/updatedispatchdata/${id}`, {
          method: 'POST',
          headers: {
            "auth-token":localStorage.getItem('token'),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ totalCompanies, totalProducts, records })
        });
      
        if (!response.ok) {
          const errorData = await response.json();
          const error = new Error('Request failed');
          error.response = { data: errorData };
          throw error;
      
        }
        const json = await response.json();
        getAllDispatchData();
        return json;
      };
      
      const deleteDispatchMappingRecord = async (details_id, totalCompanies, totalProducts) =>{
        const response = await fetch(`${host}/api/dispatch/deletedispatchmapping`, {
          method: "DELETE",
          headers: {
            "auth-token":localStorage.getItem('token'),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ details_id, totalCompanies, totalProducts })
        });
        const json = await response.json();
        getAllDispatchData();
      }

      const deleteDispatchData = async (id) =>{
        const response = await fetch(`${host}/api/dispatch/deletedispatchdata/${id}`, {
          method: "DELETE",
          headers: {
            "auth-token":localStorage.getItem('token'),
            "Content-Type": "application/json",
          },
        });
        const json = await response.json();
        getAllDispatchData();        
      }

    return (
        <DispatchContext.Provider value={{ dispatchDetails, dispatchWithProductsDetails, setDispatchDetails, getAllDispatchData, getAllDispatchWithProductsData, getSingleDispatchData, addDispatchData, updateDispatchData, deleteDispatchMappingRecord, deleteDispatchData}}>
            {props.children}
        </DispatchContext.Provider>
    )
}
export default DispatchState;