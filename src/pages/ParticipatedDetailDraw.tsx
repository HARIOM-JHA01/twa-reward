import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import WebApp from "@twa-dev/sdk";
import { IndividualDraw } from "../types/type";



export default function ParticipatedDrawEvent() {
    const { id } = useParams<{ id: string }>();
    const [rewardDetail, setRewardDetail] = useState<IndividualDraw | null>(null);

    useEffect(() => {
        WebApp.BackButton.show();

        WebApp.BackButton.onClick(() => {
            // go back
            window.history.back();
        });

        if (id) {
            fetch(`https://bonusforyou.org/api/user/ParticipatedDetail/${id}`)
                .then(response => response.json())
                .then(data => {
                    if (data.status) {
                        setRewardDetail(data.data);
                    } else {
                        console.error("Error fetching reward details:", data.message);
                    }
                })
                .catch(error => console.error("Error fetching reward details:", error));
        }
    }, [id]);

    if (!rewardDetail) {
        return <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
    </div>;    
    }

    return (
        <div className="bg-yellow-300">
            <Header />
            <main className="bg-yellow-300 flex flex-col w-full min-h-screen p-4">
                <a href="#" className="underline text-center text-2xl text-orange-500">Join Channel and View Details</a>
                <img src={rewardDetail.draw_image} alt={rewardDetail.draw_name} className="rounded my-3" />
                <h2 className="text-center text-black font-bold">Event Title:-</h2>
                <p className="text-center text-black border border-black p-2 rounded-lg">{rewardDetail.draw_name}</p>
                <h2 className="text-center text-black font-bold">Events Detail and Join Channel as Subscriber:</h2>
                <a
                    href={rewardDetail.channel_link || "#"}
                    className="text-center text-red-500 border border-black p-2 rounded-lg">{rewardDetail.prize_detail_link}</a>
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

                <h2 className="text-center text-black font-bold">Early Birds Prize:</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-center min-h-10 text-black p-2 rounded-lg border border-black">
                {rewardDetail.Prize_list.map((prize, index) => (
                        (Number(prize.e_no_of_prize) !== 0) && (
                            <li key={index} className="flex justify-between items-center">
                                <div className="flex-1">{prize.e_no_win_prize}</div>
                                <div className="flex-1">{prize.e_no_of_prize}</div>
                                <div className="flex-1">{prize.e_prize}</div>
                            </li>
                        )
                    ))}
                </ul>

                <h2 className="text-center text-black font-bold">Event Brief:</h2>
                <p
                    className="text-center text-black border border-black p-2 rounded-lg"
                    dangerouslySetInnerHTML={{ __html: rewardDetail.draw_detail }}
                />

                {/* <div className="flex justify-between items-center my-3">
                    <div
                        onClick={() => {
                            window.open(rewardDetail.verifiaction_link_0, '_blank');
                            console.log(rewardDetail.verifiaction_link_0);
                        }}
                        className="bg-green-600 p-2 rounded-lg text-white font-semibold"
                    >
                        VIEW POST TO JOIN PROGRAM
                    </div>
                    <div className="rounded-full w-12 h-12 bg-red-500 justify-center items-center flex">
                        <img className="w-6 h-6" src="/share.png" alt="" />
                    </div>
                </div>

                <h3 className="text-black">User Left to Join: {rewardDetail.join_user}</h3>

                <p className="text-center text-black text-sm p-4 rounded-lg">
                    View post, Join Channel and copy paste link, comebak and paste link to bonusforyou
                </p> */}

                <Footer />
            </main>
        </div>
    );
}
