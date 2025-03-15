import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthContextProvider } from "./contexts/AuthContext";
import { CampaignContextProvider } from "./contexts/CampaignContext";
import { NotificationContextProvider } from "./contexts/NotificationContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <AuthContextProvider>
    <NotificationContextProvider>
      <CampaignContextProvider>
        <App />
      </CampaignContextProvider>
    </NotificationContextProvider>
  </AuthContextProvider>
  // </React.StrictMode>
);
