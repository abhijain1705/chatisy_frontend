import React, { useState } from 'react'
import Wrapper from '../components/wrapper';
import Input from '../components/input';
import Button from '../components/button';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const ResetPassword = () => {

    const [email, setemail] = useState("");
    const [loading, setloading] = useState(false);


    function cleanData() {
        setloading(false);
        setemail("");
    }

    async function handleForgot() {
        if (!email) {
            toast.warn("email should be written")
            return;
        }

        try {
            setloading(true);
            let res = await axios({
                method: 'post',
                url: 'https://chatisy-backend.onrender.com/passwords/forgot-password',
                data: {
                    email: email,
                }
            });
            toast.success(res.data.message);
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
            <h3 className='text-[30px] font-[600]' >Reset Password</h3>
            <Input value={email} setvalue={setemail} label={'Email'} isPassword={false} />
            <Button loading={loading} onClick={handleForgot} label={'Submit'} />
            <div className='mb-8'></div>
        </Wrapper>
    )
}

export default ResetPassword;