import { useEffect, useState } from "react";
import WebApp from "@twa-dev/sdk";
import { useNavigate } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";

type PromotionBanner = {
    draw_image: string;
    draw_name: string;
};

function App() {
    useEffect(() => {
        WebApp.ready();
    }, []);

    

    const [promotionBanner, setPromotionBanner] = useState<PromotionBanner | null>(null);

    useEffect(() => {
        fetch("https://bonusforyou.org/api/PromotionBannerlist")
            .then((res) => res.json())
            .then((data) => {
                if (data.status) {
                    setPromotionBanner(data.data);
                }
            })
            .catch((error) => console.error("Error fetching promotion banner:", error));
    }, []);

    const navigate = useNavigate();

    return (
        <div>
            <Header />

            <main className="bg-yellow-300 pt-8 flex flex-col justify-center items-center h-[90vh] w-full">
                {promotionBanner && (
                    <img
                        src={promotionBanner.draw_image}
                        alt={promotionBanner.draw_name}
                        className="rounded-lg shadow-lg w-[80vw] h-[30vh] mx-auto"
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
                        onClick={() => navigate("/rewards")}
                        className="py-3 bg-[#37474F] min-w-[300px] text-center rounded-md text-white hover:font-bold hover:cursor-pointer max-w-[300px]"
                    >
                        Participated Events
                    </div>
                    <div
                        onClick={() => navigate("/rewards")}
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

                <Footer />
            </main>
        </div>
    );
}

export default App;