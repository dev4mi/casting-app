import React from "react";
import ProductPartsContext from "./ProductPartsContext";
import { useState } from "react";
const ProductPartsState = (props) => {
  const host = "http://localhost:5000";
    const productpartsInitial = [];
      const [productParts, setProductParts]= useState(productpartsInitial);
      const [currProductParts, setCurrProductParts]= useState([]);
      const getAllProductParts = async () =>{
          const response = await fetch(`${host}/api/productparts/fetchallproductparts`, {
            method: "GET",
            headers: {
            //   "auth-token":localStorage.getItem('token'),
              "Content-Type": "application/json",
            }
          });
          const json = await response.json();
          // console.log(json);
          setProductParts(json);
      }
      const getProductParts = async (id) =>{
        const response = await fetch(`${host}/api/productparts/fetchproductparts/${id}`, {
          method: "GET",
          headers: {
          //   "auth-token":localStorage.getItem('token'),
            "Content-Type": "application/json",
          }
        });
        const json = await response.json();
        // console.log(json);
        setCurrProductParts(json);
        return json;
    }
   
      const addProductParts = async (product_id, part_id, part_quantity) => {
        // const formData = new FormData();
        
        // // Append all the form data fields
        // formData.append('product_id', product_id);
        // formData.append('part_id', part_id);
        // formData.append('part_quantity', part_quantity);
       
        const response = await fetch(`${host}/api/productparts/addproductparts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ product_id, part_id, part_quantity })
          // body:formData,
        });
      
        if (!response.ok) {
          const errorData = await response.json();
          const error = new Error('Request failed');
          error.response = { data: errorData };
          throw error;
      
        }
        const json = await response.json();
        setProductParts(productParts.concat(json.productParts));
        return json;
      };
      
      const deleteProductParts = async (id) =>{
        const response = await fetch(`${host}/api/productparts/deleteproductparts/${id}`, {
          method: "DELETE",
          headers: {
            // "auth-token":localStorage.getItem('token'),
            "Content-Type": "application/json",
          },
        });
        const json = await response.json();
        const newProductParts = productParts.filter((productParts)=>{return productParts._id!==id})
        setProductParts(newProductParts);
      }
      const updateProductParts = async (id, product_id, part_id, part_quantity) =>{
        // const formData = new FormData();

        // // Append all the form data fields
        // formData.append('product_id', product_id);
        // formData.append('part_id', part_id);
        // formData.append('part_quantity', part_quantity);

        const response = await fetch(`${host}/api/productparts/updateproductparts/${id}`, {
          method: "PUT",
          headers: {
            // "auth-token":localStorage.getItem('token'),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ product_id, part_id, part_quantity }),
          // body: formData,
        });
        const json = await response.json();
        let newProductParts = JSON.parse(JSON.stringify(productParts));
        for (let index = 0; index < newProductParts.length; index++) {
          const element = newProductParts[index];
          if(element._id == id){
            newProductParts[index].product_id = product_id;
            newProductParts[index].part_id = part_id;
            newProductParts[index].part_quantity = part_quantity;
            setProductParts(newProductParts);
            break;
          }
        }
      }
    return (
        <ProductPartsContext.Provider value={{ productParts, setProductParts, getAllProductParts, addProductParts, updateProductParts, deleteProductParts, getProductParts }}>
            {props.children}
        </ProductPartsContext.Provider>
    )
}
export default ProductPartsState;