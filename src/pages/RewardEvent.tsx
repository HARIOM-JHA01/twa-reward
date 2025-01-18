import Header from "../components/Header";
import Footer from "../components/Footer";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";

interface Prize {
    id: number;
    no_win_prize: string;
    no_of_prize: string;
    prize: string;
}

interface RewardDetail {
    draw_name: string;
    draw_image: string;
    country: string;
    start_date: string;
    end_date: string;
    draw_detail: string;
    channel_link: string;
    join_user: number;
    verifiaction_link_0?: string;
    Prize_list: Prize[];
}

export default function RewardEvent() {
    const { id } = useParams<{ id: string }>();
    const [rewardDetail, setRewardDetail] = useState<RewardDetail | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [verificationLink, setVerificationLink] = useState("");
    const [isWithinDateRange, setIsWithinDateRange] = useState(false);
    const userContext = useContext(UserContext);
    if (!userContext) {
        throw new Error("UserContext must be used within a UserProvider");
    }
    const { user } = userContext;

    useEffect(() => {
        if (id) {
            fetch(`https://bonusforyou.org/api/user/rewardlistsingle/${id}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.status) {
                        const rewardData = data.data;
                        setRewardDetail(rewardData);
                        checkDateRange(rewardData.start_date, rewardData.end_date);
                    } else {
                        console.error("Error fetching reward details:", data.message);
                    }
                })
                .catch(error => {
                    console.error("Error fetching reward details:", error);
                });
        }
    }, [id]);

    const checkDateRange = (startDate: string, endDate: string) => {
        const currentDate = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);
        setIsWithinDateRange(currentDate >= start && currentDate <= end);
    };

    const handleJoinClick = () => {
        if (rewardDetail?.verifiaction_link_0) {
            window.open(rewardDetail.verifiaction_link_0, "_blank");
        }
        setIsModalOpen(true);
    };

    const handleModalSubmit = () => {
        if (rewardDetail) {
            const payload = {
                user_id: user.id,
                Reward_id: id,
                Verification_link: verificationLink,
            };

            fetch(`https://bonusforyou.org/api/user/joinReward`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status) {
                        console.log("Joined successfully");
                        setIsModalOpen(false);
                    } else {
                        console.error("Error joining reward:", data.message);
                    }
                })
                .catch(error => console.error("Error joining reward:", error));
        }
    };

    if (!rewardDetail) {
        return <div>Loading...</div>;
    }

    return (
        <div className="bg-yellow-300">
            <Header />
            <main className="bg-yellow-300 flex flex-col w-full min-h-screen p-4">
                <img src={rewardDetail.draw_image} alt={rewardDetail.draw_name} className="rounded my-3" />
                <h2 className="text-center text-black font-bold">Reward Title:</h2>
                <p className="text-center text-black border border-black p-2 rounded-lg">{rewardDetail.draw_name}</p>
                <h2 className="text-center text-black font-bold">Rewards Detail and Join Channel as Subscriber:</h2>
                <a
                    href={rewardDetail.channel_link}
                    className="text-center text-orange-400 border border-black p-2 rounded-lg"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {rewardDetail.channel_link}
                </a>
                <h2 className="text-center text-black font-bold">Prizes:</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-center text-black p-2 rounded-lg border border-black">
                    {rewardDetail.Prize_list.map((prize, index) => (
                        <li key={index} className="flex justify-between items-center">
                            <div className="flex-1">{prize.no_win_prize}</div>
                            <div className="flex-1">{prize.no_of_prize}</div>
                            <div className="flex-1">{prize.prize}</div>
                        </li>
                    ))}
                </ul>
                <h2 className="text-center text-black font-bold">Event Brief:</h2>
                <p
                    className="text-center text-black border border-black p-2 rounded-lg"
                    dangerouslySetInnerHTML={{ __html: rewardDetail.draw_detail }}
                />
                <div className="flex justify-between items-center my-3">
                    <button
                        onClick={handleJoinClick}
                        className={`bg-green-600 p-2 rounded-lg text-white font-semibold ${isWithinDateRange && rewardDetail.verifiaction_link_0 ? "" : "opacity-50 cursor-not-allowed"}`}
                        disabled={!isWithinDateRange || !rewardDetail.verifiaction_link_0}
                    >
                        VIEW POST TO JOIN PROGRAM
                    </button>
                    <div
                        className="rounded-full w-12 h-12 bg-red-500 justify-center items-center flex"
                        onClick={() => {
                            navigator.clipboard.writeText(rewardDetail.channel_link);
                        }}
                    >
                        <img className="w-6 h-6" src="/share.png" alt="Share" />
                    </div>
                </div>
                {isWithinDateRange && <h3 className="text-black">User Left to Join: {rewardDetail.join_user}</h3>}
                <p className="text-center text-black text-sm p-4 rounded-lg">
                    View post, Join Channel and copy paste link, comeback and paste link to bonusforyou
                </p>
                <Footer />
                {isModalOpen && (
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-4 rounded-lg">
                            <h2 className="text-center text-black font-bold">Paste the verification link</h2>
                            <input
                                type="text"
                                value={verificationLink}
                                onChange={(e) => setVerificationLink(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded mt-2"
                            />
                            <button
                                onClick={handleModalSubmit}
                                className="bg-green-600 p-2 rounded-lg text-white font-semibold mt-2"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
