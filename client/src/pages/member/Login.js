import React, { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

function LoginForm() {
    const { login } = useContext(AuthContext);
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [formLoading, setFormLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setError('');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            });
            if(!response.ok) {
                const errorData = await response.json().catch(() => {
                    throw new Error('Network response was not ok');
                });
                throw new Error(errorData.error || 'Network response was not ok');
            }
            const data = await response.json();
            const userType = data.userType;
            setError('');
            login(userType);
            navigate('/');
        } catch (error) {
            setError(error.message);
        } finally {
            setFormLoading(false);
        }
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
                {error && <div style={{ color: 'red' }}>{error}</div>}
                <button 
                    type="submit" 
                    className="w-full max-w-xs p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    disabled={formLoading}
                >
                    {formLoading ? 'Loading...' : 'Login'}
                </button>
            </form>
        </React.Fragment>
    );
}

function Login() {
    return (
        <React.Fragment>
            <LoginForm />
        </React.Fragment>
    );
}

export default Login;