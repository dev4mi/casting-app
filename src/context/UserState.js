import React from "react";
import UserContext from "./UserContext";
import { useState } from "react";
const UserState = (props) => {
  const host = "http://localhost:5000";
    const usersInitial = [];
      const [users, setUsers]= useState(usersInitial);
    //   const getAllNotes = async () =>{
    //       const response = await fetch(`${host}/api/notes/fetchallnotes`, {
    //         method: "GET",
    //         headers: {
    //           "auth-token":localStorage.getItem('token'),
    //           "Content-Type": "application/json",
    //         }
    //       });
    //       const json = await response.json();
    //       // console.log(json);
    //       setNotes(json);
    //   }
      const addUser = async (name, lastname, email, contact_number, role_id) =>{
          const response = await fetch(`${host}/api/users/adduser`, {
            method: "POST",
            headers: {
            //   "auth-token":localStorage.getItem('token'),
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, lastname, email, contact_number, role_id }),
          });
          const json = await response.json();
          setNotes(users.concat(json));
      }
    //   const deleteNote = async (id) =>{
    //     const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
    //       method: "DELETE",
    //       headers: {
    //         "auth-token":localStorage.getItem('token'),
    //         "Content-Type": "application/json",
    //       },
    //     });
    //     const json = await response.json();
    //     const newNotes = notes.filter((note)=>{return note._id!==id})
    //     setNotes(newNotes);
    //   }
    //   const editNote = async (id, title, description, tag) =>{
        
    //     const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
    //       method: "PUT",
    //       headers: {
    //         "auth-token":localStorage.getItem('token'),
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({ title,description,tag }),
    //     });
    //     const json = await response.json();
    //     let newNotes = JSON.parse(JSON.stringify(notes));
    //     for (let index = 0; index < newNotes.length; index++) {
    //       const element = newNotes[index];
    //       if(element._id == id){
    //         newNotes[index].title = title;
    //         newNotes[index].description = description;
    //         newNotes[index].tag = tag;
    //         setNotes(newNotes);
    //         break;
    //       }
    //     }
    //   }
    return (
        <UserContext.Provider value={{addUser}}>
            {props.children}
        </UserContext.Provider>
    )
}
export default UserState;