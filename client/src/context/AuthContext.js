import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	const login = (userStatus = true) => setIsLoggedIn(userStatus);
	const logout = async () => {
		setIsLoggedIn(false);
        localStorage.removeItem('token');
	};

	return (
		<AuthContext.Provider value={{ isLoggedIn, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};
