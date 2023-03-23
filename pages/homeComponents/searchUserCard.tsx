import React from 'react';

interface SearchUserCardProp {
    setCloseDiv: (value: React.SetStateAction<boolean>) => void;
    itm: any;
    setsearchInputForUser: React.Dispatch<React.SetStateAction<string>>
}

const SearchUserCard = ({ setCloseDiv, itm, setsearchInputForUser }: SearchUserCardProp) => {
    return (
        <div onClick={() => { setCloseDiv(false); setsearchInputForUser('') }} id={`user#${itm._id}`} className={`bg-[#EDDADA] dark:bg-gray-600 w-[100%] rounded-lg h-[60px] mt-3 flex items-center gap-3 p-2`}>
            <img className="h-[40px] rounded-full border-2 border-gray-400 w-[40px]" src={itm?.profile ?? ""} />
            <h1 className="font-[600] text-[15px]">{itm?.fullName ?? ""}</h1>
        </div>
    )
}

export default SearchUserCard