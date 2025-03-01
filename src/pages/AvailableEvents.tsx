import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import WebApp from "@twa-dev/sdk";

import { Reward } from "../types/type";

export default function AvailableEvents() {
    const [rewards, setRewards] = useState<Reward[] | null>(null);
    const userContext = useContext(UserContext);
    const user = userContext?.user;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRewards = async () => {
            try {
                if (!user?.id) {
                    console.error("User ID not available, cannot fetch data");
                    return;
                }

                const response = await fetch(
                    `https://bonusforyou.org/api/user/rewarddrawlist?user_id=${user.id}`
                );

                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch data with status: ${response.status}`
                    );
                }

                const data = await response.json();
                console.log("Data fetched:", data);

                if (
                    data.status === false ||
                    !data.data ||
                    data.data.length === 0
                ) {
                    console.warn("No rewards available:", data.message);
                    setRewards([]); // Ensure UI displays "No Data to Display"
                    return;
                }

                setRewards(data.data);
            } catch (error) {
                console.error("Error fetching data:", error);
                setRewards([]); // If an error occurs, treat it as no data
            }
        };

        fetchRewards();

        WebApp.BackButton.show();
        WebApp.BackButton.onClick(handleBack);

        return () => {
            WebApp.BackButton.offClick(handleBack);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id]);

    const handleBack = () => {
        window.history.back();
    };

    return (
        <div className="bg-yellow-300">
            <Header />
            <main className="bg-yellow-300 flex flex-col min-h-[70vh] w-full">
                <div className="text-center text-lg font-bold text-white bg-gray-500">
                    Available Events
                </div>
                <section className="mt-4">
                    <div className="rounded-md shadow-md px-2">
                        {rewards === null ? (
                            <h2 className="p-2 text-center rounded-md shadow-md">
                                Loading...
                            </h2>
                        ) : rewards.length === 0 ? (
                            <h2 className="p-2 text-center rounded-md shadow-md">
                                No Data to Display
                            </h2>
                        ) : (
                            rewards.map((reward) => (
                                <RewardCard
                                    key={reward.id}
                                    reward={reward}
                                    navigate={navigate}
                                />
                            ))
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}

interface RewardCardProps {
    reward: Reward;
    navigate: any;
}

const RewardCard: React.FC<RewardCardProps> = ({ reward, navigate }) => {
    return (
        <div
            className="flex gap-1 flex-col border-2 border-black rounded-lg mb-2 cursor-pointer"
            onClick={() => navigate(`/reward-event/${reward.id}`)}
        >
            <h2 className="text-black ps-3 font-bold">{reward.reward_name}</h2>
            <img
                src={reward.reward_image}
                alt={reward.reward_name}
                className="rounded-lg shadow-lg w-[90vw] h-[120px] mx-auto"
            />
            <div className="flex justify-between">
                <h2 className="text-black ps-3">
                    Start On: {reward.start_date || "Not Available"}
                </h2>
                <h2 className="text-black pe-3">
                    End On: {reward.end_date || "Not Available"}
                </h2>
            </div>
        </div>
    );
};
