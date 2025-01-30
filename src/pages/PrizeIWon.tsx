import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import WebApp from "@twa-dev/sdk";
// Update types to match actual API responses
interface Draw {
    id: number;
    user_id: number;
    poster_name: string;
    draw_name: string;
    draw_image: string;
    country: string;
    start_date: string; // Keep it string for now to handle date object
    end_date: string; // Keep it string for now to handle date object
    draw_detail: string;
    status: string;
    draw_status: number;
    channel_link: string | null;
    repeat: string;
    created_at: string;
    updated_at: string;
    win_no: string;
    win_prize: string;
    ewin_no: string;
    ewin_prize: string;
}
interface Reward {
    id: number;
    user_id: number;
    reward_name: string;
    reward_image: string;
    start_date: string;
    end_date: string;
    created_at: string;
    updated_at: string;

}


export default function PrizeIWon() {
    const [activeTab, setActiveTab] = useState("available");
    const [rewards, setRewards] = useState<Reward[]>([]);
    const [draws, setDraws] = useState<Draw[]>([]);
    const [selectedDraw, setSelectedDraw] = useState<Draw | null>(null);
    const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
    const userContext = useContext(UserContext);
    const user = userContext?.user || { id: 72 }; // Default user ID

    useEffect(() => {
        if (activeTab === "available") {
            fetch(`https://bonusforyou.org/api/user/Win_draws?user_id=${user.id}`)
                .then(response => response.json())
                .then(data => {
                    if (data && data.data) {
                        setDraws(data.data);
                    } else {
                        setDraws([]); // Handle the case where data or data.data is undefined
                    }
                })
                .catch(error => console.error("Error fetching draws:", error));
        } else {
            fetch(`https://bonusforyou.org/api/user/Reward_win_draws?user_id=${user.id}`)
                .then(response => response.json())
                .then(data => {
                    if (data && data.data) {
                        setRewards(data.data);
                    } else {
                        setRewards([]);
                    }
                })
                .catch(error => console.error("Error fetching rewards:", error));
        }

        WebApp.BackButton.show();

        // Set Back Button click event
        WebApp.BackButton.onClick(() => {
            window.history.back();
            // WebApp.close();
        });
    }, [activeTab, user.id]);
    const handleCardClick = (type: 'draw' | 'reward', item: Draw | Reward) => {
        if (type === 'draw') {
            setSelectedDraw(item as Draw);
            setSelectedReward(null)
        } else {
            setSelectedReward(item as Reward);
            setSelectedDraw(null);
        }

    };
    const handleCloseDetail = () => {
        setSelectedDraw(null);
        setSelectedReward(null);
    };
    return (
        <div className="bg-yellow-300">
            <Header />
            <main className="bg-yellow-300 pt-8 px-4 flex flex-col min-h-[70vh] w-full relative">
                <section>
                    <div className="flex justify-center gap-4">
                        <div
                            className={`py-2 px-4 rounded-md cursor-pointer ${activeTab === "available" ? " bg-yellow-600 text-white" : "text-black"}`}
                            onClick={() => setActiveTab("available")}
                        >
                            BonusForYou
                        </div>
                        <div
                            className={`py-2 px-4 rounded-md cursor-pointer ${activeTab === "ongoing" ? " bg-yellow-600 text-white" : " text-black"}`}
                            onClick={() => setActiveTab("ongoing")}
                        >
                            Rewards
                        </div>
                    </div>
                </section>
                <section className="mt-8">
                    {activeTab === "available" && (
                        <div >
                            {!draws || draws.length === 0 ? (
                                <h2
                                    className="flex justify-center items-center"
                                >No Data to Display</h2>
                            ) :
                                draws.map(draw => (
                                    <DrawCard key={draw.id} draw={draw} onCardClick={handleCardClick} />
                                ))}
                        </div>
                    )}
                    {activeTab === "ongoing" && (
                        <div >
                            {!rewards || rewards.length === 0 ? (
                                <h2
                                    className="flex justify-center items-center"
                                >No Data to Display</h2>
                            ) : (
                                rewards.map(reward => (
                                    <RewardCard key={reward.id} reward={reward} onCardClick={handleCardClick} />
                                ))
                            )}
                        </div>
                    )}
                </section>
                {selectedDraw && <DrawDetail draw={selectedDraw} onClose={handleCloseDetail} />}
                {selectedReward && <RewardDetail reward={selectedReward} onClose={handleCloseDetail} />}

            </main>
            <Footer />
        </div>
    );
}

interface RewardCardProps {
    reward: Reward;
    onCardClick: (type: 'reward', item: Reward) => void;
}


//  Card Component
export const RewardCard: React.FC<RewardCardProps> = ({ reward, onCardClick }) => {

    return (
        <div className="flex gap-1 flex-col border-2 border-black rounded-lg mb-2 cursor-pointer" onClick={() => onCardClick('reward', reward)}>
            <h2 className="text-black px-1">{reward.reward_name}</h2>
            <img src={reward.reward_image} alt={reward.reward_name} className="w-full h-full object-cover rounded-lg p-1" />
            <div className="flex justify-between">
                <h2 className="text-black px-1">Start On: {new Date(reward.start_date).toLocaleDateString()}</h2>
                <h2 className="text-black px-1">End On: {new Date(reward.end_date).toLocaleDateString()}</h2>
            </div>
        </div>
    );
};



interface DrawCardProps {
    draw: Draw;
    onCardClick: (type: 'draw', item: Draw) => void;
}

export const DrawCard: React.FC<DrawCardProps> = ({ draw, onCardClick }) => {

    return (
        <div className="flex gap-1 flex-col border-2 border-black rounded-lg mb-2 cursor-pointer" onClick={() => onCardClick('draw', draw)}>
            <h2 className="text-black px-1">{draw.draw_name}</h2>
            <img src={draw.draw_image} alt={draw.draw_name} className="w-full h-full object-cover rounded-lg p-1" />
            <div className="flex justify-between">
                <h2 className="text-black px-1">Start On: {new Date(draw.start_date).toLocaleDateString()}</h2>
                <h2 className="text-black px-1">End On: {new Date(draw.end_date).toLocaleDateString()}</h2>
            </div>
        </div>
    );
};

// Detail Components
interface DrawDetailProps {
    draw: Draw;
    onClose: () => void;
}

export const DrawDetail: React.FC<DrawDetailProps> = ({ draw, onClose }) => {
    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-yellow-300 m-4 p-6 rounded-lg relative shadow-lg max-w-md w-full">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl">
                    ✖
                </button>
                <h2 className="text-2xl font-semibold text-center mb-4 text-yellow-600">Congratulations!</h2>
                <h2 className="text-3xl font-bold mb-4 text-center">{draw.draw_name}</h2>
                <img src={draw.draw_image} alt={draw.draw_name} className="w-full h-auto object-cover rounded-lg mb-4" />
                <div className="flex flex-col gap-2">
                    <p className="text-lg text-black">Win Prize: {draw.win_prize}</p>
                    <p className="text-lg text-black">Early Bird Prize: {draw.ewin_prize}</p>
                </div>
                <p className="font-bold text-center mt-3">Please Join the Channel and connect the reward</p>
            </div>
        </div>
    );
};

interface RewardDetailProps {
    reward: Reward;
    onClose: () => void;
}

export const RewardDetail: React.FC<RewardDetailProps> = ({ reward, onClose }) => {
    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg relative shadow-lg max-w-md w-full">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl">
                    ✖
                </button>
                <h2 className="text-2xl font-semibold text-center mb-4 text-yellow-600">You Won a Reward!</h2>
                <h2 className="text-3xl font-bold mb-4 text-center">{reward.reward_name}</h2>
                <img src={reward.reward_image} alt={reward.reward_name} className="w-full h-auto object-cover rounded-lg mb-4" />
                <div className="flex flex-col gap-2">
                    <p className="text-lg"><strong className="text-yellow-600">Start Date:</strong> {new Date(reward.start_date).toLocaleDateString()}</p>
                    <p className="text-lg"><strong className="text-yellow-600">End Date:</strong> {new Date(reward.end_date).toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    );
};
