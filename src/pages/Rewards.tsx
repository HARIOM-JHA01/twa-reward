import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";

export default function Rewards() {
    const [activeTab, setActiveTab] = useState("available");

    return (
        <div className="bg-yellow-300">
            <Header />
            <main className="bg-yellow-300 pt-8 flex flex-col items-center h-[80vh] w-full">
                {/* 2 tabs*/}
                <section>
                    <div className="flex justify-center gap-4">
                        <div
                            className={`py-2 px-4 rounded-md cursor-pointer ${activeTab === "available" ? "bg-yellow-600 text-white" : "bg-[#37474F] text-white"}`}
                            onClick={() => setActiveTab("available")}
                        >
                            Available Events
                        </div>
                        <div
                            className={`py-2 px-4 rounded-md cursor-pointer ${activeTab === "ongoing" ? "bg-yellow-600 text-white" : "bg-[#37474F] text-white"}`}
                            onClick={() => setActiveTab("ongoing")}
                        >
                            Ongoing Events
                        </div>
                    </div>
                </section>
                {/* Sample data based on active tab */}
                <section className="mt-8">
                    {activeTab === "available" && (
                        <div className="p-4 bg-white rounded-md shadow-md">
                            <h2 className="text-xl font-bold">Available Events</h2>
                            <p>Here are some available events...</p>
                        </div>
                    )}
                    {activeTab === "ongoing" && (
                        <div className="p-4 bg-white rounded-md shadow-md">
                            <h2 className="text-xl font-bold">Ongoing Events</h2>
                            <p>Here are some ongoing events...</p>
                        </div>
                    )}
                </section>
            </main>
            <Footer />
        </div>
    );
}