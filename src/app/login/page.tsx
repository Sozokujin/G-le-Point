'use client'
import { Button } from '@/components/ui/button';
import { googleSignIn, googleLogOut, useAuthStore } from '../store/authStore';
import { setPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth } from '../db/firebase';

const Login = () => {

    const { isAuthenticated, login, logout, user } = useAuthStore();

    const handleSignIn = async () => {
        try {
            await setPersistence(auth, browserLocalPersistence);
            const authUser = await googleSignIn();
            if (authUser && authUser.user) {
                login(authUser.user);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleLogout = async () => {
        try {
            await googleLogOut();
            logout();
        } catch (error) {
            console.log(error);
        }
    }

    console.log(isAuthenticated, user);

    return (
        <>
            <div>
                <Button variant="default" size="sm" onClick={handleSignIn}>
                    Login
                </Button>
                <Button variant="default" size="sm" onClick={handleLogout}>
                    Logout
                </Button>
            </div>

            {isAuthenticated && (
                <div>
                    <h1>Welcome {user.displayName}</h1>
                </div>
            )}
        </>
    );
};

export default Login;