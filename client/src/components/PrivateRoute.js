import React, { useContext, useState , useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ element: Component, ...rest }) => {
    const { login, isLoggedIn } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(isLoggedIn) {
            setLoading(false);
            return;
        }
        const checkLoginStatus = async () => {
            const res = await fetch('http://localhost:8000/api/loginStatus', {
                credentials: 'include',
            });
            const data = await res.json();
            setLoading(false);
            if (data) login(data.loggedIn);
        };

        checkLoginStatus();
    }, [login, isLoggedIn]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return isLoggedIn ? (
        <Component {...rest} />
    ) : (
        <Navigate to="/login" />
    );
};

export default PrivateRoute;