import { useEffect, useState, useContext } from "react";
import WebApp from "@twa-dev/sdk";
import Header from "./components/Header";
import { useNavigate } from "react-router-dom";
import Footer from "./components/Footer";
import { UserContext } from './context/UserContext';
import { useTranslation } from "react-i18next";
import headerImage from "/profile.jpg";
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
    const [countryCode, setCountryCode] = useState<string | null>(null); // State to store country code

    const { t } = useTranslation();

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

        // Fetch country information
        fetch("https://bonusforyou.org/api/user/get-country")
            .then((res) => res.json())
            .then((data) => {
                if (data.countryCode) {
                    setCountryCode(data.countryCode);
                }
            })
            .catch((error) => console.error("Error fetching country:", error));

        const telegram_id = WebApp.initDataUnsafe.user?.id;
        // const telegram_id = '123456789';

        if (telegram_id && countryCode) { // Ensure countryCode is fetched before making the login request
            console.log('Telegram ID:', telegram_id);
            console.log('Country Code:', countryCode);
            fetch('https://bonusforyou.org/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    telegram_id: telegram_id,
                    countryCode: countryCode, // Include countryCode in the payload
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
                        setIsLoggedIn(true);
                    } else {
                        console.error('Failed to fetch user data.');
                    }
                })
                .catch((error) => {
                    console.error('Failed to fetch user data:', error);
                });
        } else if (!telegram_id) {
            console.error('Telegram ID not found.');
        }

    }, [setUser, setIsLoggedIn, countryCode]); // Add countryCode as a dependency

    const navigate = useNavigate();

    return (
        <>
            <Header />
            <div className="bg-yellow-300 min-h-screen flex flex-col z-10">
                <main className="bg-yellow-300 pt-4 flex flex-col justify-start items-center w-full flex-grow">
                    {promotionBanner && (
                        <img
                            src={headerImage}
                            alt={promotionBanner?.draw_name || ""}
                            className="rounded-lg shadow-lg w-[90vw] h-[120px] mx-auto"
                        />
                    )}

                    <section className="flex flex-col gap-4 my-auto items-center">
                        <div
                            onClick={() => navigate("/available-rewards")}
                            className="py-3 bg-[#37474F] min-w-[300px] text-center rounded-md text-white hover:font-bold hover:cursor-pointer max-w-[300px]"
                        >
                            {t('app.availableEvents')}
                        </div>
                        <div
                            onClick={() => navigate("/ongoing-rewards")}
                            className="py-3 bg-[#37474F] min-w-[300px] text-center rounded-md text-white hover:font-bold hover:cursor-pointer max-w-[300px]"
                        >
                            {t('app.ongoingEvents')}
                        </div>
                        <div
                            onClick={() => navigate("/participated-rewards")}
                            className="py-3 bg-[#37474F] min-w-[300px] text-center rounded-md text-white hover:font-bold hover:cursor-pointer max-w-[300px]"
                        >
                            {t('app.participatedEvents')}
                        </div>
                        <div
                            onClick={() => navigate("/prize-i-won")}
                            className="py-3 bg-[#37474F] min-w-[300px] text-center rounded-md text-white hover:font-bold hover:cursor-pointer max-w-[300px]"
                        >
                            {t('app.prizeIWon')}
                        </div>
                        <div
                            onClick={() => navigate("/profile")}
                            className="py-3 bg-[#37474F] min-w-[300px] text-center rounded-md text-white hover:font-bold hover:cursor-pointer max-w-[300px]"
                        >
                            {t('app.myProfile')}
                        </div>
                    </section>
                </main>
                <Footer />
            </div>
        </>
    );
}

export default App;
