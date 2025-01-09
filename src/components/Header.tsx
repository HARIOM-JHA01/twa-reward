import {  useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Header = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const router = useNavigate();
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLanguage = i18n.language === 'en' ? 'zh' : 'en';
        i18n.changeLanguage(newLanguage);
    };


    return (
        <header className="flex justify-between items-center pt-3 pl-3 pr-2 bg-[#37474F] pb-3">
            <img src="./bonus-logo.png" alt="" width={"30px"} height={"30px"} />
            <h1
                onClick={() => router("/")}
                className="text-white font-semibold cursor-pointer"
            >
                BonusForYou
            </h1>
            
            <div className="relative flex gap-2">
            <img
                src="./hnkf.png"
                alt="Toggle Language"
                width={"30px"}
                height={"30px"}
                onClick={toggleLanguage}
                className="cursor-pointer "
            />
                <img
                    src="./privacy.png"
                    alt=""
                    width={"30px"}
                    height={"30px"}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="cursor-pointer"
                />
                {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg">
                        <ul>
                            <li
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                    setDropdownOpen(false);
                                    router("/participated");
                                }}
                            >
                                Participated
                            </li>
                            <li
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                    setDropdownOpen(false);
                                    router("/merchant");
                                }}
                            >
                                Merchant
                            </li>
                            <li
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                    setDropdownOpen(false);
                                    router("/privacy");
                                }}
                            >
                                Privacy Policy
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
