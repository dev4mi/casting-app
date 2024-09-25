import React from "react";
import CompanyContext from "./CompanyContext";
import { useState } from "react";
const CompanyState = (props) => {
  const host = "http://localhost:5000";
    const companiesInitial = [];
      const [companies, setCompanies]= useState(companiesInitial);
      const [companiesWithProducts, setCompaniesWithProducts]= useState(companiesInitial);
      const getAllCompanies = async () =>{
          const response = await fetch(`${host}/api/companies/fetchallcompanies`, {
            method: "GET",
            headers: {
              "auth-token":localStorage.getItem('token'),
              "Content-Type": "application/json",
            }
          });
          const json = await response.json();
          // console.log(json);
          setCompanies(json);
      }
   
      const getAllCompaniesWithProducts = async () =>{
        const response = await fetch(`${host}/api/companies/fetchallcompanieswithproducts`, {
          method: "GET",
          headers: {
            "auth-token":localStorage.getItem('token'),
            "Content-Type": "application/json",
          }
        });
        const json = await response.json();
        setCompaniesWithProducts(json);
      }
      
      const addCompany = async (name, products) => {
        
        const response = await fetch(`${host}/api/companies/addcompanywithproducts`, {
          method: 'POST',
          headers: {
            "auth-token":localStorage.getItem('token'),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, products })
        });
      
        if (!response.ok) {
          const errorData = await response.json();
          const error = new Error('Request failed');
          error.response = { data: errorData };
          throw error;
      
        }
        const json = await response.json();
        setCompanies(companies.concat(json.company));
        getAllCompaniesWithProducts();
        return json;
      };
      
      const deleteCompany = async (id) =>{
        const response = await fetch(`${host}/api/companies/deletecompany/${id}`, {
          method: "DELETE",
          headers: {
            "auth-token":localStorage.getItem('token'),
            "Content-Type": "application/json",
          },
        });
        const json = await response.json();
        const newCompanies = companies.filter((company)=>{return company.id!==id})
        setCompanies(newCompanies);
        getAllCompaniesWithProducts();
      }
      const updateCompany = async (id, name, products) =>{
        
        const response = await fetch(`${host}/api/companies/updatecompanywithproducts/${id}`, {
          method: "PUT",
          headers: {
            "auth-token":localStorage.getItem('token'),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, products }),
        });
        const json = await response.json();
        if(json.success){
          let newCompanies = JSON.parse(JSON.stringify(products));
          for (let index = 0; index < newCompanies.length; index++) {
            const element = newCompanies[index];
            if(element.id == id){
              newCompanies[index].name = name;
              setCompanies(newCompanies);
              break;
            }
          }
          getAllCompaniesWithProducts();
        }
        return json;
      }   
    return (
        <CompanyContext.Provider value={{ companies, setCompanies, companiesWithProducts, setCompaniesWithProducts, getAllCompaniesWithProducts, getAllCompanies, addCompany, updateCompany, deleteCompany }}>
            {props.children}
        </CompanyContext.Provider>
    )
}
export default CompanyState;