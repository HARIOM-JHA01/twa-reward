import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import WebApp from "@twa-dev/sdk";

import { Reward } from "../types/type";

export default function Rewards() {
    const [rewards, setRewards] = useState<Reward[]>([]);
    const userContext = useContext(UserContext);
    const user = userContext?.user;

    useEffect(() => {
        fetch(
            `https://bonusforyou.org/api/user/running_reward?user_id=${user.id}`
        )
            .then((response) => response.json())
            .then((data) => setRewards(data.data))
            .catch((error) => console.error("Error fetching rewards:", error));

        WebApp.BackButton.show();

        // Set Back Button click event
        WebApp.BackButton.onClick(() => {
            window.history.back();
        });
    }, [user.id]);

    return (
        <div className="bg-yellow-300">
            <Header />
            <main className="bg-yellow-300 flex flex-col min-h-[70vh] w-full">
                <div className="text-center text-xl font-bold text-white bg-gray-700">
                    Ongoing Events
                </div>
                <section className="mt-2">
                    <div className="rounded-md shadow-md">
                        {!rewards || rewards.length === 0 ? (
                            <h2 className="p-2 text-center rounded-md shadow-md px-2">
                                No Data to Display
                            </h2>
                        ) : (
                            rewards.map((reward) => (
                                <RewardCard key={reward.id} reward={reward} />
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
}

export const RewardCard: React.FC<RewardCardProps> = ({ reward }) => {
    const navigate = useNavigate();
    return (
        <div
            className="flex gap-1 flex-col border-2 border-black rounded-lg mb-2"
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
                    Start On: {reward.start_date}
                </h2>
                <h2 className="text-black pe-3">End On: {reward.end_date}</h2>
            </div>
        </div>
    );
};
