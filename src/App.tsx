import { useEffect, useState, useContext } from "react";
import WebApp from "@twa-dev/sdk";
import { useNavigate } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { UserContext } from './context/UserContext';


type PromotionBanner = {
    draw_image: string;
    draw_name: string;
};

function App() {
    const userContext = useContext(UserContext);
    if (!userContext) {
        throw new Error("UserContext must be used within a UserProvider");
    }
    const { setUser, setIsLoggedIn } = userContext;

    const [promotionBanner, setPromotionBanner] = useState<PromotionBanner | null>(null);


    useEffect(() => {
        WebApp.ready();

        // Fetch promotion banner data
        fetch("https://bonusforyou.org/api/PromotionBannerlist")
            .then((res) => res.json())
            .then((data) => {
                if (data.status) {
                    setPromotionBanner(data.data);
                }
            })
            .catch((error) => console.error("Error fetching promotion banner:", error));


        const telegram_id = 'Fan_tai663';

        if (telegram_id) {
            fetch('https://bonusforyou.org/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    telegram_id: telegram_id,
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.status) {
                        const userData = data.data;
                        setUser({
                            id: userData.id,
                            name: userData.name,
                            telegramId: userData.telegram_id,
                            country: userData.country,
                            uniqueId: userData.unique_id,
                        });
                        setIsLoggedIn(true)
                    } else {
                        console.error('Failed to fetch user data.');
                    }
                })
                .catch(() => {
                    console.error('Failed to fetch user data.');
                });
        } else {
            console.error('Telegram ID not found.');
        }

    }, [setUser, setIsLoggedIn]);


    const navigate = useNavigate();

    return (
        <div className="bg-yellow-300 min-h-screen flex flex-col">
            <Header />

            <main className="bg-yellow-300 pt-8 flex flex-col justify-start items-center  w-full flex-grow">
                {promotionBanner && (
                    <img
                        src={promotionBanner.draw_image}
                        alt={promotionBanner.draw_name}
                        className="rounded-lg shadow-lg w-[80vw]  mx-auto"
                    />
                )}

                <section className="flex flex-col gap-4 mt-4 items-center">
                    <div
                        onClick={() => navigate("/available-rewards")}
                        className="py-3 bg-[#37474F] min-w-[300px] text-center rounded-md text-white hover:font-bold hover:cursor-pointer max-w-[300px]"
                    >
                        Available Events
                    </div>
                    <div
                        onClick={() => navigate("/ongoing-rewards")}
                        className="py-3 bg-[#37474F] min-w-[300px] text-center rounded-md text-white hover:font-bold hover:cursor-pointer max-w-[300px]"
                    >
                        Ongoing Events
                    </div>
                    <div
                        onClick={() => navigate("/participated-rewards")}
                        className="py-3 bg-[#37474F] min-w-[300px] text-center rounded-md text-white hover:font-bold hover:cursor-pointer max-w-[300px]"
                    >
                        Participated Events
                    </div>
                    <div
                        onClick={() => navigate("/prize-i-won")}
                        className="py-3 bg-[#37474F] min-w-[300px] text-center rounded-md text-white hover:font-bold hover:cursor-pointer max-w-[300px]"
                    >
                        Prize I Won
                    </div>
                    <div
                        onClick={() => navigate("/profile")}
                        className="py-3 bg-[#37474F] min-w-[300px] text-center rounded-md text-white hover:font-bold hover:cursor-pointer max-w-[300px]"
                    >
                        My Profile
                    </div>
                </section>


            </main>
            <Footer />
        </div>
    );
}

export default App;