import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

interface Reward {
    id: number;
    poster_id: number;
    reward_name: string;
    reward_image: string;
    country: string;
    start_date: string;
    end_date: string;
    reward_detail: string;
    status: string;
    reward_status: number;
    verifiaction_link_0: string;
    repeat: string;
    max_user: number;
    join_user: number;
    draw_detail_link: string | null;
    created_at: string;
    updated_at: string;
}

export default function Rewards() {
    const [activeTab, setActiveTab] = useState("available");
    const [rewards, setRewards] = useState<Reward[]>([]);
    const userContext = useContext(UserContext);
    const user = userContext?.user;

    useEffect(() => {
        if (user) {
            fetch(`https://bonusforyou.org/api/user/rewarddrawlist?user_id=72`)
                .then(response => response.json())
                .then(data => setRewards(data.data))
                .then(() => console.log("Rewards fetched successfully"))
                .catch(error => console.error("Error fetching rewards:", error));
        }
    }, []);

    return (
        <div className="bg-yellow-300">
            <Header />
            <main className="bg-yellow-300 pt-8 px-4 flex flex-col min-h-[70vh] w-full">
                {/* 2 tabs */}
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
                {/* Display rewards based on active tab */}
                <section className="mt-8">
                    {activeTab === "available" && (
                        <div className="p-4 bg-white rounded-md shadow-md">
                            <h2 className="text-xl font-bold text-center">Available Events</h2>
                            {rewards.map(reward => (
                                <Card key={reward.id} reward={reward} />
                            ))}
                        </div>
                    )}
                </section>
            </main>
            <Footer />
        </div>
    );
}

interface CardProps {
    reward: Reward;
}

export const Card: React.FC<CardProps> = ({ reward }) => {
    const navigate = useNavigate();
    return (
        <div className="flex gap-4 flex-col" onClick={() => navigate("/event")}>
            <h2 className="text-center">{reward.reward_name}</h2>
            <img src={reward.reward_image} alt={reward.reward_name} className="w-full h-40 object-cover rounded-lg p-4" />
            <div className="flex justify-between">
                <h2>Start Date: {reward.start_date}</h2>
                <h2>End Date: {reward.end_date}</h2>
            </div>
        </div>
    );
};
