import React from "react";

const Header = () => {
    return (
        <header className="flex justify-between items-center pt-3 pl-3 pr-2 bg-[#37474F] pb-3">
            <img src="./bonus-logo.png" alt="" width={"30px"} height={"30px"} />
            <h1 className="text-white font-semibold">Bonus For You</h1>
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
