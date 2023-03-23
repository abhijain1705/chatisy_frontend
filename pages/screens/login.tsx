import React, { useState } from 'react';
import Link from 'next/link';
import Button from '../components/button';
import Input from '../components/input';
import axios from 'axios';
import Wrapper from '../components/wrapper';
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { logIn } from '@/pages/redux/userSlice';

const Login = () => {

    const [email, setemail] = useState("");
    const [loading, setloading] = useState(false);
    const [password, setpassword] = useState("");


    function cleanData() {
        setloading(false);
        setemail("");
        setpassword("");
    }

    const dispatch = useDispatch();

    async function handleLogin() {
        if (!email || !password) {
            toast.warn("all fields should be enter");
        }

        try {
            setloading(true);
            let res = await axios({
                method: 'post',
                url: 'https://chatisy-backend.onrender.com/users/login',
                data: {
                    email: email,
                    password: password,
                }
            });
            dispatch(logIn({ fullName: res.data.fullName, email: res.data.email, profile: res.data.profile, about: res.data.about, _id: res.data._id }));
            cleanData();
        } catch (error) {
            console.log(error);
            toast.error("error occured, try again later.")
            cleanData();
        }
    }

    return (
        <Wrapper>
            <ToastContainer />
            <h3 className='text-[30px] font-[600]' >Login</h3>
            <Input value={email} setvalue={setemail} isPassword={false} label={'Email'} />
            <Input value={password} setvalue={setpassword} isPassword={true} label={'Password'} />
            <div className='w-full flex justify-between items-center'>
                <Link href='/screens/signup' className='font-[600] text-[12px] cursor-pointer'>New User?</Link>
                <Link href='/screens/resetPassword' className='font-[600] text-[12px] cursor-pointer'>Forgot Password?</Link>
            </div>
            <Button loading={loading} onClick={handleLogin} label={'Submit'} />
        </Wrapper>
    )
}

export default Login;