import { useEffect, useState } from "react";
import WebApp from "@twa-dev/sdk";
import { useNavigate } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";

function App() {
    useEffect(() => {
        WebApp.ready();
    }, []);

    const navigate = useNavigate();

    return (
        <div>
            <Header />

            <main className="bg-yellow-300 pt-8 flex flex-col justify-center items-center h-screen w-full">
                <img
                    src="https://picsum.photos/300/100"
                    alt=""
                    className="rounded-lg shadow-lg w-[300px] h-[120px] mx-auto"
                />
                {/* // country dropdown */}
                <section>
                    <select className="mt-4 p-2 rounded-lg w-[300px] bg-yellow-300 outline-black border-black outline outline-2">
                        <option value="1">India</option>
                        <option value="2">USA</option>
                        <option value="3">UK</option>
                    </select>
                </section>

                {/* Buttons */}

                <section className="flex flex-col gap-4 mt-4 items-center">
                    <div
                        onClick={() => navigate("/rewards")}
                        className="py-3 bg-[#37474F] min-w-[300px] text-center rounded-md text-white hover:text-black max-w-[300px]"
                    >
                        Available Events
                    </div>
                    <div className="py-3 bg-[#37474F] min-w-[300px] text-center rounded-md text-white hover:text-black max-w-[300px]">
                        Ongoing Events
                    </div>
                    <div className="py-3 bg-[#37474F] min-w-[300px] text-center rounded-md text-white hover:text-black max-w-[300px]">
                        Participated Events
                    </div>
                    <div className="py-3 bg-[#37474F] min-w-[300px] text-center rounded-md text-white hover:text-black max-w-[300px]">
                        Prize I Won
                    </div>
                    <div className="py-3 bg-[#37474F] min-w-[300px] text-center rounded-md text-white hover:text-black max-w-[300px]">
                        My Profile
                    </div>
                </section>

                <Footer />
            </main>
        </div>
    );
}

export default App;
