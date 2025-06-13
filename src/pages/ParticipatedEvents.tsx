import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import WebApp from "@twa-dev/sdk";
import BannerComponent from "../components/BannerComponent";

import { Reward } from "../types/type";

export default function Participated() {
    const [rewards, setRewards] = useState<Reward[]>([]);
    const userContext = useContext(UserContext);
    const user = userContext?.user;
    // const navigate = useNavigate();

    useEffect(() => {
        fetch(
            `https://bonusforyou.org/api/user/userparticipate?user_id=${user.id}`
        )
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setRewards(data.data);
            })
            .catch((error) => console.error("Error fetching rewards:", error));

        WebApp.BackButton.show();
        WebApp.BackButton.onClick(() => {
            window.history.back();
        });
    }, [user.id]);

    return (
        <div className="bg-yellow-300">
            <Header />
            <main className="bg-yellow-300 flex flex-col min-h-[100vh] w-full">
                <div className="text-center text-lg font-bold text-white bg-gray-500">
                    Participated Events
                </div>

                {/* Top Banner for Participated Events */}
                <BannerComponent
                    pageName="Participated Events"
                    position="top"
                    className="rounded-lg shadow-lg w-[90vw] h-[120px] mx-auto mt-2"
                />

                <section className="mt-4">
                    <div className="rounded-md shadow-md">
                        {rewards.length === 0 ? (
                            <h2 className="text-center p-2">
                                No Data to Display
                            </h2>
                        ) : (
                            rewards.map((reward) => (
                                <RewardCard
                                    key={reward.id}
                                    reward={reward}
                                />
                            ))
                        )}
                    </div>
                </section>

                {/* Bottom Banner for Participated Events */}
                <BannerComponent
                    pageName="Participated Events"
                    position="bottom"
                    className="rounded-lg shadow-lg w-[90vw] h-[120px] mx-auto mb-2 mt-2"
                />
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
            className="flex gap-1 flex-col border-2 text-center border-black rounded-lg mb-2 cursor-pointer mx-2"
            onClick={() => navigate(`/participated-reward-event/${reward.id}`)}
        >
            <h2 className="text-black ps-3">
                {reward.reward_name || "No Name"}
            </h2>
            {reward.reward_image ? (
                <img
                    src={reward.reward_image}
                    alt={reward.reward_name || "No Image"}
                    className="rounded-lg shadow-lg w-[90vw] h-[120px] mx-auto"
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
