import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import WebApp from "@twa-dev/sdk";
import { useNavigate } from "react-router-dom";
import giftBoxPath from "/giftbox.png";

interface Reward {
    id: number;
    user_id: number;
    reward_name: string;
    reward_image: string;
    start_date: string;
    end_date: string;
    created_at: string;
    updated_at: string;
    win_no: string;
    win_prize: string;
    ewin_no: string;
    ewin_prize: string;
}

export default function PrizeIWon() {
    const [rewards, setRewards] = useState<Reward[]>([]);
    const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
    const userContext = useContext(UserContext);
    const user = userContext?.user || { id: 72 };

    useEffect(() => {
        fetch(
            `https://bonusforyou.org/api/user/Reward_win_draws?user_id=${user.id}`
        )
            .then((response) => response.json())
            .then((data) => {
                if (data?.data) {
                    setRewards(data.data);
                } else {
                    setRewards([]);
                }
            })
            .catch((error) => console.error("Error fetching rewards:", error));

        WebApp.BackButton.show();
        WebApp.BackButton.onClick(() => {
            window.history.back();
        });
    }, [user.id]);

    const handleCloseDetail = () => {
        setSelectedReward(null);
    };

    return (
        <div className="bg-yellow-300">
            <Header />
            <main className="bg-yellow-300 flex flex-col min-h-[70vh] w-full relative">
                <div className="text-center text-xl font-bold text-white bg-gray-700">
                    Prize I Won
                </div>
                <section className="mt-4">
                    <div>
                        {rewards.length === 0 ? (
                            <h2 className="p-2 text-center rounded-md shadow-md px-2">
                                No Data to Display
                            </h2>
                        ) : (
                            rewards.map((reward) => (
                                <RewardCard
                                    key={reward.id}
                                    reward={reward}
                                    onCardClick={setSelectedReward}
                                />
                            ))
                        )}
                    </div>
                </section>
                {selectedReward && (
                    <RewardDetail
                        reward={selectedReward}
                        onClose={handleCloseDetail}
                    />
                )}
            </main>
            <Footer />
        </div>
    );
}

interface RewardCardProps {
    reward: Reward;
    onCardClick: (item: Reward) => void;
}

const RewardCard: React.FC<RewardCardProps> = ({ reward, onCardClick }) => {
    const navigate = useNavigate();

    const handleGiftBoxClick = (e: React.MouseEvent<HTMLImageElement>) => {
        e.stopPropagation();
        onCardClick(reward);
    };

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
                    Start On: {new Date(reward.start_date).toLocaleDateString()}
                </h2>
                <div className="cursor-pointer" onClick={handleGiftBoxClick}>
                    <img src={giftBoxPath} alt="gift box" className="w-7 h-7" />
                </div>
                <h2 className="text-black px-1">
                    End On: {new Date(reward.end_date).toLocaleDateString()}
                </h2>
            </div>
        </div>
    );
};

interface RewardDetailProps {
    reward: Reward;
    onClose: () => void;
}

const RewardDetail: React.FC<RewardDetailProps> = ({ reward, onClose }) => {
    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-yellow-300 m-4 p-6 rounded-lg relative shadow-lg max-w-md w-full">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                >
                    ✖
                </button>
                <p className="text-center text-black mt-2 border font-bold border-black p-2 rounded-lg mb-3">
                    {reward.reward_name}
                </p>
                <img
                    src={reward.reward_image}
                    alt={reward.reward_name}
                    className="w-full h-auto object-cover rounded-lg mb-4"
                />
                <h2 className="text-md font-bold text-center text-yellow-600">
                    Congratulation !!!{" "}
                </h2>
                <h2 className="text-md font-bold text-center mb-4 text-yellow-600">
                    you are the winner for below Prizes
                </h2>
                <div className="flex flex-col gap-2">
                    <p className="text-lg text-black">
                        Prize Won: {reward.win_prize}
                    </p>
                    <p className="text-lg text-black">
                        Early Bird Prize Won: {reward.ewin_prize}
                    </p>
                </div>
                <p className="font-bold text-center mt-3">
                    Note : To claim your reward contact our telegram channel
                </p>
            </div>
        </div>
    );
};
