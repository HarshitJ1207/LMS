import React from "react";

const ErrorComponent = ({ error }) => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return (
        <div className="text-red-700 bg-red-100 p-4 border border-red-400 rounded-md my-2 w-5/12 m-auto">
            <p>{errorMessage}</p>
        </div>
    );
};

export default ErrorComponent;