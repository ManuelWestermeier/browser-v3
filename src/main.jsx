import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import "./index.css";
import { TabsProvider } from "./provider/tabs";

ReactDOM.createRoot(document.getElementById("root")).render(
  <TabsProvider>
    <App />
  </TabsProvider>
);
