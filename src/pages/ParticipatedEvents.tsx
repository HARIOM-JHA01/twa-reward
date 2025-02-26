import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import WebApp from "@twa-dev/sdk";
import { Reward } from "../types/type";

export default function AvailableEvents() {
    const [rewards, setRewards] = useState<Reward[]>([]);
    const userContext = useContext(UserContext);
    const user = userContext?.user || { id: 72 }; // Default user ID

    useEffect(() => {
        fetch(
            `https://bonusforyou.org/api/user/Participated_rewards?user_id=${user.id}`
        )
            .then((response) => response.json())
            .then((data) => setRewards(data.data))
            .catch((error) => console.error("Error fetching rewards:", error));

        WebApp.BackButton.show();
        WebApp.BackButton.onClick(() => {
            window.history.back();
        });
    }, [user.id]);

    return (
        <div className="bg-yellow-300">
            <Header />
            <main className="bg-yellow-300 pt-4 px-2 flex flex-col min-h-[70vh] w-full">
                <div className="text-center text-3xl font-bold text-black">
                    Participated Events
                </div>
                <section className="mt-4">
                    <div className="p-2 text-center rounded-md shadow-md">
                        {rewards.length === 0 ? (
                            <h2 className="flex justify-center items-center">
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
            onClick={() => navigate(`/participated-reward-event/${reward.id}`)}
        >
            <h2 className="text-black ps-3">{reward.reward_name}</h2>
            <img
                src={reward.reward_image}
                alt={reward.reward_name}
                className="w-full h-full object-cover rounded-lg p-1"
            />
            <div className="flex justify-between">
                <h2 className="text-black ps-3">
                    Start Date: {reward.start_date}
                </h2>
                <h2 className="text-black pe-3">End Date: {reward.end_date}</h2>
            </div>
        </div>
    );
};
