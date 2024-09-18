import React from "react";
import ProductContext from "./ProductContext";
import { useState } from "react";
const ProductState = (props) => {
  const host = "http://localhost:5000";
    const productsInitial = [];
      const [products, setProducts]= useState(productsInitial);
      const getAllProducts = async () =>{
          const response = await fetch(`${host}/api/products/fetchallproducts`, {
            method: "GET",
            headers: {
            //   "auth-token":localStorage.getItem('token'),
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
      
    //   const deleteUser = async (id) =>{
    //     const response = await fetch(`${host}/api/companies/deleteuser/${id}`, {
    //       method: "DELETE",
    //       headers: {
    //         // "auth-token":localStorage.getItem('token'),
    //         "Content-Type": "application/json",
    //       },
    //     });
    //     const json = await response.json();
    //     const newUsers = users.filter((user)=>{return user._id!==id})
    //     setUsers(newUsers);
    //   }
    //   const updateUser = async (id, name, lastname, email, contact_number, password, role_id, profile_pic) =>{
    //     const formData = new FormData();

    //     // Append all the form data fields
    //     formData.append('name', name);
    //     formData.append('lastname', lastname);
    //     formData.append('email', email);
    //     formData.append('contact_number', contact_number);
    //     formData.append('password', password);
    //     formData.append('role_id', role_id);

    //     // Append the file (profile_pic) if provided
    //     if (profile_pic) {
    //       formData.append('profile_pic', profile_pic);
    //     }
    //     const response = await fetch(`${host}/api/companies/updateuser/${id}`, {
    //       method: "PUT",
    //       headers: {
    //         // "auth-token":localStorage.getItem('token'),
    //         // "Content-Type": "application/json",
    //       },
    //       // body: JSON.stringify({ name, lastname, email, contact_number, password, role_id, profile_pic }),
    //       body: formData,
    //     });
    //     const json = await response.json();
    //     let newUsers = JSON.parse(JSON.stringify(users));
    //     for (let index = 0; index < newUsers.length; index++) {
    //       const element = newUsers[index];
    //       if(element._id == id){
    //         newUsers[index].name = name;
    //         newUsers[index].lastname = lastname;
    //         newUsers[index].email = email;
    //         newUsers[index].contact_number = contact_number;
    //         newUsers[index].role_id = role_id;
    //         newUsers[index].profile_pic = json.updateduser.profile_pic;
    //         setUsers(newUsers);
    //         break;
    //       }
    //     }
    //   }
    return (
        <ProductContext.Provider value={{ products, setProducts, getAllProducts, addProduct }}>
            {props.children}
        </ProductContext.Provider>
    )
}
export default ProductState;