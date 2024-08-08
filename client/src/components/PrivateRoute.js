import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStatus from '../hooks/useAuthStatus';
import LoadingComponent from './extras/LoadingComponent';

const PrivateRoute = ({ element: Component, ...rest }) => {
    const { loading, isLoggedIn } = useAuthStatus();

    if (loading) {
        return <LoadingComponent />;
    }

    return isLoggedIn === 'Admin' ? (
        <Component {...rest} />
    ) : (
        <Navigate to="/login" />
    );
};

export default PrivateRoute;