import { useEffect, useState } from "react";

type AdvertiseBanner = {
    id: number;
    image: string;
    link: string;
    status: string;
    start_date: string;
    end_date: string;
    created_at: string;
    updated_at: string;
};

const Footer = () => {
    const [advertiseBanners, setAdvertiseBanners] = useState<AdvertiseBanner[]>([]);

    useEffect(() => {
        fetch("https://bonusforyou.org/api/advertiseBanner")
            .then((res) => res.json())
            .then((data) => {
                if (data.status) {
                    setAdvertiseBanners(data.data);
                }
            })
            .catch((error) => console.error("Error fetching advertise banners:", error));
    }, []);

    return (
        <section className="flex flex-col gap-4 mt-4 items-center pb-5">
            {advertiseBanners.map((banner) => (
                <a key={banner.id} href={banner.link} target="_blank" rel="noopener noreferrer">
                    <img
                        src={banner.image}
                        alt={`Advertisement ${banner.id}`}
                        className="rounded-lg shadow-lg w-[90vw] max-h-[120px] mx-auto"
                    />
                </a>
            ))}
        </section>
    );
};

export default Footer;