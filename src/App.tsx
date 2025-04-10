import { useEffect, useState, useContext } from "react";
import WebApp from "@twa-dev/sdk";
import Header from "./components/Header";
import { useNavigate } from "react-router-dom";
import Footer from "./components/Footer";
import { UserContext } from "./context/UserContext";
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

    const [promotionBanner, setPromotionBanner] =
        useState<PromotionBanner | null>(null);
    const [countryCode, setCountryCode] = useState<string | null>(null); // State to store country code
    const [loading, setLoading] = useState(true); // Add a loading state
    const [loginFailed, setLoginFailed] = useState(false); // Add loginFailed state

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
            .catch((error) =>
                console.error("Error fetching promotion banner:", error)
            );

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
        // const telegram_id = "Telegram321654";
        const first_name = WebApp.initDataUnsafe.user?.first_name || "";
        const last_name = WebApp.initDataUnsafe.user?.last_name || "";
        const username = WebApp.initDataUnsafe.user?.username || "";
        // const telegram_id = "1111";

        if (telegram_id && countryCode) {
            // Ensure countryCode is fetched before making the login request
            console.log("Telegram ID:", telegram_id);
            console.log("Country Code:", countryCode);
            fetch("https://bonusforyou.org/api/user/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    telegram_id: telegram_id,
                    countryCode: countryCode,
                    first_name: first_name || "",
                    last_name: last_name || "",
                    username: username || "",
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.status) {
                        const userData = data.data;
                        console.log(userData);
                        setUser({
                            id: userData.id,
                            name: userData.name,
                            telegramId: userData.telegram_id,
                            country: userData.country,
                            uniqueId: userData.unique_id,
                        });
                        setIsLoggedIn(true);
                    } else {
                        console.error("Failed to fetch user data.");
                        setLoginFailed(true); // Set loginFailed to true
                    }
                })
                .catch((error) => {
                    console.error("Failed to fetch user data:", error);
                    setLoginFailed(true); // Set loginFailed to true
                })
                .finally(() => {
                    setLoading(false); // Set loading to false regardless of success or failure
                });
        } else if (!telegram_id) {
            console.error("Telegram ID not found.");
            setLoginFailed(true);
            setLoading(false);
        } else {
            setLoading(false); // Set loading to false when countryCode is not yet available
        }
    }, [setUser, setIsLoggedIn, countryCode]); // Add countryCode as a dependency

    const navigate = useNavigate();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (loginFailed) {
        return (
            <div className="flex justify-center items-center h-screen bg-yellow-300 text-black">
                Login Failed. Please try again later.
            </div>
        );
    }

    return (
        <>
            <Header />
            <div className="bg-yellow-300 min-h-screen flex flex-col z-10">
                <div className="text-center text-lg font-bold text-white bg-gray-500">
                    My Panel
                </div>
                <main className="bg-yellow-300 pt-4 flex flex-col justify-start items-center w-full flex-grow">
                    {promotionBanner && (
                        <img
                            src={headerImage}
                            alt={promotionBanner?.draw_name || ""}
                            className="rounded-lg shadow-lg w-[90vw] h-[120px] mx-auto"
                        />
                    )}

                    <section className="flex flex-col gap-4 mt-4 mb-4 items-center">
                        <div
                            onClick={() => navigate("/available-rewards")}
                            className="py-3 bg-[#37474F]  text-center rounded-md text-white hover:font-bold hover:cursor-pointer w-[90vw]"
                        >
                            {t("app.availableEvents")}
                        </div>
                        <div
                            onClick={() => navigate("/ongoing-rewards")}
                            className="py-3 bg-[#37474F] w-[90vw] text-center rounded-md text-white hover:font-bold hover:cursor-pointer"
                        >
                            {t("app.ongoingEvents")}
                        </div>
                        <div
                            onClick={() => navigate("/participated-rewards")}
                            className="py-3 bg-[#37474F] w-[90vw] text-center rounded-md text-white hover:font-bold hover:cursor-pointer"
                        >
                            {t("app.participatedEvents")}
                        </div>
                        <div
                            onClick={() => navigate("/prize-i-won")}
                            className="py-3 bg-[#37474F] w-[90vw] text-center rounded-md text-white hover:font-bold hover:cursor-pointer"
                        >
                            {t("app.prizeIWon")}
                        </div>
                        <div
                            onClick={() => navigate("/profile")}
                            className="py-3 bg-[#37474F] w-[90vw] text-center rounded-md text-white hover:font-bold hover:cursor-pointer"
                        >
                            {t("app.myProfile")}
                        </div>
                        <Footer />
                    </section>
                </main>
            </div>
        </>
    );
}

export default App;
