import React from 'react';
import Button from '../components/button';
import Wrapper from '../components/wrapper';
import { useRouter } from 'next/router';

const UpdateSuccessPrompt = () => {

    const routes = useRouter();

    return (
        <Wrapper>
            <h3 className='text-[30px] whitespace-nowrap my-4 mx-8 font-[600]' >Password Changed!</h3>
            <Button loading={false} onClick={async () => { routes.push("/screens/login") }} label={'Continue Login'} />
            <div className='my-4'></div>
        </Wrapper>
    )
}

export default UpdateSuccessPrompt;