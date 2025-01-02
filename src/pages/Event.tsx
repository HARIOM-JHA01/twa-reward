import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import WebApp from "@twa-dev/sdk";
export default function Event() {

    useEffect(() => {
            WebApp.BackButton.show();
    
            WebApp.BackButton.onClick(() => {
                window.history.back();
                // WebApp.close();
            });
        }, []);

    const router = useNavigate();
    return (
        <div className="bg-yellow-300">
            <Header />
            <main className="bg-yellow-300 pt-8 flex flex-col w-full min-h-screen p-4">
                <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">Event</h1>
                <p className="text-lg text-gray-800 mb-4 text-center">Event Content</p>
                <Footer />
            </main>
        </div>
    );
}