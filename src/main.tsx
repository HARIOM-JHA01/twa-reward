import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App"; // Changed from App.tsx to App
import WebApp from "@twa-dev/sdk";
import { BrowserRouter } from "react-router-dom";

const Root = () => {
    useEffect(() => {
        WebApp.ready();
    }, []);

    return (
        <BrowserRouter>
            <App />
        </BrowserRouter>
    );
};

createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Root />
    </React.StrictMode>
);
