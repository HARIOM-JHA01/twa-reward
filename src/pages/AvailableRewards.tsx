import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import WebApp from "@twa-dev/sdk";

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

interface Draw {
    id: number;
    poster_id: number;
    draw_name: string;
    draw_image: string;
    country: string;
    start_date: string;
    end_date: string;
    draw_detail: string;
    status: string;
    draw_status: number;
    verifiaction_link_0: string;
    repeat: string;
    max_user: number;
    join_user: number;
    prize_detail_link: string | null;
    draw_detail_link: string | null;
    created_at: string;
    updated_at: string;
}

export default function AvailableRewards() {
    const [activeTab, setActiveTab] = useState("available");
    const [rewards, setRewards] = useState<Reward[]>([]);
    const [draws, setDraws] = useState<Draw[]>([]);
    const userContext = useContext(UserContext);
    const user = userContext?.user || { id: 72 }; // Default user ID

    useEffect(() => {
        if (activeTab === "available") {
            fetch(`https://bonusforyou.org/api/user/drawlist?user_id=${user.id}`)
                .then(response => response.json())
                .then(data => setDraws(data.data))
                .catch(error => console.error("Error fetching draws:", error));
        } else {
            fetch(`https://bonusforyou.org/api/user/rewarddrawlist?user_id=${user.id}`)
                .then(response => response.json())
                .then(data => setRewards(data.data))
                .catch(error => console.error("Error fetching rewards:", error));
        }

        WebApp.BackButton.show();
        
                // Set Back Button click event
                WebApp.BackButton.onClick(() => {
                    window.history.back();
                    // WebApp.close();
                });
    }, [activeTab, user.id]);

    return (
        <div className="bg-yellow-300">
            <Header />
            <main className="bg-yellow-300 pt-8 px-4 flex flex-col min-h-[70vh] w-full">
                <section>
                    <div className="flex justify-center gap-4">
                        <div
                            className={`py-2 px-4 rounded-md cursor-pointer ${activeTab === "available" ? " text-black" : "bg-yellow-600 text-white"}`}
                            onClick={() => setActiveTab("available")}
                        >
                            BonusForYou
                        </div>
                        <div
                            className={`py-2 px-4 rounded-md cursor-pointer ${activeTab === "ongoing" ? " text-black" : " bg-yellow-600 text-white"}`}
                            onClick={() => setActiveTab("ongoing")}
                        >
                            Rewards
                        </div>
                    </div>
                </section>
                <section className="mt-8">
                    {activeTab === "available" && (
                        <div className="p-2  rounded-md shadow-md">
                            {draws.map(draw => (
                                <DrawCard key={draw.id} draw={draw} />
                            ))}
                        </div>
                    )}
                    {activeTab === "ongoing" && (
                        <div className="p-2  rounded-md shadow-md">
                            {rewards.map(reward => (
                                <RewardCard key={reward.id} reward={reward} />
                            ))}
                        </div>
                    )}
                </section>
            </main>
            <Footer />
        </div>
    );
}

interface RewardCardProps {
    reward: Reward;
}

export const RewardCard: React.FC<RewardCardProps> = ({ reward }) => {
    const navigate = useNavigate();
    return (
        <div className="flex gap-1 flex-col border-2 border-black rounded-lg mb-2" onClick={() => navigate(`/reward-event/${reward.id}`)}>
            <h2 className="text-black px-1">{reward.reward_name}</h2>
            <img src={reward.reward_image} alt={reward.reward_name} className="w-full h-full object-cover rounded-lg p-1" />
            <div className="flex justify-between">
                <h2 className="text-black px-1">Start Date: {new Date(reward.start_date).toLocaleDateString()}</h2>
                <h2 className="text-black px-1">End Date: {new Date(reward.end_date).toLocaleDateString()}</h2>

            </div>
        </div>
    );
};

interface DrawCardProps {
    draw: Draw;
}

export const DrawCard: React.FC<DrawCardProps> = ({ draw }) => {
    const navigate = useNavigate();
    return (
        <div className="flex gap-1 flex-col border-2 border-black rounded-lg mb-2" onClick={() => navigate(`/draw-event/${draw.id}`)}>
            <h2 className="text-black px-1">{draw.draw_name}</h2>
            <img src={draw.draw_image} alt={draw.draw_name} className="w-full h-full object-cover rounded-lg p-1" />
            <div className="flex justify-between">
            <h2 className="text-black px-1">Start Date: {new Date(draw.start_date).toLocaleDateString()}</h2>
            <h2 className="text-black px-1">End Date: {new Date(draw.end_date).toLocaleDateString()}</h2>
            </div>
        </div>
    );
};
