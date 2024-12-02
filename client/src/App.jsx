import React, { Children } from "react";
import { Button } from "@/components/ui/button";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/auth";
import Chat from "./pages/chat";
import Profile from "./pages/profile";
import { useAppStore } from "./store";

//if profileSeup is not complete then user should be redirected to profile page and cannot go to chat page

//the state gets lost whenever the browser is refreshed so whenever the component is reloaded we need to fetch the userinfo from the server so we will send the jwt token and we will check if jwt token is valid ,if it is valid we will get the data from it and send it to user and if it is expired or there is no jwt token then it should be redirected to auth page and not work

const PrivateRoute = ({ Children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? Children : <Navigate to="/auth" />;
  //we will check userinfo , if it is not undefined it will set isAuthenticated to true and then it will return the children or whatever the page is trying to render
};

const AuthRoute = ({ Children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" /> : Children;
};

const App = () => {
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
