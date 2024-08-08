import React, { useState } from "react";
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';

function LoginForm() {
    const { login } = useContext(AuthContext);
    const { register, handleSubmit } = useForm();
    const [error, setError] = useState('');
    const [flashMsg, setFlashMsg] = useState('');
    const navigate = useNavigate();

    const submitHandler = (data) => {
        console.log(data);
        fetch('http://localhost:8000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                setError(data.error);
                setFlashMsg(data.flashMsg);
            } else {
                setError('');
                setFlashMsg(data.message);
                login();
                navigate('/');
            }
        })
        .catch(error => {
            console.error('There was an error!', error);
            setError('An unexpected error occurred.');
        });
    };

    return (
        <React.Fragment>
            <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col items-center p-6 border border-gray-300 rounded bg-gray-50 w-5/6 mx-auto mt-5">
                <input {...register('username')} type="text" placeholder="Username" className="w-full max-w-xs mb-4 p-2 border border-gray-300 rounded" />
                <input {...register('password')} type="password" placeholder="Password" className="w-full max-w-xs mb-4 p-2 border border-gray-300 rounded" />
                {error && <div style={{ color: 'red' }}>{error}</div>}
                {flashMsg && <div style={{ color: 'green' }}>{flashMsg}</div>}
                <button type="submit" className="w-full max-w-xs p-2 bg-blue-500 text-white rounded hover:bg-blue-600">Login</button>
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