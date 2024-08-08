import { useForm } from "react-hook-form";
import React from "react";
function SignupForm() {
    const { register, handleSubmit } = useForm();

    function submitHandler(data) {

    };

    return (
        <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col items-center p-6 border border-gray-300 rounded bg-gray-50 w-5/6 mx-auto mt-5">
            <input 
                {...register('username')} 
                type="text" 
                placeholder="Username" 
                className="mb-4 p-2 border border-gray-300 rounded w-full"
            />
            <input 
                {...register('password')} 
                type="password" 
                placeholder="Password" 
                className="mb-4 p-2 border border-gray-300 rounded w-full"
            />
            <input 
                {...register('confirmPassword')} 
                type="password" 
                placeholder="Confirm Password" 
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