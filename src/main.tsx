import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App"; // Changed from App.tsx to App
import WebApp from "@twa-dev/sdk";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
    Profile,
    Privacy,
    Rewards,
    Participated,
    Merchant,
    Event,
} from "./pages/index";
import './i18n'; // Import the i18n configuration
const Root = () => {
    useEffect(() => {
        WebApp.ready();
    }, []);

    return (
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/participated" element={<Participated />} />
            <Route path="/merchant" element={<Merchant />} />
            <Route path="/event" element={<Event />} />
        </Routes>
        </BrowserRouter>
    );
};

createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Root />
    </React.StrictMode>
);
