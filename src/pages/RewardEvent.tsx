import Header from "../components/Header";
import Footer from "../components/Footer";
import { useContext, useEffect, useState, useRef, useCallback } from "react"; // Added useCallback
import { useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { IndividualDraw } from "../types/type";
import WebApp from "@twa-dev/sdk";

export default function RewardEvent() {
    const { id } = useParams<{ id: string }>();
    const [rewardDetail, setRewardDetail] = useState<IndividualDraw | null>(
        null
    );
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [verificationLink, setVerificationLink] = useState("");
    const [isWithinDateRange, setIsWithinDateRange] = useState(false);
    const [countdown, setCountdown] = useState<string>("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [hasJoined, setHasJoined] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [timeOffset, setTimeOffset] = useState<number>(0);

    // Assuming shareImage path is correct relative to public folder or handled by build process
    const shareImage = "/reward-monster/share.png";

    // FIX 1: Use ReturnType<typeof setInterval> instead of NodeJS.Timeout
    const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
        null
    );

    const userContext = useContext(UserContext);
    if (!userContext) {
        throw new Error("UserContext must be used within a UserProvider");
    }
    const { user } = userContext;

    const getCurrentEstimatedUTCTime = () => Date.now() + timeOffset;

    const parseServerDateAsUTC = (dateStr: string): Date | null => {
        if (!dateStr || typeof dateStr !== "string") {
            console.warn("Invalid date string provided:", dateStr);
            return null;
        }
        let isoStr = dateStr.trim().replace(" ", "T");
        if (isoStr.length === 16) {
            isoStr += ":00Z";
        } else if (isoStr.length === 19) {
            isoStr += "Z";
        } else {
            console.error("Unrecognized date format for UTC parsing:", dateStr);
            return null;
        }

        const date = new Date(isoStr);
        if (isNaN(date.getTime())) {
            console.error(
                "Failed to parse date string as UTC:",
                dateStr,
                "->",
                isoStr
            );
            return null;
        }
        return date;
    };

    // FIX 2: Define the handler function separately for onClick and offClick
    const handleBackButtonClick = useCallback(() => {
        window.history.back();
    }, []);

    useEffect(() => {
        WebApp.BackButton.show();
        WebApp.BackButton.onClick(handleBackButtonClick); // Pass the handler reference

        return () => {
            if (WebApp.BackButton.isVisible) {
                WebApp.BackButton.hide();
                // Pass the same handler reference to offClick
                WebApp.BackButton.offClick(handleBackButtonClick);
            }
        };
        // Add handleBackButtonClick to dependency array if it weren't for useCallback
    }, [handleBackButtonClick]);

    useEffect(() => {
        let isMounted = true;
        setIsLoading(true);
        setRewardDetail(null);
        setIsWithinDateRange(false);
        setCountdown("");
        setHasJoined(false);
        setErrorMessage("");
        if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
        }

        const fetchAndProcessData = async () => {
            if (!id) {
                if (isMounted) setIsLoading(false);
                console.error("No ID provided for reward event.");
                setErrorMessage("Reward Event ID is missing.");
                return;
            }

            let apiUTCTimeMs: number | null = null;
            let fetchedRewardDetail: IndividualDraw | null = null;

            try {
                // 1. Fetch UTC Time
                const timeRes = await fetch(
                    "https://bonusforyou.org/api/user/servercurrnettime"
                );
                if (!timeRes.ok) {
                    throw new Error(
                        `Server Time API error: ${timeRes.status} ${timeRes.statusText}`
                    );
                }

                const apiUTCStr = await timeRes.text();
                const cleanedApiUTCStr = apiUTCStr.replace(/^"|"$/g, "");
                console.log("API UTC Time String:", cleanedApiUTCStr);
                const parsedApiUTCTime = new Date(cleanedApiUTCStr);

                if (isNaN(parsedApiUTCTime.getTime())) {
                    throw new Error("Failed to parse UTC time from API");
                }
                apiUTCTimeMs = parsedApiUTCTime.getTime();

                const offset = apiUTCTimeMs - Date.now();
                if (isMounted) setTimeOffset(offset);
                console.log("API UTC Time:", parsedApiUTCTime.toISOString());
                console.log("Calculated Time offset (ms):", offset);

                console.log("Fetching reward details for id:", id);
                const rewardRes = await fetch(
                    `https://bonusforyou.org/api/user/rewardlistsingle/${id}`
                );
                if (!rewardRes.ok)
                    throw new Error(`Reward API error: ${rewardRes.status}`);
                const rewardJson = await rewardRes.json();

                if (!rewardJson.status || !rewardJson.data) {
                    throw new Error(
                        `Error fetching reward details: ${
                            rewardJson.message || "Data missing in response"
                        }`
                    );
                }
                fetchedRewardDetail = rewardJson.data as IndividualDraw;
                console.log("Reward details fetched:", fetchedRewardDetail);

                if (isMounted) {
                    setRewardDetail(fetchedRewardDetail);

                    // Ensure reward_id exists before calling
                    const rewardIdFromData =
                        fetchedRewardDetail?.Prize_list?.[0]?.reward_id;
                    if (user?.id && rewardIdFromData != null) {
                        // Check for null/undefined
                        // FIX 3: Convert rewardIdFromData to string
                        await checkIfAlreadyJoined(
                            String(user.id),
                            String(rewardIdFromData)
                        );
                    } else {
                        console.warn(
                            "Cannot check join status: Missing user ID or reward ID.",
                            user?.id,
                            rewardIdFromData
                        );
                        setHasJoined(false);
                    }

                    updateEventStatus(
                        fetchedRewardDetail.start_date,
                        fetchedRewardDetail.end_date,
                        apiUTCTimeMs
                    );
                }
            } catch (error) {
                console.error("Error during data fetching:", error);
                if (isMounted) {
                    setErrorMessage(
                        error instanceof Error
                            ? error.message
                            : "An unknown error occurred while loading data."
                    );
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchAndProcessData();

        return () => {
            isMounted = false;
            console.log("RewardEvent effect cleanup for ID:", id);
            if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
                countdownIntervalRef.current = null;
                console.log(
                    "Countdown interval cleared on main effect cleanup."
                );
            }
        };
    }, [id, user?.id]); // Keep dependency array minimal

    const updateEventStatus = (
        startDateStr: string,
        endDateStr: string,
        currentUTCTimeMs: number
    ) => {
        const startDate = parseServerDateAsUTC(startDateStr);
        const endDate = parseServerDateAsUTC(endDateStr);
        const currentTime = new Date(currentUTCTimeMs);

        console.log("--- Date Check ---");
        console.log("Current Time (from API):", currentTime.toUTCString());
        console.log("Raw Start Date Str:", startDateStr);
        console.log(
            "Parsed Start Date UTC:",
            startDate?.toUTCString() ?? "Invalid"
        );
        console.log("Raw End Date Str:", endDateStr);
        console.log(
            "Parsed End Date UTC:",
            endDate?.toUTCString() ?? "Invalid"
        );

        if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
        }
        setCountdown("");

        if (!startDate || !endDate) {
            console.error(
                "Invalid start or end date provided. Cannot determine event status."
            );
            setIsWithinDateRange(false);
            setErrorMessage("Event start/end date is invalid.");
            return;
        }

        const startMs = startDate.getTime();
        const endMs = endDate.getTime();

        const isNowWithinRange =
            currentUTCTimeMs >= startMs && currentUTCTimeMs <= endMs;
        const hasStarted = currentUTCTimeMs >= startMs;
        const hasEnded = currentUTCTimeMs > endMs;

        console.log("Has Started:", hasStarted);
        console.log("Is Within Range:", isNowWithinRange);
        console.log("Has Ended:", hasEnded);
        console.log("--- End Date Check ---");

        setIsWithinDateRange(isNowWithinRange);

        if (!hasStarted) {
            console.log("Event hasn't started. Starting countdown.");
            calculateCountdown(startMs);
        } else if (hasEnded) {
            console.log("Event has ended.");
        } else {
            console.log("Event is active.");
        }
    };

    // Explicitly type rewardId as string here
    const checkIfAlreadyJoined = async (userId: string, rewardId: string) => {
        // No need for the null check again as it's done before calling
        console.log(
            `Checking join status for user ${userId}, reward ${rewardId}`
        );
        try {
            const response = await fetch(
                `https://bonusforyou.org/api/user/CheckUserJoinReward/${userId}/${rewardId}`,
                { cache: "no-store" }
            );
            if (!response.ok) {
                console.error(
                    `Check join status HTTP error! Status: ${response.status}`
                );
                setHasJoined(false);
                return;
            }
            const data = await response.json();
            console.log("CheckUserJoinReward response:", data);
            const joined = data === 1;
            setHasJoined(joined);
            console.log("Setting hasJoined state to:", joined);
        } catch (error) {
            console.error("Error checking join status:", error);
            setHasJoined(false);
        }
    };

    const calculateCountdown = (startUTCms: number) => {
        if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
        }

        console.log("Starting new countdown interval...");
        countdownIntervalRef.current = setInterval(() => {
            const nowEstimatedUTC = getCurrentEstimatedUTCTime();
            const timeDiff = startUTCms - nowEstimatedUTC;

            if (timeDiff <= 0) {
                setCountdown("");
                if (countdownIntervalRef.current) {
                    clearInterval(countdownIntervalRef.current);
                    countdownIntervalRef.current = null;
                }
                setIsWithinDateRange(true);
                console.log("Countdown finished via interval. Event active.");
            } else {
                const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
                const seconds = Math.floor((timeDiff / 1000) % 60);
                setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
            }
        }, 1000);
    };

    const handleJoinClick = () => {
        if (rewardDetail?.verifiaction_link_0) {
            WebApp.openLink(rewardDetail.verifiaction_link_0);
        }
        setIsModalOpen(true);
    };

    const handleModalSubmit = () => {
        if (!rewardDetail || !user?.id) {
            console.error(
                "Cannot submit join: Missing reward details or user ID."
            );
            setErrorMessage("Cannot submit: Missing required information.");
            setShowErrorModal(true);
            setIsModalOpen(false);
            setTimeout(() => setShowErrorModal(false), 5000);
            return;
        }
        const currentRewardId = rewardDetail.Prize_list?.[0]?.reward_id;
        // Check for null/undefined explicitly
        if (currentRewardId == null) {
            console.error(
                "Cannot join: Reward ID is missing in reward details."
            );
            setErrorMessage(
                "Cannot join: Event configuration error (missing Reward ID)."
            );
            setShowErrorModal(true);
            setIsModalOpen(false);
            setTimeout(() => setShowErrorModal(false), 5000);
            return;
        }

        const payload = {
            user_id: user.id,
            Draw_id: String(currentRewardId),
            Verification_link: verificationLink.toLowerCase(),
        };
        console.log("Submitting join payload:", payload);

        if (!verificationLink || !verificationLink.trim().startsWith("http")) {
            setErrorMessage(
                "Please enter a valid verification link starting with http/https."
            );
            setShowErrorModal(true);
            setTimeout(() => setShowErrorModal(false), 5000);
            return;
        }

        fetch(`https://bonusforyou.org/api/user/joinReward`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status) {
                    console.log("Joined successfully");
                    setIsModalOpen(false);
                    setShowSuccessModal(true);
                    setHasJoined(true);
                    setVerificationLink("");
                    setTimeout(() => {
                        setShowSuccessModal(false);
                    }, 5000);
                } else {
                    console.error("API Error joining reward:", data.message);
                    setIsModalOpen(false);
                    setShowErrorModal(true);
                    setErrorMessage(
                        data.message ||
                            "Failed to join event. Please check the link or try again."
                    );
                    setTimeout(() => {
                        setShowErrorModal(false);
                    }, 10000);
                }
            })
            .catch((error) => {
                console.error("Network/Fetch Error joining reward:", error);
                setIsModalOpen(false);
                setShowErrorModal(true);
                setErrorMessage(
                    "Failed to join event. Network error or server issue."
                );
                setTimeout(() => {
                    setShowErrorModal(false);
                }, 10000);
            });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!rewardDetail && !isLoading) {
        return (
            <div className="bg-yellow-300 min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow flex flex-col justify-center items-center p-4">
                    <p className="text-center text-red-600 font-bold text-lg bg-white p-4 rounded-lg shadow">
                        Error loading reward details.
                    </p>
                    {errorMessage && (
                        <p className="text-center text-red-500 mt-2 text-sm">
                            Details: {errorMessage}
                        </p>
                    )}
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 bg-blue-500 text-white p-2 rounded-lg"
                    >
                        Try Again
                    </button>
                </main>
                <Footer />
            </div>
        );
    }
    if (!rewardDetail) return null;

    return (
        <div className="bg-yellow-300">
            <Header />
            <main className="bg-yellow-300 flex flex-col w-full min-h-screen p-4">
                <img
                    src={rewardDetail.draw_image || "/placeholder.png"}
                    alt={rewardDetail.draw_name}
                    className="rounded-lg shadow-lg w-[90vw] h-[120px] mx-auto my-3 object-fill"
                    onError={(e) => {
                        e.currentTarget.src = "/placeholder.png";
                    }}
                />
                <h2 className="text-center text-black font-bold">
                    Event Title:
                </h2>
                <p className="text-center text-black border border-black p-2 rounded-lg">
                    {rewardDetail.draw_name}
                </p>
                <h2 className="text-center text-black font-bold">
                    Events Detail and Join Channel as Subscriber:
                </h2>
                <a
                    href={rewardDetail.prize_detail_link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-center text-red-500 border border-black p-2 rounded-lg"
                >
                    {rewardDetail.prize_detail_link || "Link not available"}
                </a>

                <h2 className="text-center text-black font-bold">Prizes:</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-center text-black p-2 rounded-lg border border-black">
                    {rewardDetail.Prize_list.map((prize, index) => (
                        <li
                            key={index}
                            className="flex justify-between items-center"
                        >
                            <div className="flex-1">{prize.no_win_prize}</div>
                            <div className="flex-1">{prize.no_of_prize}</div>
                            <div className="flex-1">{prize.prize}</div>
                        </li>
                    ))}
                    {rewardDetail.Prize_list.length === 0 && (
                        <li className="col-span-full text-center text-gray-500">
                            No prize details available.
                        </li>
                    )}
                </ul>

                {rewardDetail.Prize_list.some(
                    (prize) =>
                        prize.e_prize &&
                        Number(prize.e_no_of_prize || "0") !== 0
                ) && (
                    <>
                        <h2 className="text-center text-black font-bold">
                            Early Birds Prize:
                        </h2>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-center text-black p-2 rounded-lg border border-black">
                            {rewardDetail.Prize_list.filter(
                                (prize) =>
                                    prize.e_prize &&
                                    Number(prize.e_no_of_prize || "0") !== 0
                            ).map((prize, index) => (
                                <li
                                    key={`early-${index}`}
                                    className="flex justify-between items-center"
                                >
                                    <div className="flex-1">
                                        {prize.e_no_win_prize}
                                    </div>
                                    <div className="flex-1">
                                        {prize.e_no_of_prize}
                                    </div>
                                    <div className="flex-1">
                                        {prize.e_prize}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </>
                )}

                <h2 className="text-center text-black font-bold">
                    Event Brief:
                </h2>
                <p
                    className="text-center text-black border border-black p-2 rounded-lg min-h-10"
                    dangerouslySetInnerHTML={{
                        __html:
                            rewardDetail.draw_detail || "No details provided.",
                    }}
                />

                <h2 className="text-center text-black font-bold">
                    Draw to be performed on:
                </h2>
                <p className="text-center text-black border border-black p-2 rounded-lg text-lg">
                    {rewardDetail.winner_declare_date
                        ? new Date(
                              rewardDetail.winner_declare_date
                          ).toLocaleDateString("en-IN", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                          }) +
                          " @ " +
                          new Date(
                              rewardDetail.winner_declare_date
                          ).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                          }) +
                          " GMT"
                        : "Date not specified"}
                </p>

                {!hasJoined && isWithinDateRange && (
                    <div className="flex justify-center items-center my-3">
                        <button
                            onClick={handleJoinClick}
                            className="bg-green-600 p-2 rounded-lg text-white font-semibold"
                        >
                            VIEW POST TO JOIN PROGRAM
                        </button>
                    </div>
                )}

                {hasJoined && (
                    <div className="flex justify-center items-center my-3">
                        <p className="text-center text-green-700 font-bold bg-green-100 border border-green-300 p-2 rounded-lg">
                            ✅ You have already joined this event!
                        </p>
                    </div>
                )}

                {!isLoading &&
                    !isWithinDateRange &&
                    !countdown &&
                    rewardDetail.end_date &&
                    parseServerDateAsUTC(rewardDetail.end_date) &&
                    Date.now() + timeOffset >
                        parseServerDateAsUTC(
                            rewardDetail.end_date
                        )!.getTime() && (
                        <div className="flex justify-center items-center my-3">
                            <p className="text-center text-red-700 font-bold bg-red-100 border border-red-300 p-2 rounded-lg">
                                ❌ This event has ended.
                            </p>
                        </div>
                    )}

                {isWithinDateRange &&
                    !hasJoined &&
                    rewardDetail.join_user != null && (
                        <h3 className="text-black text-center my-2">
                            User Left to Join: {rewardDetail.join_user}
                        </h3>
                    )}

                {!hasJoined && !isWithinDateRange && countdown && (
                    <h3 className="text-center text-black font-bold text-2xl mt-3">
                        {countdown}
                    </h3>
                )}

                {!hasJoined && (
                    <p className="text-center text-black text-sm p-4 rounded-lg">
                        View Events Post Detail, Join Channel and Copy Events
                        Post Link, Come back and paste Link to BonusforYou
                    </p>
                )}

                {/* 
<div
    className="rounded-full w-12 h-12 bg-red-500 justify-center items-center flex mx-auto"
    onClick={() => {
        navigator.clipboard
            .writeText(window.location.href)
            .then(() =>
                WebApp.showAlert(
                    "Event link has been copied successfully. Paste it to telegram to share it with your friends"
                )
            )
            .catch((err) => {
                console.error("Failed to copy: ", err);
                WebApp.showAlert("Failed to copy link.");
            });
    }}
    role="button"
    tabIndex={0}
    title="Copy event link"
>
    <img className="w-6 h-6" src={shareImage} alt="Share" />
</div>
*/}

                <Footer />

                {isModalOpen && (
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                        <div className="bg-yellow-300 p-6 rounded-lg flex flex-col items-center">
                            <h2 className="text-center text-black font-bold mb-4">
                                Please input the verification Event Post Link:
                            </h2>
                            <input
                                type="text"
                                placeholder="Paste event post link here"
                                value={verificationLink}
                                onChange={(e) =>
                                    setVerificationLink(e.target.value)
                                }
                                className="w-full p-2 bg-yellow-300 border-2 border-black rounded mb-4"
                            />
                            <img
                                src={
                                    rewardDetail.draw_image ||
                                    "/placeholder.png"
                                }
                                alt={rewardDetail.draw_name}
                                className="rounded mb-4 max-h-32 object-contain"
                                onError={(e) => {
                                    e.currentTarget.src = "/placeholder.png";
                                }}
                            />
                            <div className="flex w-full justify-center space-x-4">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-gray-500 p-2 px-8 rounded-lg text-white font-semibold"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleModalSubmit}
                                    className="bg-green-600 p-2 px-10 rounded-lg text-white font-semibold"
                                    disabled={!verificationLink.trim()}
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showSuccessModal && (
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-lg flex flex-col items-center">
                            <h2 className="text-center text-black font-bold mb-4">
                                Joined Successfully!
                            </h2>
                            <img
                                src={
                                    rewardDetail.draw_image ||
                                    "/placeholder.png"
                                }
                                alt={rewardDetail.draw_name}
                                className="rounded mb-4 max-h-32 object-contain"
                                onError={(e) => {
                                    e.currentTarget.src = "/placeholder.png";
                                }}
                            />
                        </div>
                    </div>
                )}

                {showErrorModal && (
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                        <div className="bg-yellow-300 p-6 rounded-lg flex flex-col items-center">
                            <p className="text-center text-red-600 font-bold mb-3">
                                {errorMessage || "An unknown error occurred."}
                            </p>
                            <img
                                src={
                                    rewardDetail.draw_image ||
                                    "/placeholder.png"
                                }
                                alt={rewardDetail.draw_name}
                                className="rounded mb-4 max-h-32 object-contain"
                                onError={(e) => {
                                    e.currentTarget.src = "/placeholder.png";
                                }}
                            />
                            <button
                                onClick={() => setShowErrorModal(false)}
                                className="bg-red-600 p-2 px-8 rounded-lg text-white font-semibold mt-2"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
