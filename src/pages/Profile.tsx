import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import WebApp from "@twa-dev/sdk";

export default function Profile() {
    const [userName, setUserName] = useState("");
    const [country, setCountry] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        let data = WebApp.initDataUnsafe;
        setUserName(data?.user?.username || "ABCDE");

        fetch('https://ipapi.co/json/')
            .then((response) => response.json())
            .then((data) => {
                if (data && data.country_name) {
                    setCountry(data.country_code);
                } else {
                    setError('Could not determine your country.');
                }
            })
            .catch(() => {
                setError('Failed to fetch country information.');
            });
    }, []);

    const getFormattedCode = () => {
        if (country && userName) {
            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            return `${country}-${year}${month}-${userName}`;
        }
        return userName;
    };

    return (
        <div className="bg-yellow-300">
            <Header />
            <main className="bg-yellow-300 pt-8 flex flex-col items-center h-[80vh] w-full">
                {error ? <h1>{error}</h1> : <h1>{getFormattedCode()}</h1>}
            </main>
            <Footer />
        </div>
    );
}