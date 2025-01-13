import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useEffect, useContext } from "react";
import WebApp from "@twa-dev/sdk";
import { UserContext } from '../context/UserContext.js';

export default function Profile() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [countryName, setCountryName] = useState("");
    const [error, setError] = useState("");
    const [telegramId, setTelegramId] = useState("");
    const [participantCode, setParticipantCode] = useState("");

    const userContext = useContext(UserContext);
    if (!userContext) {
        throw new Error("UserContext must be used within a UserProvider");
    }
    const { setUser } = userContext;

    useEffect(() => {
        const telegram_id = 'Fan_tai663';

        if (telegram_id) {
            fetch('https://bonusforyou.org/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    telegram_id: telegram_id,
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.status) {
                        const userData = data.data;
                        setFirstName(userData.name.split('_')[0]);
                        setLastName(userData.name.split('_')[1]);
                        setTelegramId(userData.telegram_id);
                        setCountryName(userData.country);
                        setParticipantCode(userData.unique_id);
                        setUser({
                            id: userData.id,
                            name: userData.name,
                            telegramId: userData.telegram_id,
                            country: userData.country,
                            uniqueId: userData.unique_id,
                        });
                    } else {
                        setError('Failed to fetch user data.');
                    }
                })
                .catch(() => {
                    setError('Failed to fetch user data.');
                });
        } else {
            setError('Telegram ID not found.');
        }

        WebApp.BackButton.show();
        WebApp.BackButton.onClick(() => {
            window.history.back();
        });

        return () => {
            WebApp.BackButton.offClick(
                () => {
                    window.history.back();
                },
            );
        };
    }, []);

    return (
        <div className="bg-yellow-300">
            <Header />
            <main className="bg-yellow-300 pt-8 flex flex-col items-center h-[80vh] w-full">
                {error ? (
                    <h1 className="text-red-600 font-bold">{error}</h1>
                ) : (
                    <>
                        <div className="flex flex-col gap-4 w-[90%] max-w-md bg-yellow-300 p-4 rounded-lg shadow-md">
                            <label className="font-semibold text-xl text-black">First Name</label>
                            <input
                                type="text"
                                value={firstName || ''}
                                className="bg-white border border-gray-300 rounded px-4 py-2 text-black"
                                placeholder="First Name"
                                readOnly
                            />
                            <label className="font-semibold text-xl text-black">Last Name</label>
                            <input
                                type="text"
                                value={lastName || ''}
                                className="bg-white border border-gray-300 rounded px-4 py-2 text-black"
                                placeholder="Last Name"
                                readOnly
                            />
                            <label className="font-semibold text-xl text-black">Telegram ID</label>
                            <input
                                type="text"
                                value={telegramId}
                                className="bg-white border border-gray-300 rounded px-4 py-2 text-black"
                                placeholder="Telegram ID"
                                readOnly
                            />
                            <label className="font-semibold text-xl text-black">Country</label>
                            <input
                                type="text"
                                value={countryName || ''}
                                className="bg-white border border-gray-300 rounded px-4 py-2 text-black"
                                placeholder="Country"
                                readOnly
                            />
                            <label className="font-semibold text-xl text-black">Participant Code</label>
                            <input
                                type="text"
                                value={participantCode || ''}
                                className="bg-white border border-gray-300 rounded px-4 py-2 text-black"
                                placeholder="Participant Code"
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
