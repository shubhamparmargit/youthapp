import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./fonts.css";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AuthProvider from "./contexts/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GoogleOAuthProvider client_id="579645393871-bmblj414f03jm3hrmufmdgfg0771urvr.apps.googleusercontent.com">
      <AuthProvider>
        <App />
      </AuthProvider>
  </GoogleOAuthProvider>
);
