import React from 'react';
import loadingIcon from '../../assets/loading-icon.png';

const LoadingPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <img src={loadingIcon} alt="Loading" className="w-16 h-16 animate-spin mb-4" />
            <h1 className="text-2xl font-semibold text-gray-700">Loading...</h1>
        </div>
    );
};

export default LoadingPage;