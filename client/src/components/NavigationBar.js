import React from 'react';
import { Link } from 'react-router-dom';

function NavigationBar() {
    return (
        <nav className="bg-gray-800 p-4 flex">
            <div className="flex space-x-4">
                <Link to="/" className="text-white hover:text-blue-500 hover:underline">Home</Link>
                <Link to="/Books" className="text-white hover:text-blue-500 hover:underline">Books</Link>
                <Link to="/Studio" className="text-white hover:text-blue-500 hover:underline">Studio</Link>
                <Link to="/About" className="text-white hover:text-blue-500 hover:underline">About</Link>
            </div>
            <div className="ml-auto">
                <Link to="/Login" className="text-white hover:text-blue-500 hover:underline">Login</Link>
            </div>
        </nav>
    );
}

export default NavigationBar;