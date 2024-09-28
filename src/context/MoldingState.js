import React from "react";
import MoldingContext from "./MoldingContext";
import { useState } from "react";
const MoldingState = (props) => {
  const host = "http://localhost:5000";
    const moldingInitial = [];
      const [moldingDetails, setMoldingDetails]= useState(moldingInitial);
      const [moldingWithProductsDetails, setMoldingWithProductsDetails]= useState(moldingInitial);
  
      const getAllMoldingData = async (id = 0) =>{
        let url=`${host}/api/molding/fetchallmoldingdata`;

        if(id!=0){
          url=`${host}/api/molding/fetchallmoldingdata?id=`+id;
        }
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "auth-token":localStorage.getItem('token'),
            "Content-Type": "application/json",
          }
        });
        const json = await response.json();
        let moldingDetails = Array.isArray(json) ? json : [];
        setMoldingDetails(moldingDetails);
        return json;
       
      }
      const getAllMoldingWithProductsData = async () =>{
        const response = await fetch(`${host}/api/molding/fetchallmoldingwithproducts`, {
          method: "GET",
          headers: {
            "auth-token":localStorage.getItem('token'),
            "Content-Type": "application/json",
          }
        });
        const json = await response.json();
        let moldingWithProductsDetails = Array.isArray(json) ? json : [];
        setMoldingWithProductsDetails(moldingWithProductsDetails);
        return moldingWithProductsDetails;
       
      }

      const getSingleMoldingData = async (id) =>{
        const response = await fetch(`${host}/api/molding/fetchspecificmoldingdata/${id}`, {
          method: "GET",
          headers: {
            "auth-token":localStorage.getItem('token'),
            "Content-Type": "application/json",
          }
        });
        const json = await response.json();
        let moldingDetails = Array.isArray(json) ? json : [];
        // setMoldingDetails(moldingDetails);
        return moldingDetails;
      }
      
      const addMoldingData = async (totalCompanies, totalProducts, records) => {
        
        const response = await fetch(`${host}/api/molding/addmoldingdata`, {
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
        getAllMoldingData();
        return json;
      };

      const updateMoldingData = async (id, totalCompanies, totalProducts, records) => {
        
        const response = await fetch(`${host}/api/molding/updatemoldingdata/${id}`, {
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
        getAllMoldingData();
        return json;
      };
      
      const deleteMoldingMappingRecord = async (unique_number, company_id, product_id) =>{
        const response = await fetch(`${host}/api/molding/deletemoldingmapping`, {
          method: "DELETE",
          headers: {
            "auth-token":localStorage.getItem('token'),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ unique_number, company_id, product_id })
        });
        const json = await response.json();
        getAllMoldingData();
      }

      const deleteMoldingData = async (id) =>{
        const response = await fetch(`${host}/api/molding/deletemoldingdata/${id}`, {
          method: "DELETE",
          headers: {
            "auth-token":localStorage.getItem('token'),
            "Content-Type": "application/json",
          },
        });
        const json = await response.json();
        getAllMoldingData();        
      }

    //   const updateMolding = async (id, name, products) =>{
        
    //     const response = await fetch(`${host}/api/molding/updatecompanywithproducts/${id}`, {
    //       method: "PUT",
    //       headers: {
    //         "auth-token":localStorage.getItem('token'),
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({ name, products }),
    //     });
    //     const json = await response.json();
    //     if(json.success){
    //       let newCompanies = JSON.parse(JSON.stringify(products));
    //       for (let index = 0; index < newCompanies.length; index++) {
    //         const element = newCompanies[index];
    //         if(element.id == id){
    //           newCompanies[index].name = name;
    //           setCompanies(newCompanies);
    //           break;
    //         }
    //       }
    //       getAllCompaniesWithProducts();
    //     }
    //     return json;
    //   }   
    return (
        <MoldingContext.Provider value={{ moldingDetails, moldingWithProductsDetails, setMoldingDetails, getAllMoldingData, getAllMoldingWithProductsData, getSingleMoldingData, addMoldingData, updateMoldingData, deleteMoldingMappingRecord, deleteMoldingData}}>
            {props.children}
        </MoldingContext.Provider>
    )
}
export default MoldingState;