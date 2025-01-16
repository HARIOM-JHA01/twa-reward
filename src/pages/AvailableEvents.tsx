import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import WebApp from "@twa-dev/sdk";

import { Draw, Reward } from "../types/type";

export default function AvailableEvents() {
    const [activeTab, setActiveTab] = useState<"available" | "ongoing">("available");
    const [rewards, setRewards] = useState<Reward[] | null>(null);
    const [draws, setDraws] = useState<Draw[] | null>(null);
    const userContext = useContext(UserContext);
    const user = userContext?.user;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRewardsAndDraws = async () => {
           
            try {
                  if (!user?.id) {
                    console.error("User ID not available, cannot fetch data");
                    return;
                }
                if (activeTab === "available") {
                    const response = await fetch(
                        `https://bonusforyou.org/api/user/drawlist?user_id=${user.id}`
                    );
                    if(!response.ok){
                      throw new Error(`Failed to fetch data with status: ${response.status}`);
                    }
                    const data = await response.json();
                    setDraws(data.data);
                    setRewards(null); //reset rewards if fetched successfully
                } else {
                    const response = await fetch(
                        `https://bonusforyou.org/api/user/rewarddrawlist?user_id=${user.id}`
                    );
                     if(!response.ok){
                        throw new Error(`Failed to fetch data with status: ${response.status}`);
                     }
                     const data = await response.json();
                     setRewards(data.data);
                     setDraws(null) //reset draws if fetched successfully
                }
            }
             catch (error) {
                console.error("Error fetching data:", error);
                 setDraws(null);
                 setRewards(null)
            }
        };

        fetchRewardsAndDraws();

        WebApp.BackButton.show();
        WebApp.BackButton.onClick(handleBack);

        return () => {
          WebApp.BackButton.offClick(handleBack);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, user?.id]);


     const handleBack = () => {
      window.history.back();
    };

    return (
        <div className="bg-yellow-300">
            <Header />
            <main className="bg-yellow-300 pt-8 px-4 flex flex-col min-h-[70vh] w-full">
                <section>
                    <div className="flex justify-center gap-4">
                        <div
                            className={`py-2 px-4 rounded-md cursor-pointer ${
                                activeTab === "available"
                                    ? " text-black"
                                    : "bg-yellow-600 text-white"
                            }`}
                            onClick={() => setActiveTab("available")}
                        >
                            BonusForYou
                        </div>
                        <div
                            className={`py-2 px-4 rounded-md cursor-pointer ${
                                activeTab === "ongoing"
                                    ? " text-black"
                                    : " bg-yellow-600 text-white"
                            }`}
                            onClick={() => setActiveTab("ongoing")}
                        >
                            Rewards
                        </div>
                    </div>
                </section>
                <section className="mt-8">
                    {activeTab === "available" && (
                        <div className="p-2  rounded-md shadow-md">
                            {draws?.length === 0 ? (
                                <h2>No Data to Display</h2>
                            ) : draws?.map((draw) => (
                                <DrawCard key={draw.id} draw={draw} navigate={navigate} />
                            ))}
                        </div>
                    )}
                    {activeTab === "ongoing" && (
                        <div className="p-2  rounded-md shadow-md">
                             {rewards?.length === 0 ? (
                                <h2>No Data to Display</h2>
                            ) : (rewards?.map((reward) => (
                                <RewardCard key={reward.id} reward={reward} navigate={navigate} />
                            )))}
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
    navigate: any
}

const RewardCard: React.FC<RewardCardProps> = ({ reward, navigate }) => {
    return (
        <div
            className="flex gap-1 flex-col border-2 border-black rounded-lg mb-2 cursor-pointer"
            onClick={() => navigate(`/reward-event/${reward.id}`)}
        >
            <h2 className="text-black px-1">{reward.reward_name}</h2>
            <img
                src={reward.reward_image}
                alt={reward.reward_name}
                className="w-full h-full object-cover rounded-lg p-1"
            />
            <div className="flex justify-between">
                <h2 className="text-black px-1">
                    Start Date: {new Date(reward.start_date).toLocaleDateString()}
                </h2>
                <h2 className="text-black px-1">
                    End Date: {new Date(reward.end_date).toLocaleDateString()}
                </h2>
            </div>
        </div>
    );
};

interface DrawCardProps {
    draw: Draw;
    navigate: any
}

const DrawCard: React.FC<DrawCardProps> = ({ draw, navigate }) => {
    return (
       <div
            className="flex gap-1 flex-col border-2 border-black rounded-lg mb-2 cursor-pointer"
            onClick={() => navigate(`/draw-event/${draw.id}`)}
        >
            <h2 className="text-black px-1">{draw.draw_name}</h2>
            <img
                src={draw.draw_image}
                alt={draw.draw_name}
                className="w-full h-full object-cover rounded-lg p-1"
            />
            <div className="flex justify-between">
                <h2 className="text-black px-1">
                    Start Date: {new Date(draw.start_date).toLocaleDateString()}
                </h2>
                <h2 className="text-black px-1">
                    End Date: {new Date(draw.end_date).toLocaleDateString()}
                </h2>
            </div>
        </div>
    );
};