import Header from "../components/Header";
import Footer from "../components/Footer";
import WebApp from "@twa-dev/sdk";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function Merchant() {
    const { t } = useTranslation();

    useEffect(() => {
        WebApp.BackButton.show();

        WebApp.BackButton.onClick(() => {
            window.history.back();
            // WebApp.close();
        });
    }, []);

    return (
        <div className="bg-yellow-300">
            <Header />
            <main className="bg-yellow-300 pt-8 flex flex-col w-full p-4">
                <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">{t('merchant.title')}</h1>
                <p className="text-lg text-gray-800 mb-4 text-center">{t('merchant.content')}</p>

                <h2 className="text-2xl font-semibold mb-2">{t('merchant.accountVerification')}</h2>
                <p className="mb-4">{t('merchant.accountVerificationContent')}</p>

                <h2 className="text-2xl font-semibold mb-2">{t('merchant.rewards')}</h2>
                <p className="mb-4">{t('merchant.rewardsContent1')}</p>
                <p className="mb-4">{t('merchant.rewardsContent2')}</p>

                <h2 className="text-2xl font-semibold mb-2">{t('merchant.bonusForYou')}</h2>
                <p className="mb-4">{t('merchant.bonusForYouContent1')}</p>
                <p className="mb-4">{t('merchant.bonusForYouContent2')}</p>

                <h2 className="text-2xl font-semibold mb-2">{t('merchant.eventsApplySchedule')}</h2>
                <p className="mb-4">{t('merchant.eventsApplyScheduleContent')}</p>

                <h2 className="text-2xl font-semibold mb-2">{t('merchant.eventsPeriods')}</h2>
                <p className="mb-4">{t('merchant.eventsPeriodsContent')}</p>

                <h2 className="text-2xl font-semibold mb-2">{t('merchant.drawPrizePeriods')}</h2>
                <p className="mb-4">{t('merchant.drawPrizePeriodsContent')}</p>

                <h2 className="text-2xl font-semibold mb-2">{t('merchant.prizeSetting')}</h2>
                <p className="mb-4">{t('merchant.prizeSettingContent')}</p>
                <p className="mb-4">{t('merchant.prizeSettingExample')}</p>
                <ul className="list-disc list-inside mb-4">
                    <li>{t('merchant.prizeSettingFirstPrize')}</li>
                    <li>{t('merchant.prizeSettingSecondPrize')}</li>
                    <li>{t('merchant.prizeSettingThirdPrize')}</li>
                    <li>{t('merchant.prizeSettingFourthPrize')}</li>
                    <li>{t('merchant.prizeSettingFifthPrize')}</li>
                </ul>
                <p className="mb-4">{t('merchant.prizeSettingNote')}</p>

                <h2 className="text-2xl font-semibold mb-2">{t('merchant.prizeDelivery')}</h2>
                <p className="mb-4">{t('merchant.prizeDeliveryContent')}</p>

                <h2 className="text-2xl font-semibold mb-2">{t('merchant.eventsWinners')}</h2>
                <p className="mb-4">{t('merchant.eventsWinnersContent')}</p>

                <h2 className="text-2xl font-semibold mb-2">{t('merchant.membershipVerification')}</h2>
                <ul className="list-decimal list-inside mb-4">
                    <li>{t('merchant.membershipVerification1')}</li>
                    <li>{t('merchant.membershipVerification2')}</li>
                    <li>{t('merchant.membershipVerification3')}</li>
                    <li>{t('merchant.membershipVerification4')}</li>
                    <li>{t('merchant.membershipVerification5')}</li>
                </ul>

                <p className="mb-4">{t('merchant.membershipJoin')}</p>
                <p className="mb-4">{t('merchant.thanks')}</p>
                <p className="mb-4 text-center font-semibold">{t('merchant.team')}</p>
            </main>
            <Footer />
        </div>
    );
}