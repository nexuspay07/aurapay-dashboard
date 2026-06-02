import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource/inter";

import App from "./App";

document.body.style.fontFamily =
  "Inter, sans-serif";

import { AuthProvider } from "./context/AuthContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import { SocketProvider } from "./realtime/SocketProvider";
import "./index.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
  <SocketProvider>
    <AuthProvider>
      <AdminAuthProvider>
        <App />
      </AdminAuthProvider>
    </AuthProvider>
  </SocketProvider>
</React.StrictMode>
);