import  { useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App"; // Changed from App.tsx to App
import WebApp from "@twa-dev/sdk";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from '../src/context/UserContext.js';
import {
    Profile,
    Privacy,
    Participated,
    Merchant,
    DrawEvent,
    RewardEvent,
    AvailableEvents,
    OngoingEvents,
    ParticipatedEvents,
    PrizeIWon
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
            <Route path="/available-rewards" element={<AvailableEvents />} />
            <Route path="/ongoing-rewards" element={<OngoingEvents />} />
            <Route path="/participated-rewards" element={<ParticipatedEvents />} />
            <Route path="/prize-i-won" element={<PrizeIWon />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/participated" element={<Participated />} />
            <Route path="/merchant" element={<Merchant />} />
            <Route path="/draw-event/:id" element={<DrawEvent />} />
            <Route path="/reward-event/:id" element={<RewardEvent />} />
        </Routes>
        </BrowserRouter>
    );
};

createRoot(document.getElementById("root")!).render(
        <UserProvider>
        <Root />
        </UserProvider>
);
