import React, { ChangeEvent, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { UserSelector } from '../redux/userSlice';
import { logIn } from '../redux/userSlice';
import axios from 'axios';
import Button from '../components/button';
import { storage } from '../firebase';
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { toast } from 'react-toastify';

interface ModalProp {
    setshowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const Modal = ({ setshowModal }: ModalProp) => {

    const [file, setfile] = useState<File | undefined>(undefined);
    const [about, setabout] = useState('');
    const selector = useSelector((state: UserSelector) => state.user);
    const dispatch = useDispatch();
    const [loading, setloading] = useState(false);

    function handleFileSelect(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];

        if (file && file.type.startsWith('image/')) {
            setfile(file);
        } else {
            // If the selected file is not an image, reset the file state
            setfile(undefined);
        }
    }

    function clear() {
        setabout("");
        setfile(undefined);
    }

    async function updateUser(url: string, about: string, setloading: React.Dispatch<React.SetStateAction<boolean>>) {
        try {
            let res = await axios({
                method: 'post',
                url: 'https://chatisy-backend.onrender.com/users/update',
                data: {
                    email: selector.email,
                    profile: url,
                    about: about,
                }
            });
            dispatch(logIn({ email: selector.email, fullName: selector.fullName, profile: res.data.profile, about: res.data.about, _id: res.data._id }))
            setloading(false);
            setshowModal(false);
        } catch (error) {
            setloading(false);
            toast.error("error occured, try again");
        }
    }

    async function addUserOtherInfo() {
        if (file === undefined || about.length === 0) {
            toast.warn("fields should be filled");
            return;
        }

        setloading(true);
        const imageRef = ref(storage, `foodImages/${selector.email}`);
        uploadBytes(imageRef, file!)
            .then((snapshot) => {
                getDownloadURL(snapshot.ref).then(async (url) => {
                    await updateUser(url, about, setloading);
                    clear();
                });
            })
            .catch((err) => {
                console.log(err);
                clear();
                setloading(false);
                toast.error("error occured");
            });
    }

    return (
        <div className="absolute z-50 p-4 w-max h-max min-w-[320px] md:w-[450px]">
            <div className="relative w-full h-full max-w-md md:h-auto">
                <div className="relative border-2 border-gray-200 bg-white rounded-lg dark:bg-gray-700">
                    <div className="px-6 py-6 lg:px-8">
                        <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">Add those Information to stand out your profile</h3>
                        <form className="space-y-6" action="#">
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Upload Profile Picture</label>
                                <input accept="image/*" onChange={handleFileSelect} className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file_input" type="file" />

                            </div>
                            <div>
                                <label htmlFor="bio" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">describe your current life status</label>
                                <input value={about} onChange={(e) => setabout(e.target.value)} type="text" name="bio" id="bio" placeholder="write your bio" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                            </div>
                            <div className='items-center flex justify-center'>
                                <Button loading={loading} label="Submit" onClick={addUserOtherInfo} />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal;