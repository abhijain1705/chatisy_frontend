import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";
import { UserSelector } from "../redux/userSlice";
import Modal from "../homeComponents/modal";
import { useTheme } from "next-themes";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import ThemeButton from "../homeComponents/themeButton";
import FullScreenButton from "../homeComponents/fullScreenButton";
import UserCard from "../homeComponents/userCard";
import Loading from "../components/loading";
import SearchUserCard from "../homeComponents/searchUserCard";
import CodePopup from "../featurePopup/codePopup";
import ImagePopup from "../featurePopup/imagePopup";
import TextPopup from "../featurePopup/textPopup";
import { addMessage, listenForChatUpdates } from "../firebase";
import { storage } from "../firebase";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import ContentWrapper from "../homeComponents/contentWrapper";

const HomeScreen = () => {
    const selector = useSelector((state: UserSelector) => state.user);

    const [showModal, setshowModal] = useState(false);
    const { resolvedTheme } = useTheme();
    const [fullScreenMode, setfullScreenMode] = useState(false);
    const [showSearchResultBox, setshowSearchResultBox] = useState(false);
    const [searchInputForUser, setsearchInputForUser] = useState("");
    const [showUserProfile, setshowUserProfile] = useState(false);

    const featureArray = [
        "/code",
        "/link",
        "/image",
        "/h1",
        "/h2",
        "/h3",
        "/h4",
        "/h5",
        "/h6",
        "/p",
    ];
    const [userArray, setuserArray] = useState([]);
    const [chatArray, setchatArray] = useState([{ ...selector }]);
    const [currentUserChat, setcurrentUserChat] = useState(
        `chat#${selector._id}`
    );
    const [currentOpenedUsersChat, setcurrentOpenedUsersChat] = useState<any>([
        { ...selector },
    ]);
    const [showFeatureBox, setshowFeatureBox] = useState(false);
    const [message, setmessage] = useState("");
    const [content, setcontent] = useState("");
    const [sendMessageLoading, setsendMessageLoading] = useState(false);
    const [imageContent, setimageContent] = useState<File | null>(null);
    const [chatHistory, setchatHistory] = useState<any>([]);
    const [showUserChatInSmallScreen, setshowUserChatInSmallScreen] =
        useState(false);
    const [loadingUsers, setloadingUsers] = useState(false);
    const [whichFeaturePopupToShow, setwhichFeaturePopupToShow] = useState<
        | "code"
        | "image"
        | ""
        | "p"
        | "h1"
        | "h2"
        | "h3"
        | "h4"
        | "h5"
        | "h6"
        | "link"
    >("");

    async function handleLogin() {
        try {
            if (searchInputForUser.length === 0) return;
            setloadingUsers(true);
            let res = await axios.get(
                `https://chatisy-backend.onrender.com/users/users/${searchInputForUser}`
            );
            setuserArray(res.data);
            setloadingUsers(false);
        } catch (error) {
            setloadingUsers(false);
            console.log(error);
            toast.error("error occured, try again later.");
        }
    }

    function handleInitiateNewChat(e: any) {
        let currId = "";
        if (e.target.nodeName === "IMG" || e.target.nodeName === "H1") {
            currId = e.target.parentNode.id.split("user#")[1];
        } else {
            currId = e.target.id.split("user#")[1];
        }
        let pushedArray = userArray.filter((itm: any) => itm._id === currId);
        setchatArray((prev) => [...prev, ...pushedArray]);
    }

    useEffect(() => {
        if (selector.profile === "" || selector.about === "") {
            setshowModal(true);
        } else {
            setshowModal(false);
        }
    }, []);

    function handleSelectChat(e: any) {
        if (e.target.id === "userScroll") {
            return;
        } else {
            let chatId = "";
            if (e.target.nodeName === "IMG" || e.target.nodeName === "H1") {
                chatId = e.target.parentNode.id.split("chat#")[1];
            } else {
                chatId = e.target.id.split("chat#")[1];
            }
            setcurrentUserChat(`chat#${chatId}`);
            setcurrentOpenedUsersChat(chatArray.filter((itm) => itm._id === chatId));
        }
    }

    function hideOrShowResultBox() {
        if (fullScreenMode) {
            setfullScreenMode(false);
        }
        if (searchInputForUser.length > 0 && !fullScreenMode) {
            setshowSearchResultBox(true);
            handleLogin();
        }
    }

    useEffect(() => {
        if (searchInputForUser.length == 0) {
            setshowSearchResultBox(false);
        }
    }, [searchInputForUser]);

    const dispatch = useDispatch();
    function logoutMethod() {
        dispatch(logout());
    }

    function handleSelectingChatFeature(e: any) {
        setmessage(e.target.innerText);
        setshowFeatureBox(false);
    }

    function callBackToSaveContent(value: string) {
        setcontent(value);
    }

    async function sendMessage() {
        try {
            setsendMessageLoading(true);
            if (whichFeaturePopupToShow === "image") {
                const imageRef = ref(storage, `messages/${selector._id}_${new Date()}`);
                await uploadBytes(imageRef, imageContent!)
                    .then((snapshot) => {
                        getDownloadURL(snapshot.ref).then(async (url) => {
                            await addMessage(
                                selector._id,
                                currentOpenedUsersChat[0]?._id ?? "no_id",
                                new Date(),
                                `[image]${url}[/image]`,
                                selector._id
                            );
                        });
                    })
                    .catch((err: any) => {
                        console.log(err);
                        setsendMessageLoading(false);
                    });
            } else {
                let message = `[${whichFeaturePopupToShow}]${content}[/${whichFeaturePopupToShow}]`;
                await addMessage(
                    selector._id,
                    currentOpenedUsersChat[0]?._id ?? "no_id",
                    new Date(),
                    message,
                    selector._id
                );
            }
            setsendMessageLoading(false);
            setmessage("");
            setwhichFeaturePopupToShow("");
        } catch (error) {
            console.log(error);
            toast.error("error occured.");
            setwhichFeaturePopupToShow("");
            setmessage("");
            setsendMessageLoading(false);
        }
    }

    useEffect(() => {
        try {
            (async function () {
                let id = currentUserChat.split("chat#")[1];
                await listenForChatUpdates(selector._id, id, (value) => {
                    setchatHistory(value);
                });
            })();
        } catch (error) {
            toast.error("error occured.");
        }
    }, [currentUserChat]);

    function handleInputMessageLogic(e: React.ChangeEvent<HTMLInputElement>) {
        let foundFeature = featureArray.filter((itm) => itm === e.target.value);

        if (foundFeature.length > 0) {
            if (foundFeature[0] === "/code") {
                setwhichFeaturePopupToShow("code");
            } else if (foundFeature[0] === "/image") {
                setwhichFeaturePopupToShow("image");
            } else if (foundFeature[0] === "/h1") {
                setwhichFeaturePopupToShow("h1");
            } else if (foundFeature[0] === "/h2") {
                setwhichFeaturePopupToShow("h2");
            } else if (foundFeature[0] === "/h3") {
                setwhichFeaturePopupToShow("h3");
            } else if (foundFeature[0] === "/h4") {
                setwhichFeaturePopupToShow("h4");
            } else if (foundFeature[0] === "/h5") {
                setwhichFeaturePopupToShow("h5");
            } else if (foundFeature[0] === "/h6") {
                setwhichFeaturePopupToShow("h6");
            } else if (foundFeature[0] === "/p") {
                setwhichFeaturePopupToShow("p");
            } else if (foundFeature[0] === "/link") {
                setwhichFeaturePopupToShow("link");
            }
            setshowFeatureBox(false);
            setmessage(e.target.value);
            return;
        } else {
            setshowFeatureBox(false);
            setwhichFeaturePopupToShow("");
        }

        if (e.target.value[0] === "/") {
            setshowFeatureBox(true);
            setmessage(e.target.value);
        } else {
            setshowFeatureBox(false);
            setmessage("");
        }
    }

    function closeUserSearchResultOnBackdrop() {
        if (showSearchResultBox) {
            setshowSearchResultBox(false);
        }
    }

    return (
        <div
            onClick={closeUserSearchResultOnBackdrop}
            className={`relative w-[100vw] h-[100vh] flex items-center justify-center`}
        >
            <ToastContainer />
            <ThemeButton />
            <FullScreenButton
                setFullScreenMode={setfullScreenMode}
                fullScreenMode={fullScreenMode}
            />
            {/* code popups */}
            <CodePopup
                callBackToSaveContent={callBackToSaveContent}
                whichFeaturePopupToShow={whichFeaturePopupToShow}
            />
            <ImagePopup
                imageContent={imageContent}
                setimageContent={setimageContent}
                whichFeaturePopupToShow={whichFeaturePopupToShow}
            />
            <TextPopup
                callBackToSaveContent={callBackToSaveContent}
                whichFeaturePopupToShow={whichFeaturePopupToShow}
            />
            {/* code popups */}
            {showModal && <Modal setshowModal={setshowModal} />}
            <div
                className={`${showModal ? "opacity-0" : "opacity-100"
                    } w-[95%] lg:w-[90%] xl:w-[80%] h-[80%] mx-auto flex items-center justify-between`}
            >
                {/*  */}
                <div
                    className={`h-max lg:h-[100%] w-[60%] mx-auto ${fullScreenMode ? "lg:w-[5%]" : "lg:w-[25%]"
                        } flex flex-col absolute top-8 left-16 lg:left-0 lg:relative items-center justify-between ease-in duration-300`}
                >
                    <div className="w-[100%] h-[6%] flex items-center relative">
                        <input
                            onChange={(e) => setsearchInputForUser(e.target.value)}
                            type={"text"}
                            placeholder="search user"
                            value={searchInputForUser}
                            className={`p-2 rounded-lg ease-in duration-300 border-2 border-blue-600 w-[100%] ${fullScreenMode ? "lg:w-[0%] lg:opacity-0" : "lg:w-[100%]"
                                }`}
                        />
                        <svg
                            onClick={() => {
                                hideOrShowResultBox();
                            }}
                            fill="none"
                            className={`absolute right-2 ${fullScreenMode &&
                                "bg-gray-400 ease-in duration-300 rounded-full h-max w-max p-2"
                                }`}
                            color={resolvedTheme === "light" ? "black" : "white"}
                            stroke="currentColor"
                            width={20}
                            height={20}
                            stroke-width="1.5"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                            ></path>
                        </svg>
                    </div>

                    <div
                        onClick={(e) => handleInitiateNewChat(e)}
                        className={`border-2 border-blue-600 w-[100%] overflow-y-auto ${showSearchResultBox ? "flex" : "hidden"
                            } flex-col items-center justify-center h-[200px] rounded-lg bg-[#3b3b3b] top-12 z-40 absolute`}
                    >
                        {loadingUsers ? (
                            <Loading />
                        ) : (
                            userArray.map((itm, ind) => (
                                <SearchUserCard
                                    key={ind}
                                    setsearchInputForUser={setsearchInputForUser}
                                    itm={itm}
                                    setCloseDiv={setshowSearchResultBox}
                                />
                            ))
                        )}
                    </div>

                    <div
                        onClick={(e) => handleSelectChat(e)}
                        className="w-[100%] hidden lg:flex flex-row lg:flex-col z-20 rounded-lg h-[90%] overflow-y-auto noScroll"
                    >
                        {chatArray.map((itm, ind) => {
                            return (
                                <UserCard
                                    fullScreenMode={fullScreenMode}
                                    itm={itm}
                                    key={ind}
                                    currentUserChat={currentUserChat}
                                />
                            );
                        })}
                    </div>
                </div>
                {/*  */}
                <div
                    className={`${fullScreenMode && showUserProfile
                        ? "lg:w-[70%]"
                        : fullScreenMode
                            ? "lg:w-[90%]"
                            : showUserProfile
                                ? "lg:w-[50%]"
                                : "lg:w-[70%]"
                        } bg-[#EDDADA] w-[90%] mx-auto dark:bg-gray-700 relative h-[100%] rounded-lg flex flex-col items-center ease-in duration-300 justify-center`}
                >
                    <div className="absolute w-[100%] h-[50px] flex justify-between items-center p-2 border-b-[1px] border-gray-500 gap-3 top-0">
                        <div className="flex gap-2 items-center w-max">
                            <img
                                onClick={() => setshowUserProfile(!showUserProfile)}
                                className="h-[40px] rounded-full border-2 border-blue-600 w-[40px]"
                                src={currentOpenedUsersChat[0]?.profile ?? ""}
                            />
                            <div className="font-[600] whitespace-nowrap text-[15px]">
                                {currentOpenedUsersChat[0]?.fullName ?? ""}
                            </div>
                            <svg
                                className="flex lg:hidden"
                                onClick={() =>
                                    setshowUserChatInSmallScreen(!showUserChatInSmallScreen)
                                }
                                width={20}
                                height={20}
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1.5"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                                ></path>
                            </svg>
                        </div>
                        {/* logout */}
                        <svg
                            onClick={logoutMethod}
                            fill="none"
                            width={20}
                            height={20}
                            stroke="currentColor"
                            stroke-width="1.5"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                            ></path>
                        </svg>
                    </div>

                    <div
                        onClick={(e) => handleSelectingChatFeature(e)}
                        className={`${showFeatureBox ? "flex" : "hidden"
                            } noScroll flex-col w-[90%] mx-auto h-max max-h-[200px] bg-white dark:bg-gray-800 bottom-20 z-20 rounded-lg overflow-auto items-start absolute`}
                    >
                        {featureArray.map((itm, ind) => (
                            <div
                                className={`${message === itm ? "bg-[#EDDADA] dark:bg-gray-900" : ""
                                    } h-[50px] hover:bg-[#EDDADA] hover:dark:bg-gray-900 w-[100%] p-3`}
                                key={ind}
                            >
                                {itm}
                            </div>
                        ))}
                    </div>

                    <div
                        className={`${showUserChatInSmallScreen ? "flex" : "hidden"
                            } noScroll flex-col w-[90%] mx-auto h-max max-h-[200px] bg-gray-900 top-20 z-20 rounded-lg overflow-auto items-start absolute`}
                    >
                        {chatArray.map((itm, ind) => {
                            return (
                                <SearchUserCard
                                    key={ind}
                                    setsearchInputForUser={setsearchInputForUser}
                                    itm={itm}
                                    setCloseDiv={setshowUserChatInSmallScreen}
                                />
                            );
                        })}
                    </div>

                    <div className="w-[100%] h-[75%] overflow-y-auto flex flex-col my-2">
                        {chatHistory.map((itm: any, ind: number) => {
                            return (
                                <ContentWrapper key={ind} itm={itm}>{itm.message}</ContentWrapper>
                            )
                        })}
                    </div>

                    <div className="w-[90%] mx-auto h-[10%] flex items-center absolute bottom-4">
                        <input
                            type={"text"}
                            value={message}
                            onChange={(e) => handleInputMessageLogic(e)}
                            placeholder="start with / to start typing.."
                            className="p-2 w-[100%] rounded-lg border-2 border-blue-600 focus:outline-0"
                        />
                        {sendMessageLoading ? (
                            <Loading />
                        ) : (
                            <svg
                                onClick={sendMessageLoading ? () => { } : sendMessage}
                                fill="none"
                                className="ml-2 bg-blue-600 p-2 cursor-pointer hover:bg-blue-500 rounded-lg w-[40px] h-[40px]"
                                color={resolvedTheme === "light" ? "black" : "white"}
                                stroke="currentColor"
                                width={15}
                                height={15}
                                stroke-width="1.5"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                                ></path>
                            </svg>
                        )}
                    </div>
                </div>
                {/*  */}
                <div
                    className={`${showUserProfile ? "lg:w-[20%] flex" : "lg:w-[0%] hidden"
                        } w-[50%] sm:w-[40%] md:w-[20%] z-20 absolute left-1/2 transform -translate-x-1/2 lg:static lg:left-auto lg:transform-none p-2 border-2 border-gray-300 ease-in flex-col gap-2 items-center duration-300 rounded-lg lg:h-[100%] bg-[#EDDADA] dark:bg-gray-700`}
                >
                    <img
                        className="rounded-full border-2 mx-auto border-gray-400 w-[100px] h-[100px]"
                        src={currentOpenedUsersChat[0]?.profile ?? ""}
                    />
                    <div className="font-[600] text-[15px]">
                        {currentOpenedUsersChat[0]?.fullName ?? ""}
                    </div>
                    <div className="font-[600] opacity-80 text-[15px]">
                        {currentOpenedUsersChat[0]?.about ?? ""}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeScreen;
