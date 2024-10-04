import React from "react";
import ProductContext from "./ProductContext";
import { useState } from "react";
const ProductState = (props) => {
  const host = process.env.REACT_APP_HOST_URL;
    const productsInitial = [];
      const [products, setProducts]= useState(productsInitial);
      const getAllProducts = async () =>{
          const response = await fetch(`${host}/api/products/fetchallproducts`, {
            method: "GET",
            headers: {
              "auth-token":localStorage.getItem('token'),
              "Content-Type": "application/json",
            }
          });
          const json = await response.json();
          // console.log(json);
          setProducts(json);
      }
   
      const addProduct = async (name) => {

        const response = await fetch(`${host}/api/products/addproduct`, {
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
        setProducts(products.concat(json.product));
        return json;
      };
      
      const deleteProduct = async (id) =>{
        const response = await fetch(`${host}/api/products/deleteproduct/${id}`, {
          method: "DELETE",
          headers: {
            "auth-token":localStorage.getItem('token'),
            "Content-Type": "application/json",
          },
        });
        const json = await response.json();
        const newProducts = products.filter((product)=>{return product.id!==id})
        setProducts(newProducts);
      }

      const updateProduct = async (id, name) =>{
     
        const response = await fetch(`${host}/api/products/updateproduct/${id}`, {
          method: "PUT",
          headers: {
            "auth-token":localStorage.getItem('token'),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name }),
          
        });
        const json = await response.json();
        let newProducts = JSON.parse(JSON.stringify(products));
        for (let index = 0; index < newProducts.length; index++) {
          const element = newProducts[index];
          if(element._id == id){
            newProducts[index].name = name;
            setProducts(newProducts);
            break;
          }
        }
      }
    return (
        <ProductContext.Provider value={{ products, setProducts, getAllProducts, addProduct, updateProduct, deleteProduct }}>
            {props.children}
        </ProductContext.Provider>
    )
}
export default ProductState;