import React from "react";
import Loading from "./loading";

interface ButtonProp {
    label: string;
    loading: boolean;
    onClick(): Promise<void>;
}

const Button = ({ label, onClick, loading }: ButtonProp) => {
    return (
        <div onClick={loading ? () => { } : onClick} className={`${loading ? "opacity-60" : "opacity-100"} bg-[#2A1E1E] min-w-max max-w-[250px] w-full h-12 rounded-[15px] text-white text-center items-center justify-center flex`}>
            {loading ? <Loading /> : label}
        </div>
    );
};

export default Button;