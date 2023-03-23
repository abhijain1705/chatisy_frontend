import React, { useState } from "react";

interface TextPopupInterface {
    callBackToSaveContent(value: string): void;
    whichFeaturePopupToShow:
    | ""
    | "code"
    | "image"
    | "p"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "link";
}

const TextPopup = ({ whichFeaturePopupToShow, callBackToSaveContent }: TextPopupInterface) => {
    const [textContent, settextContent] = useState("");

    function swtichCaseToShowBox(key: string) {
        let out = false;
        switch (key) {
            case "p":
                out = true;
                break;
            case "h1":
                out = true;
                break;
            case "h2":
                out = true;
                break;
            case "h3":
                out = true;
                break;
            case "h4":
                out = true;
                break;
            case "h5":
                out = true;
                break;
            case "h6":
                out = true;
                break;
            case "link":
                out = true;
                break;
            default:
                out = false;
                break;
        }
        return out;
    }

    function handleContent(e: React.ChangeEvent<HTMLTextAreaElement>) {
        settextContent(e.target.value);
        callBackToSaveContent(e.target.value);
    }

    return (
        <div
            className={`absolute ${swtichCaseToShowBox(whichFeaturePopupToShow) ? "flex" : "hidden"
                } z-40 h-[60%] w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] mx-auto bg-[#191825] rounded-lg p-3`}
        >
            <textarea
                value={textContent}
                onChange={(e) => handleContent(e)}
                className={`w-[100%] h-[100%] p-3
        ${whichFeaturePopupToShow === 'link' ? "underline" : ""}

        ${whichFeaturePopupToShow === 'h1'
                        ? "text-[6em] font-[600]"
                        : whichFeaturePopupToShow === 'h2'
                            ? "text-[2.5em] font-[600]"
                            : whichFeaturePopupToShow === 'h3'
                                ? "text-[1.67em] font-[600]"
                                : whichFeaturePopupToShow === 'h4'
                                    ? "text-[1.33em] font-[600]"
                                    : whichFeaturePopupToShow === 'h5'
                                        ? "text-[1.17em] font-[600]"
                                        : whichFeaturePopupToShow === 'h6'
                                            ? "text-[1em] font-[600]" : "text-[1em] font-[400]"}`}
                placeholder="start typing..."
            />
        </div>
    );
};

export default TextPopup;
