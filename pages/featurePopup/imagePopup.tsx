import React, { useState, createRef } from 'react';

interface ImagePopupInterface {
    setimageContent: React.Dispatch<React.SetStateAction<File | null>>;
    imageContent: File | null;
    whichFeaturePopupToShow: "" | "code" | "image" | "emoji" | "gif" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "link"
}

const ImagePopup = ({ whichFeaturePopupToShow, imageContent, setimageContent }: ImagePopupInterface) => {

    const fileRef = createRef<HTMLInputElement>();

    function pickImage() {
        fileRef.current?.click();
    }

    return (
        <div className={`group absolute ${whichFeaturePopupToShow === 'image' ? "flex" : "hidden"} items-center justify-center z-40 h-[60%] w-[90%] sm:w-[80%] md:w-[70%] lg:w-[40%] mx-auto bg-[#191825] rounded-lg p-3`}>
            <div className='absolute z-20 top-8 hidden group-hover:block bg-gray-200 p-2 text-black'>click me to change</div>
            <input onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                    setimageContent(e.target.files[0]);
                }
            }}
                ref={fileRef} type={'file'} accept='image/*' className='hidden' />
            {imageContent !== null ?
                <img onClick={pickImage} src={URL.createObjectURL(imageContent)} alt='your_choice' className='w-[60%] h-[80%] cursor-pointer' />
                : <div onClick={pickImage} className=' w-[80%] border-2 border-dashed border-gray-300 rounded-lg cursor-pointer h-[80%] m-auto items-center justify-center flex'>pick image</div>}
        </div>
    )
}

export default ImagePopup;