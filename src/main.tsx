import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App"; // Changed from App.tsx to App
import WebApp from "@twa-dev/sdk";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Rewards from "./pages/Rewards";

const Root = () => {
    useEffect(() => {
        WebApp.ready();
    }, []);

    return (
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/rewards" element={<Rewards />} />
        </Routes>
        </BrowserRouter>
    );
};

createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Root />
    </React.StrictMode>
);
