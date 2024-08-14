import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Signout = () => {
    const { logout } = useContext(AuthContext);
    logout();
    return <Navigate to="/" />;
};

export default Signout;

