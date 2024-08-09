import React, { useState } from "react";

function SignupForm() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const submitHandler = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log(formData);
    };

    return (
        <form onSubmit={submitHandler} className="flex flex-col items-center p-6 border border-gray-300 rounded bg-gray-50 w-5/6 mx-auto mt-5">
            <input 
                name="username"
                type="text" 
                placeholder="Username" 
                value={formData.username}
                onChange={handleChange}
                className="mb-4 p-2 border border-gray-300 rounded w-full"
            />
            <input 
                name="password"
                type="password" 
                placeholder="Password" 
                value={formData.password}
                onChange={handleChange}
                className="mb-4 p-2 border border-gray-300 rounded w-full"
            />
            <input 
                name="confirmPassword"
                type="password" 
                placeholder="Confirm Password" 
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mb-4 p-2 border border-gray-300 rounded w-full"
            />
            <button 
                type="submit" 
                className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600"
            >
                Signup
            </button>
        </form>
    );
}

function Signup() {
    return ( 
        <React.Fragment>
            <SignupForm/>
        </React.Fragment>
    );
}

export default Signup;