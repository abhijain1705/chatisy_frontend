import React, { useState } from "react";
import Wrapper from "../components/wrapper";
import Input from "../components/input";
import Button from "../components/button";
import axios from "axios";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";

const UpdatePassword = () => {
    const [password, setpassword] = useState("");
    const [confirmPassword, setconfirmPassword] = useState("");
    const [loading, setloading] = useState(false);

    const routes = useRouter();

    function cleanData() {
        setloading(false);
        setconfirmPassword("");
        setpassword("");
    }

    async function handleUpdate() {
        if (password !== confirmPassword) {
            toast.warn("password should match with confirm password");
            return;
        }
        try {
            setloading(true);
            let res = await axios({
                method: "post",
                url: `https://chatisy-backend.onrender.com/passwords/reset-password/${routes.query.token}`,
                data: {
                    password: password,
                },
            });
            toast.success(res.data.message);
            cleanData();
            setTimeout(() => {
                routes.push("/screens/updateSuccessPrompt");
            }, 2000);
        } catch (error) {
            console.log(error);
            toast.error("error occured, try again later.");
            cleanData();
        }
    }

    return (
        <Wrapper>
            <ToastContainer />
            <h3 className="text-[30px] font-[600]">Reset Password</h3>
            <Input
                value={password}
                setvalue={setpassword}
                label={"Password"}
                isPassword={false}
            />
            <Input
                value={confirmPassword}
                setvalue={setconfirmPassword}
                label={"Confirm Password"}
                isPassword={false}
            />
            <Button loading={loading} onClick={handleUpdate} label={"Submit"} />
            <div className="mb-8"></div>
        </Wrapper>
    );
};

export default UpdatePassword;
