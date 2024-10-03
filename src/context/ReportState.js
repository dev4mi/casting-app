import React from "react";
import ReportContext from "./ReportContext";
import { useState } from "react";
const ReportState = (props) => {
  const host = "http://localhost:5000";
    const moldingInitial = [], pouringInitial = [], dispatchInitial = [];
      const [moldingDetails, setMoldingDetails]= useState(moldingInitial);
      const [pouringDetails, setPouringDetails]= useState(pouringInitial);
      const [dispatchDetails, setDispatchDetails]= useState(dispatchInitial);
  
      const getAllMoldingData = async (start_date = null, end_date = null) =>{
        let url=`${host}/api/report/fetchallmoldingdata`;

        if(start_date!=null && end_date!=null){
          url=`${host}/api/report/fetchallmoldingdata?start_date=${start_date}&end_date=${end_date}`;
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

      const getAllPouringData = async (start_date = null, end_date = null) =>{
        let url=`${host}/api/report/fetchallpouringdata`;

        if(start_date!=null && end_date!=null){
          url=`${host}/api/report/fetchallpouringdata?start_date=${start_date}&end_date=${end_date}`;
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

      const getAllDispatchData = async (start_date = null, end_date = null) =>{
        let url=`${host}/api/report/fetchalldispatchdata`;

        if(start_date!=null && end_date!=null){
          url=`${host}/api/report/fetchalldispatchdata?start_date=${start_date}&end_date=${end_date}`;
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
    
    return (
        <ReportContext.Provider value={{ moldingDetails, getAllMoldingData, pouringDetails, getAllPouringData, dispatchDetails, getAllDispatchData}}>
            {props.children}
        </ReportContext.Provider>
    )
}
export default ReportState;