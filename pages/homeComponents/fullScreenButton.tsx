import React from "react";
import { useTheme } from "next-themes";

interface FullScreenButtonProp {
  fullScreenMode: boolean;
  setFullScreenMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const FullScreenButton = ({
  fullScreenMode,
  setFullScreenMode,
}: FullScreenButtonProp) => {
  const { resolvedTheme } = useTheme();

  return (
    <div
      onClick={() => setFullScreenMode(!fullScreenMode)}
      className={`hidden lg:flex absolute top-8 right-24 xl:right-8 xl:top-24 font-bold text-[17px] cursor-pointer justify-center items-center w-[40px] h-[40px] rounded-full ${resolvedTheme === "light"
        ? "text-white bg-black"
        : "text-black bg-white"
        }`}
    >
      {fullScreenMode ? "A" : "a"}
    </div>
  );
};

export default FullScreenButton;
