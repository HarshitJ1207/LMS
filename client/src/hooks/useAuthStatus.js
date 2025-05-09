import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const useAuthStatus = () => {
    const { login, isLoggedIn } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        if (isLoggedIn === 'Admin') {
            setLoading(false);
            return;
        }

        const checkLoginStatus = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/loginStatus`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    if (isMounted) login(false);
                    return;
                }
                const data = await response.json();
                if (isMounted && data) login(data.userType);
            } catch (error) {
                if (isMounted) login(false);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        checkLoginStatus();
        return () => {
            isMounted = false;
        };
    }, [login, isLoggedIn]);
    return { loading, isLoggedIn };
};

export default useAuthStatus;