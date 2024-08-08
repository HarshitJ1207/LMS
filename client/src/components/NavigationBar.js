import React from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
function NavigationBar() {
    const {isLoggedIn} = useContext(AuthContext);
    if(isLoggedIn !== 'Admin') return (
        <nav className="bg-gray-800 p-4 flex">
            <div className="flex space-x-4">
                <Link to="/" className="text-white hover:text-blue-500 hover:underline">Home</Link>
                <Link to="/Books" className="text-white hover:text-blue-500 hover:underline">Books</Link>
                {isLoggedIn && <Link to="/Me" className="text-white hover:text-blue-500 hover:underline">Me</Link>}
            </div>
            {
                isLoggedIn ? (
                    <div className="ml-auto flex space-x-4">
                        <Link to="/Signout" className="text-white hover:text-blue-500 hover:underline">Signout</Link>
                    </div>

                ) : (
                    <div className="ml-auto flex space-x-4">
                        <Link to="/Signup" className="text-white hover:text-blue-500 hover:underline">Signup</Link>
                        <Link to="/Login" className="text-white hover:text-blue-500 hover:underline">Login</Link>
                    </div>
                )
            }
        </nav>
    );
    return (
        <nav className="bg-gray-800 p-4 flex">
            <div className="flex space-x-4">
                <Link to="/admin" className="text-white hover:text-blue-500 hover:underline">Home</Link>
                <Link to="/admin/Books" className="text-white hover:text-blue-500 hover:underline">Books</Link>
                <Link to="/admin/Users" className="text-white hover:text-blue-500 hover:underline">Users</Link>
                <Link to="/admin/BookIssue" className="text-white hover:text-blue-500 hover:underline">Book Issue</Link>
                <Link to="/admin/BookReturn" className="text-white hover:text-blue-500 hover:underline">Book return</Link>
                <Link to="/admin/AddBook" className="text-white hover:text-blue-500 hover:underline">Add Book</Link>
                <Link to="/admin/RemoveBook" className="text-white hover:text-blue-500 hover:underline">Remove Book</Link>
                <Link to="/admin/AddUser" className="text-white hover:text-blue-500 hover:underline">Add User</Link>
                <Link to="/admin/RemoveUser" className="text-white hover:text-blue-500 hover:underline">Remove User</Link>
            </div>
            <div className="ml-auto flex space-x-4">
                <Link to="/Signout" className="text-white hover:text-blue-500 hover:underline">Signout</Link>
            </div>
        </nav>
    );

}

export default NavigationBar;