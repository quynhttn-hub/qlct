import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { ThemeProvider } from "@material-tailwind/react";
import { AuthContextProvider } from "./Context/AuthContext";
import  ChatProvider  from "./Context/ChatProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
    <ThemeProvider>
      <AuthContextProvider>
        <ChatProvider>
          <App />
        </ChatProvider>
      </AuthContextProvider>
    </ThemeProvider>
  // </React.StrictMode>
);
