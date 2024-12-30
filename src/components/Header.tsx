import { useNavigate } from "react-router-dom";

const Header = () => {

    const router = useNavigate();

    return (
        <header className="flex justify-between items-center pt-3 pl-3 pr-2 bg-[#37474F] pb-3">
            <img src="./bonus-logo.png" alt="" width={"30px"} height={"30px"} />
            <h1
            onClick={() => router("/")}
            className="text-white font-semibold cursor-pointer">Bonus For You</h1>
            <div className="flex gap-2">
                <img src="./hnkf.png" alt="" width={"30px"} height={"30px"} />
                <img
                    src="./privacy.png"
                    alt=""
                    width={"30px"}
                    height={"30px"}
                />
            </div>
        </header>
    );
};

export default Header;
