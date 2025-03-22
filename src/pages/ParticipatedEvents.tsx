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
    const user = userContext?.user;

    useEffect(() => {
        fetch(
            `https://bonusforyou.org/api/user/Participated_rewards?user_id=${user.id}`
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                if (data && Array.isArray(data.data)) {
                    setRewards(data.data);
                } else {
                    console.error("Invalid API response structure", data);
                    setRewards([]);
                }
            })
            .catch((error) => console.error("Error fetching rewards:", error));

        if (WebApp?.BackButton) {
            WebApp.BackButton.show();
            WebApp.BackButton.onClick(() => {
                window.history.back();
            });
        } else {
            console.warn("WebApp SDK not available");
        }
    }, [user.id]);

    return (
        <div className="bg-yellow-300">
            <Header />
            <main className="bg-yellow-300 flex flex-col min-h-[70vh] w-full">
                <div className="text-center text-lg font-bold text-white bg-gray-500">
                    Participated Events
                </div>
                <section className="mt-4">
                    <div className="rounded-md shadow-md px-2">
                        {rewards.length === 0 ? (
                            <h2 className="p-2 text-center rounded-md shadow-md">
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

    if (!reward) return null;

    return (
        <div
            className="flex gap-1 flex-col border-2 border-black rounded-lg mb-2 cursor-pointer"
            onClick={() => navigate(`/participated-reward-event/${reward.id}`)}
        >
            <h2 className="text-black ps-3">
                {reward.reward_name || "No Name"}
            </h2>
            {reward.reward_image ? (
                <img
                    src={reward.reward_image}
                    alt={reward.reward_name || "No Image"}
                    className="w-full h-40 object-cover rounded-lg p-1"
                />
            ) : (
                <p className="text-center text-gray-500">No Image Available</p>
            )}
            <div className="flex justify-between">
                <h2 className="text-black ps-3">
                    Start On:{" "}
                    {reward.start_date
                        ? (() => {
                              const dateObj = new Date(reward.start_date);
                              // Format the date as dd-mm-yyyy
                              const datePart = dateObj
                                  .toLocaleDateString("en-GB")
                                  .replace(/\//g, "-");
                              // Format the time as hh:mm (24-hour format)
                              const timePart = dateObj.toLocaleTimeString(
                                  "en-GB",
                                  {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                  }
                              );
                              return `${datePart} ${timePart} GMT`;
                          })()
                        : "Not Available"}
                </h2>
                <h2 className="text-black pe-3">
                    End On:{" "}
                    {reward.end_date
                        ? (() => {
                              const dateObj = new Date(reward.end_date);
                              const datePart = dateObj
                                  .toLocaleDateString("en-GB")
                                  .replace(/\//g, "-");
                              const timePart = dateObj.toLocaleTimeString(
                                  "en-GB",
                                  {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                  }
                              );
                              return `${datePart} ${timePart} GMT`;
                          })()
                        : "Not Available"}
                </h2>
            </div>
        </div>
    );
};
