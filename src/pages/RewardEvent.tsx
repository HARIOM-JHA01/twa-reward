import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import WebApp from "@twa-dev/sdk";
import { UserContext } from "../context/UserContext";
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';

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
    Prize_list: Prize[];
}

export default function RewardEvent() {
    const { id } = useParams<{ id: string }>();
    const [rewardDetail, setRewardDetail] = useState<RewardDetail | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showVerificationBox, setShowVerificationBox] = useState<boolean>(false);
    const [verificationLink, setVerificationLink] = useState<string>("");
    const [joinSuccess, setJoinSuccess] = useState<boolean>(false);
    const [isJoining, setIsJoining] = useState<boolean>(false);
    const userContext = useContext(UserContext);
    const user = userContext?.user;

    useEffect(() => {
        const fetchRewardDetail = async () => {
            WebApp.BackButton.show();
            WebApp.BackButton.onClick(handleBack);

            try {
                if (!id) {
                    setError('Invalid reward ID.');
                    return;
                }

                const response = await fetch(
                    `https://bonusforyou.org/api/user/rewardlistsingle/${id}`
                );

                if (!response.ok) {
                    throw new Error(`Failed to fetch data with status: ${response.status}`);
                }

                const data = await response.json();

                if (data.status) {
                    setRewardDetail(data.data);
                    setError(null);
                } else {
                    setError(data.message || 'Failed to fetch reward details.');
                }
            } catch (error: any) {
                console.error("Error fetching reward details:", error);
                setError(error.message || 'Failed to fetch reward details.');
            }
        };
        fetchRewardDetail();

        return () => {
            WebApp.BackButton.offClick(handleBack);
        };
    }, [id]);

    const handleBack = () => {
        window.history.back();
    };

    const handleShare = async () => {
        try {
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(window.location.href);
                toast.success('Link copied to clipboard!', {
                    position: "bottom-center",
                    autoClose: 2000
                });
            } else {
                toast.error("Clipboard API not supported, please copy manually", {
                    position: "bottom-center",
                    autoClose: 2000
                });
            }


        } catch (err) {
            toast.error("Failed to copy link. Please try again later", {
                position: "bottom-center",
                autoClose: 2000
            });
            console.error("Failed to copy:", err);
        }
    };


    const handleViewPostClick = () => {
        if (rewardDetail?.channel_link) {
            //   window.open(rewardDetail.channel_link, "_blank");
            console.log("Channel Link: ", rewardDetail.channel_link);
            setShowVerificationBox(true);
        }
    };

    const handleVerificationLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVerificationLink(e.target.value);
    };

    const handleJoinReward = async () => {
        setIsJoining(true);
        try {
            if (!user?.id || !id || !verificationLink) {
                setError("User ID, Reward ID, or Verification Link is missing");
                return;
            }
            const response = await fetch('https://bonusforyou.org/api/user/joinReward', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user.id,
                    rewardid: id,
                    Verification_link: verificationLink,
                }),
            });
            const data = await response.json();
            if (data.status) {
                setJoinSuccess(true);
                setError(null);
                setVerificationLink("");
                toast.success("Successfully joined", {
                    position: "bottom-center",
                    autoClose: 2000
                });
                setShowVerificationBox(false);
            } else {
                setError(data.message || "Failed to Join reward");
                toast.error(data.message || "Failed to Join reward", {
                    position: "bottom-center",
                    autoClose: 2000
                });
            }
        } catch (error: any) {
            console.error("Error joining reward:", error);
            toast.error("Failed to join, please try again later", {
                position: "bottom-center",
                autoClose: 2000
            });
            setError(error.message || 'Failed to Join reward.');
        } finally {
            setIsJoining(false);

        }
    };

    if (error) {
        return (
            <div className="bg-yellow-300">
                <Header />
                <main className="bg-yellow-300 flex flex-col w-full min-h-screen p-4">
                    <div className="text-red-500 text-center">{error}</div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!rewardDetail) {
        return (
            <div className="bg-yellow-300">
                <Header />
                <main className="bg-yellow-300 flex flex-col w-full min-h-screen p-4">
                    <div>Loading...</div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="bg-yellow-300">
            <Header />
            <main className="bg-yellow-300 flex flex-col w-full min-h-screen p-4">
                <a
                    href={rewardDetail.channel_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-center text-2xl text-orange-500"
                >
                    Join Channel and View Details
                </a>
                <img
                    src={rewardDetail.draw_image}
                    alt={rewardDetail.draw_name}
                    className="rounded my-3 w-full object-contain max-h-[300px] mx-auto"
                />
                <h2 className="text-center text-black font-bold">Event Title:</h2>
                <p className="text-center text-black border border-black p-2 rounded-lg">
                    {rewardDetail.draw_name}
                </p>
                <h2 className="text-center text-black font-bold">
                    Events Detail and Join Channel as Subscriber:
                </h2>
                <a
                    href={rewardDetail.channel_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-center text-orange-400 border border-black p-2 rounded-lg break-words"
                >
                    {rewardDetail.channel_link}
                </a>
                <h2 className="text-center text-black font-bold">Prizes:</h2>
                <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-center text-black p-2 rounded-lg border border-black">
                    {rewardDetail.Prize_list?.map((prize, index) => (
                        <li key={index} role="listitem" className="flex justify-between items-center">
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

                <div className="flex flex-col items-center my-3">
                    <div className="flex justify-between items-center w-full">
                        <button
                            onClick={handleViewPostClick}
                            disabled={joinSuccess}
                            className={`bg-green-600 p-2 rounded-lg text-white font-semibold ${joinSuccess ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                        >
                            {joinSuccess ? "Joined" : "VIEW POST TO JOIN PROGRAM"}
                        </button>
                        <div className="rounded-full w-12 h-12 bg-red-500 justify-center items-center flex cursor-pointer" onClick={handleShare}>
                            <img className="w-6 h-6" src="/share.png" alt="share button" />
                        </div>
                    </div>
                    {showVerificationBox && (
                        <div className="mt-2 w-full flex flex-col items-center">
                            <input
                                type="text"
                                className="border border-gray-300 rounded px-4 py-2 w-full text-black"
                                placeholder="Verification Link"
                                value={verificationLink}
                                onChange={handleVerificationLinkChange}
                            />
                            <button
                                onClick={handleJoinReward}
                                disabled={isJoining || joinSuccess}
                                className={`mt-2 bg-green-600 text-white px-4 py-2 rounded ${isJoining || joinSuccess ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                            >
                                Join
                            </button>
                        </div>
                    )}
                </div>

                <h3 className="text-black">User Left to Join: {rewardDetail.join_user}</h3>

                <p className="text-center text-black text-sm p-4 rounded-lg">
                    View post, Join Channel and copy paste link, comeback and paste link to bonusforyou
                </p>

            </main>
            <ToastContainer />
            <Footer />
        </div>
    );
}