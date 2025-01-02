import Header from "../components/Header";
import Footer from "../components/Footer";
import WebApp from "@twa-dev/sdk";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function Participated() {
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
                <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">{t('participated.title')}</h1>
                <p className="text-lg text-gray-800 mb-4 text-center">{t('participated.content')}</p>

                <h2 className="text-2xl font-semibold mb-2">{t('participated.freeParticipation')}</h2>
                <p className="mb-4">{t('participated.freeParticipationContent')}</p>

                <h2 className="text-2xl font-semibold mb-2">{t('participated.registrationRequirements')}</h2>
                <p className="mb-4">{t('participated.registrationRequirementsContent')}</p>

                <h2 className="text-2xl font-semibold mb-2">{t('participated.verificationForWinners')}</h2>
                <p className="mb-4">{t('participated.verificationForWinnersContent')}</p>
                <ul className="list-decimal list-inside mb-4">
                    <li>{t('participated.verificationForWinnersContent1')}</li>
                    <li>{t('participated.verificationForWinnersContent2')}</li>
                </ul>

                <h2 className="text-2xl font-semibold mb-2">{t('participated.notificationForWinners')}</h2>
                <p className="mb-4">{t('participated.notificationForWinnersContent')}</p>

                <h2 className="text-2xl font-semibold mb-2">{t('participated.reminderForParticipants')}</h2>
                <p className="mb-4">{t('participated.reminderForParticipantsContent')}</p>

                <p className="mb-4">{t('participated.thanks')}</p>

                <p className="mb-4 text-center font-semibold">{t('common.appName')}</p>
            </main>
            <Footer />
        </div>
    );
}