import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useEffect, useContext } from "react";
import WebApp from "@twa-dev/sdk";
import { UserContext } from '../context/UserContext.js';

export default function Profile() {

    const [error, setError] = useState("");

    const userContext = useContext(UserContext);
    if (!userContext) {
        setError("UserContext must be used within a UserProvider");
        throw new Error("UserContext must be used within a UserProvider");
    }
    const { user, isLoggedIn } = userContext;


    useEffect(() => {
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
                        {isLoggedIn ?
                            <div className="flex flex-col gap-4 w-[90%] max-w-md bg-yellow-300 p-4 rounded-lg shadow-md">
                                <div className="flex flex-col">
                                    <label className="font-semibold text-xl text-black">First Name</label>
                                    <div className="border-black border-2 rounded px-4 py-2 text-black">
                                        {user.name.split('_')[0] || ''}
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <label className="font-semibold text-xl text-black">Last Name</label>
                                    <div className="border-black border-2 rounded px-4 py-2 text-black">
                                        {user.name.split('_')[1] || ''}
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <label className="font-semibold text-xl text-black">Telegram ID</label>
                                    <div className="border-black border-2 rounded px-4 py-2 text-black">
                                        {user.telegramId}
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <label className="font-semibold text-xl text-black">Country</label>
                                    <div className="border-black border-2 rounded px-4 py-2 text-black">
                                        {user.country || ''}
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <label className="font-semibold text-xl text-black">Participant Code</label>
                                    <div className="border-black border-2 rounded px-4 py-2 text-black">
                                        {user.uniqueId || ''}
                                    </div>
                                </div>
                            </div>
                            :
                            <div>Loading</div>
                        }
                    </>
                )}
            </main>
            <Footer />
        </div>
    );
}