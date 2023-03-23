import React, {useEffect} from 'react';
import { useRouter } from 'next/router';
import Login from './screens/login';
import HomeScreen from './afterAuth/homeScreen';
import { useSelector } from 'react-redux';
import { UserSelector } from '@/pages/redux/userSlice';
import { useTheme } from 'next-themes';

const App = () => {

    const selector = useSelector((state: UserSelector) => state.user);
    const { setTheme } = useTheme();
    const route = useRouter();

    function isUserAuthed() {
        if (selector.email === "" || selector.fullName === "") {
            setTheme('light');
            return false;
        } else {
            return true;
        }
    }

    useEffect(() => {
        if(isUserAuthed()){
            route.push("/");
        }
    }, []);

    return (
        <main>
            {isUserAuthed() ? <HomeScreen /> : <Login />}
        </main>
    )
}

export default App;