import React, { ReactNode } from "react";
import Line from "./line";

interface WrapperProp {
  children: ReactNode;
}

const Wrapper = ({ children }: WrapperProp) => {
  return (
    <div className="w-[100vw] h-[100vh] bg-[#EDDADA] relative overflow-x-hidden">
      <div className='w-full h-full overflow-hidden relative flex flex-col justify-center items-center'>
        <Line lineNumber={1} />
        <Line lineNumber={2} />
        <Line lineNumber={3} />
        <Line lineNumber={4} />
        <Line lineNumber={5} />
        <div className="px-12 mb-12 py-4 absolute bg-white text-[#2A1E1E] flex flex-col gap-3 justify-evenly items-center min-w-[350px] w-max rounded-[30px] h-max">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Wrapper;