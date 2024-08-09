import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const login = (userStatus = true) => setIsLoggedIn(userStatus);
    const logout = async () => {
        setIsLoggedIn(false);
        await fetch(`${process.env.REACT_APP_API_BASE_URL}/logout`, { method: 'POST', credentials: 'include' });
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};