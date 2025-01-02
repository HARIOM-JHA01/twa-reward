import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Rewards() {
    const [activeTab, setActiveTab] = useState("available");
    const router = useNavigate();
    return (
        <div className="bg-yellow-300">
            <Header />
            <main className="bg-yellow-300 pt-8 px-4 flex flex-col min-h-[70vh] w-full">
                {/* 2 tabs*/}
                <section>
                    <div className="flex justify-center gap-4">
                        <div
                            className={`py-2 px-4 rounded-md cursor-pointer ${activeTab === "available" ? "bg-yellow-600 text-white" : "bg-[#37474F] text-white"}`}
                            onClick={() => setActiveTab("available")}
                        >
                            Bonus For You
                        </div>
                        <div
                            className={`py-2 px-4 rounded-md cursor-pointer ${activeTab === "ongoing" ? "bg-yellow-600 text-white" : "bg-[#37474F] text-white"}`}
                            onClick={() => setActiveTab("ongoing")}
                        >
                            Rewards
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
                        <div className=" bg-white rounded-md shadow-md">
                            <Card />
                        </div>
                    )}
                    
                </section>
            </main>
            <Footer />
        </div>
    );
}

export const Card = () => {
    const router = useNavigate();
    return (
        <div className="flex gap-4 flex-col"
        onClick={() => router("/event")}
        >
                <img src="https://picsum.photos/100" alt="" className="w-full h-48 object-cover rounded-md" />
                <div className="flex justify-between">
                    <h2>Start Date: 2024-01-01</h2>
                    <h2>End Date: 2025-12-31</h2>
                </div>
        </div>
    )
}