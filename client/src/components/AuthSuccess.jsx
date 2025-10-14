import React from "react";
import { useEffect } from "react";
import {useNavigate} from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { getMe } from "../services/api";



export default function AuthSuccess(){

  const navigate = useNavigate(); 
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
          const token = params.get("token")
          
    if(token){
      localStorage.setItem("token",token)
      getMe()
        .then((data) => {
          if (data?.success && data?.data) {
            login(data.data, token);
            window.location.href = "/"; 
          } else {
            navigate("/auth");
          }
        })
        .catch(() => navigate("/auth"));
    }
    else {
      navigate("/auth")
    }
  }, [navigate, login]) 
  return <p> Logging In ....</p>
}