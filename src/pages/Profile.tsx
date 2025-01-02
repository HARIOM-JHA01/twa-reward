import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import WebApp from "@twa-dev/sdk";

export default function Profile() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [id, setId] = useState(0);
    const [countryName, setCountryName] = useState("");
    const [countryCode, setCountryCode] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        let data = WebApp.initDataUnsafe;
        setFirstName(data?.user?.first_name || "First");
        setLastName(data?.user?.last_name || "Last");
        setId(data?.user?.id || 12345678);
        fetch('https://ipapi.co/json/')
            .then((response) => response.json())
            .then((data) => {
                if (data && data.country_name) {
                    setCountryName(data.country_name);
                    setCountryCode(data.country_code);
                } else {
                    setError('Could not determine your country.');
                }
            })
            .catch(() => {
                setError('Failed to fetch country information.');
            });

        // Show the Back Button
        WebApp.BackButton.show();

        // Set Back Button click event
        WebApp.BackButton.onClick(() => {
            window.history.back();
            // WebApp.close(); 

        });

        // Clean up Back Button listener on component unmount
        return () => {
            // WebApp.BackButton.offClick();
        };
    }, []);

    const getFormattedCode = () => {
        if (countryName && firstName && lastName) {
            //generate 6 digit code alphabet in capital letters
            let randomCode = Array.from({ length: 6 }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join('');
            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            return `${countryCode}-${year}${month}-${randomCode}`;
        }
        return `${firstName}${lastName}`;
    };



    return (
        <div className="bg-yellow-300">
            <Header />
            <main className="bg-yellow-300 pt-8 flex flex-col items-center h-[80vh] w-full">
                {error ? (
                    <h1 className="text-red-600 font-bold">{error}</h1>
                ) : (
                    <>
                        <div className="flex flex-col gap-4 w-[90%] max-w-md bg-yellow-300 p-4 rounded-lg shadow-md">
                            <label htmlFor=""
                                className="font-semibold text-xl "
                            >First Name</label>
                            <input
                                type="text"
                                value={firstName}
                                className="bg-white border border-gray-300 rounded px-4 py-2 text-black"
                                placeholder="First Name"
                                readOnly
                            />
                            <label htmlFor="" className="font-semibold text-xl ">Last Name</label>
                            <input
                                type="text"
                                value={lastName}
                                className="bg-white border border-gray-300 rounded px-4 py-2 text-black"
                                placeholder="Last Name"
                                readOnly
                            />
                            <label htmlFor="" className="font-semibold text-xl ">Telegram ID</label>
                            <input
                                type="id"
                                value={id}
                                className="bg-white border border-gray-300 rounded px-4 py-2 text-black"
                                placeholder="id"
                                readOnly
                            />
                            <label htmlFor="" className="font-semibold text-xl ">Country</label>
                            <input
                                type="text"
                                value={countryName}
                                className="bg-white border border-gray-300 rounded px-4 py-2 text-black"
                                placeholder="Country"
                                readOnly
                            />
                            <label htmlFor="" className="font-semibold text-xl ">Participant Code</label>
                            <input
                                type="text"
                                value={getFormattedCode()}
                                className="bg-white border border-gray-300 rounded px-4 py-2 text-black"
                                placeholder="Unique Code"
                                readOnly
                            />
                        </div>
                    </>
                )}
            </main>
            <Footer />
        </div>
    );
}