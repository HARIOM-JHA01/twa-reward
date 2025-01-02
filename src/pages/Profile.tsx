import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import WebApp from "@twa-dev/sdk";

export default function Profile() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [country, setCountry] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        let data = WebApp.initDataUnsafe;
        setFirstName(data?.user?.first_name || "First");
        setLastName(data?.user?.last_name || "Last");
        setEmail(data?.user?.email || "email@example.com");
        setCountry(data?.user?.country || "IN");
        // fetch('https://ipapi.co/json/')
        //     .then((response) => response.json())
        //     .then((data) => {
        //         if (data && data.country_name) {
        //             setCountry(data.country_code);
        //         } else {
        //             setError('Could not determine your country.');
        //         }
        //     })
        //     .catch(() => {
        //         setError('Failed to fetch country information.');
        //     });

        // Show the Back Button
        WebApp.BackButton.show();

        // Set Back Button click event
        WebApp.BackButton.onClick(() => {
            // Handle back navigation or close WebApp
            // go back in history
            window.history.back();
            // WebApp.close(); 

        });

        // Clean up Back Button listener on component unmount
        return () => {
            // WebApp.BackButton.offClick();
        };
    }, []);

    const getFormattedCode = () => {
        if (country && firstName && lastName) {
            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            return `${country}-${year}${month}-${firstName}${lastName}`;
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
                            <input
                                type="text"
                                value={firstName}
                                className="bg-white border border-gray-300 rounded px-4 py-2 text-black"
                                placeholder="First Name"
                                readOnly
                            />
                            <input
                                type="text"
                                value={lastName}
                                className="bg-white border border-gray-300 rounded px-4 py-2 text-black"
                                placeholder="Last Name"
                                readOnly
                            />
                            <input
                                type="email"
                                value={email}
                                className="bg-white border border-gray-300 rounded px-4 py-2 text-black"
                                placeholder="Email"
                                readOnly
                            />
                            <input
                                type="text"
                                value={country}
                                className="bg-white border border-gray-300 rounded px-4 py-2 text-black"
                                placeholder="Country"
                                readOnly
                            />
                            <input
                                type="text"
                                value={getFormattedCode()}
                                className="bg-white border border-gray-300 rounded px-4 py-2 text-black"
                                placeholder="Unique Code"
                                readOnly
                            />
                            <button
                                className="bg-gray-800 text-white font-bold py-2 rounded"
                                onClick={() => WebApp.showAlert("Profile Updated")}
                            >
                                Change Profile
                            </button>
                        </div>
                    </>
                )}
            </main>
            <Footer />
        </div>
    );
}