import React, { useState } from 'react';
import Button from '../components/button';
import Input from '../components/input';
import Wrapper from '../components/wrapper';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { logIn } from '@/pages/redux/userSlice';
import { addUser } from '../firebase';
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/router';


const Signup = () => {

    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [fullName, setfullName] = useState("");
    const [confirmPassword, setconfirmPassword] = useState("");
    const [loading, setloading] = useState(false);

    const route = useRouter();

    function cleanData() {
        setloading(false);
        setfullName("");
        setemail("");
        setpassword("");
        setconfirmPassword("");
    }

    const dispatch = useDispatch();

    async function handleSignup() {
        if (password !== confirmPassword) {
            toast.warn("password should match with confirm password")
            return;
        }
        if (!email || !password || !confirmPassword || !fullName) {
            toast.warn('all fields should be enter');
        }

        try {
            setloading(true);
            let res = await axios({
                method: 'post',
                url: 'https://chatisy-backend.onrender.com/users/signup',
                data: {
                    fullName: fullName,
                    email: email,
                    password: password,
                    profile: '',
                    about: '',
                }
            });
            await addUser(fullName, res.data._id, res.data._id, new Date(), "[p]hi, welcome[/p]", res.data._id);
            dispatch(logIn({ fullName: res.data.fullName, email: res.data.email, profile: res.data.profile, about: res.data.about, _id: res.data._id }));
            cleanData();
            route.push("/");
        } catch (error) {
            toast.error("error occured, try again later.")
            cleanData();
        }
    }

    return (
        <Wrapper>
            <ToastContainer />
            <h3 className='text-[30px] font-[600]' >Register</h3>
            <Input value={fullName} setvalue={setfullName} isPassword={false} label={'Full Name'} />
            <Input value={email} setvalue={setemail} isPassword={false} label={'Email'} />
            <Input value={password} setvalue={setpassword} isPassword={true} label={'Password'} />
            <Input value={confirmPassword} setvalue={setconfirmPassword} isPassword={true} label={'Confirm Password'} />
            <Button loading={loading} onClick={handleSignup} label={'Submit'} />
            <a href='/screens/login' className='font-[600] whitespace-nowrap text-[12px] cursor-pointer'>Already have an account?</a>
        </Wrapper>
    )
}

export default Signup;