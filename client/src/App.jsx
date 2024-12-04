import React, { Children, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/auth";
import Chat from "./pages/chat";
import Profile from "./pages/profile";
import { useAppStore } from "./store";
import { GET_USER_INFO } from "./utils/constants";
import { apiClient } from "./lib/api.client";


//if profileSeup is not complete then user should be redirected to profile page and cannot go to chat page

//the state gets lost whenever the browser is refreshed so whenever the component is reloaded we need to fetch the userinfo from the server so we will send the jwt token and we will check if jwt token is valid ,if it is valid we will get the data from it and send it to user and if it is expired or there is no jwt token then it should be redirected to auth page and not work

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
  //we will check userinfo , if it is not undefined it will set isAuthenticated to true and then it will return the children or whatever the page is trying to render
};

const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" /> : children;
};

const App = () => {
const {userInfo, setUserInfo} = useAppStore();
const [loading, setLoading] = useState(true)

useEffect(() => {
  const getUserData = async ()=>{
    try {
      const res= await apiClient.get(GET_USER_INFO, 
        {withCredentials: true });
      
      if(res.status===200 && res.data.id){
        setUserInfo(res.data);
      }
      else{
        setUserInfo(undefined)
      }
      console.log({res});
    } catch (error) {
      console.log({error});
      setUserInfo(undefined);
    }finally{
      setLoading(false);
    }

  }
  if(!userInfo){
    getUserData();
  }
  else{
    setLoading(false);
  }
}, [userInfo,setUserInfo]);

if(loading){
  return <div>Loading....</div>
}


  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={
            <AuthRoute>
              <Auth />
            </AuthRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
