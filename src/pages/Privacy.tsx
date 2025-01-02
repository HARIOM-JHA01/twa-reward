import Header from "../components/Header";
import Footer from "../components/Footer";
import WebApp from "@twa-dev/sdk";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function Privacy() {
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
                <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">{t('privacy.title')}</h1>
                <p className="mb-4">{t('privacy.content')}</p>
                <h2 className="text-xl font-semibold mb-2">{t('privacy.programSubmitted')}</h2>
                <p className="mb-4">{t('privacy.programSubmittedContent')}</p>
                <h2 className="text-xl font-semibold mb-2">{t('privacy.programPosterWinnersData')}</h2>
                <p className="mb-4">{t('privacy.programPosterWinnersDataContent')}</p>
                <h2 className="text-xl font-semibold mb-2">{t('privacy.forParticipants')}</h2>
                <p className="mb-4">{t('privacy.forParticipantsContent')}</p>
                <h2 className="text-xl font-semibold mb-2">{t('privacy.email')}</h2>
                <p className="mb-4">{t('privacy.emailContent')}</p>
                <h2 className="text-xl font-semibold mb-2">{t('privacy.telegramId')}</h2>
                <p className="mb-4">{t('privacy.telegramIdContent')}</p>
                <p className="mb-4 text-center font-semibold">{t('privacy.app')}</p>
            </main>
            <Footer />
        </div>
    );
}