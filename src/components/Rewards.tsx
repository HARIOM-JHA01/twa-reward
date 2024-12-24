import React from "react";

const Rewards = ({ pageName }: { pageName: string }) => {
    return (
        <div>
            <section className="text-center bg-[#37474F]">
                <h2>{pageName ? pageName : "Rewards Page"}</h2>
            </section>
        </div>
    );
};

export default Rewards;
