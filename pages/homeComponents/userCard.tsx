import React from 'react';

interface UserCardProp {
    itm: any;
    currentUserChat: string;
    fullScreenMode: boolean;
}

const UserCard = ({ itm, currentUserChat, fullScreenMode }: UserCardProp) => {

    return (
        <div id={`chat#${itm._id}`} className={`${currentUserChat === `chat#${itm._id}` ? "bg-blue-600" : "bg-[#EDDADA] dark:bg-gray-600"} w-[100%] rounded-lg h-[60px] mt-3 flex items-center gap-3 p-2`}>
            <img className="h-[40px] rounded-full border-2 border-gray-400 w-[40px]" src={itm.profile} />
            <h1 className={`font-[600] text-[15px] ${fullScreenMode ? "hidden" : "flex"}`}>{itm.fullName}</h1>
        </div>
    )
}

export default UserCard;