import React from "react";
import PouringContext from "./PouringContext";
import { useState } from "react";
const PouringState = (props) => {
  const host = process.env.REACT_APP_HOST_URL;
    const pouringInitial = [];
      const [pouringDetails, setPouringDetails]= useState(pouringInitial);
      const [pouringWithProductsDetails, setPouringWithProductsDetails]= useState(pouringInitial);
  
      const getAllPouringData = async (id = 0) =>{
        let url=`${host}/api/pouring/fetchallpouringdata`;

        if(id!=0){
          url=`${host}/api/pouring/fetchallpouringdata?id=`+id;
        }
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "auth-token":localStorage.getItem('token'),
            "Content-Type": "application/json",
          }
        });
        const json = await response.json();
        let pouringDetails = Array.isArray(json) ? json : [];
        setPouringDetails(pouringDetails);
        return json;
       
      }
      const getAllPouringWithProductsData = async () =>{
        const response = await fetch(`${host}/api/pouring/fetchallpouringwithproducts`, {
          method: "GET",
          headers: {
            "auth-token":localStorage.getItem('token'),
            "Content-Type": "application/json",
          }
        });
        const json = await response.json();
        let pouringWithProductsDetails = Array.isArray(json) ? json : [];
        setPouringWithProductsDetails(pouringWithProductsDetails);
        return pouringWithProductsDetails;
       
      }

      const getSinglePouringData = async (id) =>{
        const response = await fetch(`${host}/api/pouring/fetchspecificpouringdata/${id}`, {
          method: "GET",
          headers: {
            "auth-token":localStorage.getItem('token'),
            "Content-Type": "application/json",
          }
        });
        const json = await response.json();
        let pouringDetails = Array.isArray(json) ? json : [];
        // setPouringDetails(pouringDetails);
        return pouringDetails;
      }
      
      const addPouringData = async (totalCompanies, totalProducts, records) => {
        
        const response = await fetch(`${host}/api/pouring/addpouringdata`, {
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
        getAllPouringData();
        return json;
      };

      const updatePouringData = async (id, totalCompanies, totalProducts, records) => {
        
        const response = await fetch(`${host}/api/pouring/updatepouringdata/${id}`, {
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
        getAllPouringData();
        return json;
      };
      
      const deletePouringMappingRecord = async (details_id, totalCompanies, totalProducts) =>{
        const response = await fetch(`${host}/api/pouring/deletepouringmapping`, {
          method: "DELETE",
          headers: {
            "auth-token":localStorage.getItem('token'),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ details_id, totalCompanies, totalProducts })
        });
        const json = await response.json();
        getAllPouringData();
      }

      const deletePouringData = async (id) =>{
        const response = await fetch(`${host}/api/pouring/deletepouringdata/${id}`, {
          method: "DELETE",
          headers: {
            "auth-token":localStorage.getItem('token'),
            "Content-Type": "application/json",
          },
        });
        const json = await response.json();
        getAllPouringData();        
      }

    return (
        <PouringContext.Provider value={{ pouringDetails, pouringWithProductsDetails, setPouringDetails, getAllPouringData, getAllPouringWithProductsData, getSinglePouringData, addPouringData, updatePouringData, deletePouringMappingRecord, deletePouringData}}>
            {props.children}
        </PouringContext.Provider>
    )
}
export default PouringState;