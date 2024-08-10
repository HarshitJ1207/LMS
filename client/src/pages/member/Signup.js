import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignupForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        contactNumber: '',
        email: ''
    });
    const [error, setError] = useState(null);
    const [formLoading, setFormLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validateForm = () => {
        const { username, password, confirmPassword, contactNumber, email } = formData;
        if (username.length < 4 || username.length > 12) {
            return 'Username must be between 4 and 12 characters long';
        }
        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,12}$/.test(password)) {
            return 'Password must be alphanumeric, contain at least one letter and one number, and be between 4 and 12 characters long';
        }
        if (password !== confirmPassword) {
            return 'Passwords must match';
        }
        if (!/^\d{10}$/.test(contactNumber)) {
            return 'Contact number must be 10 digits';
        }
        if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
            return 'Invalid email address';
        }
        return null;
    };

    const submitHandler = (e) => {
        if(formLoading) return;
        e.preventDefault();
        setError('');
        setFormLoading(true);
        setSuccess(false);
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            setFormLoading(false);
            return;
        }
        const postData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/signup`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify(formData)
                });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => {
                        throw new Error('Network response was not ok');
                    });
                    throw new Error(errorData.error || 'Network response was not ok');
                }
                setFormData({
                    username: '',
                    password: '',
                    confirmPassword: '',
                    contactNumber: '',
                    email: ''
                });
                setSuccess('Signup successful');
                navigate('/login');
            } catch (error) {
                setError(error.message);
            } finally {
                setFormLoading(false);
            }
        };
        postData();
    };

    return (
        <React.Fragment>
            <form onSubmit={submitHandler} className="flex flex-col items-center p-6 border border-gray-300 rounded bg-gray-50 w-5/6 mx-auto mt-5">
                <input 
                    name="username" 
                    type="text" 
                    placeholder="Username" 
                    value={formData.username} 
                    onChange={handleChange} 
                    className="w-full max-w-xs mb-4 p-2 border border-gray-300 rounded" 
                />
                <input 
                    name="password" 
                    type="password" 
                    placeholder="Password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    className="w-full max-w-xs mb-4 p-2 border border-gray-300 rounded" 
                />
                <input 
                    name="confirmPassword" 
                    type="password" 
                    placeholder="Confirm Password" 
                    value={formData.confirmPassword} 
                    onChange={handleChange} 
                    className="w-full max-w-xs mb-4 p-2 border border-gray-300 rounded" 
                />
                <input 
                    name="contactNumber" 
                    type="text" 
                    placeholder="Contact Number" 
                    value={formData.contactNumber} 
                    onChange={handleChange} 
                    className="w-full max-w-xs mb-4 p-2 border border-gray-300 rounded" 
                />
                <input 
                    name="email" 
                    type="email" 
                    placeholder="Email Address" 
                    value={formData.email} 
                    onChange={handleChange} 
                    className="w-full max-w-xs mb-4 p-2 border border-gray-300 rounded" 
                />
                {error && <div style={{ color: 'red' }}>{error}</div>}
                <button 
                    type="submit" 
                    className="w-full max-w-xs p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    disabled={formLoading}
                >
                    {formLoading ? 'Loading...' : 'Signup'}
                </button>
                {success && <div style={{ color: 'green' }}>{success}</div>}
            </form>
        </React.Fragment>
    );
};


function Signup() {
    return ( 
        <React.Fragment>
            <SignupForm/>
        </React.Fragment>
    );
}

export default Signup;