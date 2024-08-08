import React, { useState, useEffect } from 'react';
import LoadingComponent from '../../components/extras/LoadingComponent';
import { useNavigate } from 'react-router-dom';
import ErrorComponent from '../../components/extras/ErrorComponent';

const UserSearchBox = ({ query, setQuery , setLoading }) => {
    const [formState, setFormState] = useState(query);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        console.log("Handle Submit");
        e.preventDefault();
        setLoading(true);   
        setQuery(formState);
        console.log('loading');
    };


    const resetHandler = () => {
        setQuery({searchType: 'username', userType: 'any', searchValue: ''});
        setFormState({searchType: 'username', userType: 'any', searchValue: ''});
        setLoading(true);
    }

    return (
        <div className="mx-auto p-4 flex shadow-md w-8/12">
            <div className="search-bar mx-auto">
                <form onSubmit={handleSubmit} className="flex space-x-4">
                    <select
                        name="searchType"
                        value={formState.searchType}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-md p-2"
                    >
                        <option value="username">Username</option>
                        <option value="email">Email</option>
                        <option value="contactNumber">Contact Number</option>
                    </select>
                    <select
                        name="userType"
                        value={formState.userType}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-md p-2"
                    >
                        <option value="any">Any</option>
                        <option value="Faculty">Faculty</option>
                        <option value="Visiting / Guest Faculty">Visiting / Guest Faculty</option>
                        <option value="Permanent Staff">Staff (Permanent)</option>
                        <option value="contractualStaff">Staff (Contractual)</option>
                        <option value="Research Scholars/PhD">Research Scholars/Ph.D</option>
                        <option value="PG Student">Student (PG)</option>
                        <option value="UG Student">Student (UG)</option>
                        <option value="Young Learner">Young Learner Library (YLL)</option>
                        <option value="Admin">Admin</option>
                    </select>
                    <input
                        name="searchValue"
                        placeholder="Search"
                        value={formState.searchValue}
                        onChange={handleChange}
                        className="border border-gray-300 rounded-md p-2 flex-grow"
                    />
                    <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md">Search</button>
                    <button type = "button" className="bg-blue-500 text-white py-2 px-4 rounded-md" onClick = {resetHandler}>Reset</button>
                </form>
            </div>
        </div>
    );
};

const UserTable = ({ query , loading , setLoading }) => {
    const navigate = useNavigate();
    const [userList, setUserList] = useState([]);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchUserList = async () => {
            try {
                const params = new URLSearchParams(query).toString();
                const url = `http://localhost:8000/api/admin/users?${params}`;
                console.log(url);
                const response = await fetch(url, {
                    credentials: 'include', 
                });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => {
                        throw new Error('Network response was not ok');
                    });
                    throw new Error(errorData.error || 'Network response was not ok');
                }
                const data = await response.json();
                setUserList(data.userList);
            } catch (error) {
                setError(error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchUserList();
    }, [query , setLoading]);
    
    const idClickHandler = (event) => {
        const userID = event.target.innerHTML;
        navigate(`/admin/user/${userID}`);
    };
    
    if (error) {
        return <ErrorComponent error={error} />;
    }
    
    return (
        <div className="container mx-auto p-4 text-center shadow-md w-10/12">
            {loading ? (
                <LoadingComponent />
            ) : (
                <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="py-3 px-6 border-b text-sm font-medium text-gray-700 uppercase">Username</th>
                            <th className="py-3 px-6 border-b text-sm font-medium text-gray-700 uppercase">Email</th>
                            <th className="py-3 px-6 border-b text-sm font-medium text-gray-700 uppercase">Contact Number</th>
                            <th className="py-3 px-6 border-b text-sm font-medium text-gray-700 uppercase">User Type</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {userList.map(user => (
                            <tr key={user._id} className="hover:bg-gray-100">
                                <td className="py-4 px-6 border-b text-sm text-gray-900 hover:underline cursor-pointer" onClick={idClickHandler}>
                                    {user.details.username}
                                </td>
                                <td className="py-4 px-6 border-b text-sm text-gray-900">{user.details.email}</td>
                                <td className="py-4 px-6 border-b text-sm text-gray-900">{user.details.contactNumber}</td>
                                <td className="py-4 px-6 border-b text-sm text-gray-900">{user.details.userType}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

const AdminUsers = () => {
    console.log('render');
    const [query, setQuery] = useState({
        searchType: 'username',
        userType: 'any',
        searchValue: '',
    });
    const [loading, setLoading] = useState(true);
    
    console.log(query);
    return (
        <React.Fragment>
            <UserSearchBox query={query} setQuery={setQuery} setLoading = {setLoading} />
            <UserTable  query={query} setLoading = {setLoading} loading = {loading} />
        </React.Fragment>
    );
};

export default AdminUsers;