import { useEffect, useState } from "react";
import WebApp from "@twa-dev/sdk";

import "./App.css";

function App() {
    useEffect(() => {
        WebApp.ready();
    }, []);

    return (
        <div>
            <header className="flex justify-between items-center pt-3 pl-3 pr-2 bg-[#37474F] pb-3">
                <img
                    src="./bonus-logo.png"
                    alt=""
                    width={"30px"}
                    height={"30px"}
                />
                <h1 className="text-white">Bonus For You</h1>
                <div className="flex gap-2">
                    <img
                        src="./hnkf.png"
                        alt=""
                        width={"30px"}
                        height={"30px"}
                    />
                    <img
                        src="./privacy.png"
                        alt=""
                        width={"30px"}
                        height={"30px"}
                    />
                </div>
            </header>

            <main className="bg-yellow-300 pt-8 flex flex-col justify-center items-center">
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
                    <div className="py-3 bg-[#37474F] min-w-[300px] text-center rounded-md text-white hover:text-black max-w-[300px]">
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

                <section className="flex flex-col gap-4 mt-4 items-center pb-5">
                    <img
                        src="https://picsum.photos/300/100"
                        alt=""
                        className="rounded-lg shadow-lg w-[300px] h-[120px] mx-auto"
                    />
                </section>
            </main>
        </div>
    );
}

export default App;
