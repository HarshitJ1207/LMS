import React, { useState, useEffect } from 'react';
import LoadingComponent from '../../components/extras/LoadingComponent';
import { useNavigate } from 'react-router-dom';
import ErrorComponent from '../../components/extras/ErrorComponent';

const UserSearchBox = ({ query, setQuery, setLoading }) => {
    const [formState, setFormState] = useState(query);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setQuery(formState);
    };

    const resetHandler = () => {
        setQuery({ searchType: 'username', userType: 'any', searchValue: '' });
        setFormState({ searchType: 'username', userType: 'any', searchValue: '' });
        setLoading(true);
    };

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const handleAddUser = () => {
        navigate('/admin/addUser'); 
    };

    const handleRemoveUser = () => {
        navigate('/admin/removeUser');
    };

    return (
        <div className="relative shadow-md m-3 border h-auto p-4 rounded-lg bg-white max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="flex flex-row items-center justify-center w-full flex-wrap">
                <select
                    name="searchType"
                    value={formState.searchType}
                    onChange={handleChange}
                    className="mx-2 border-2 p-2 shadow-sm rounded-md max-w-xs"
                >
                    <option value="username">Username</option>
                    <option value="email">Email</option>
                    <option value="contactNumber">Contact Number</option>
                </select>
                <select
                    name="userType"
                    value={formState.userType}
                    onChange={handleChange}
                    className="mx-2 border-2 p-2 shadow-sm rounded-md max-w-xs"
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
                    className="mx-2 border-2 p-2 shadow-sm rounded-md max-w-xs flex-grow"
                />
                <button
                    className="search-button mx-2 border-2 p-2 shadow-sm rounded-md bg-blue-500 text-white hover:bg-blue-600"
                    type="submit"
                >
                    Search
                </button>
                <button
                    className="search-button mx-2 border-2 p-2 shadow-sm rounded-md bg-blue-500 text-white hover:bg-blue-600"
                    type="button"
                    onClick={resetHandler}
                >
                    Reset
                </button>
                <div className="relative ml-4">
                    <button
                        className="flex items-center justify-center w-8 h-8 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300"
                        onClick={toggleDropdown} type="button"
                    >
                        &#x22EE;
                    </button>
                    {dropdownVisible && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg">
                            <button
                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                onClick={handleAddUser} type="button"
                            >
                                Add User
                            </button>
                            <button
                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                onClick={handleRemoveUser} type="button"
                            >
                                Remove User
                            </button>
                        </div>
                    )}
                </div>
            </form>
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
                const url = `${process.env.REACT_APP_API_BASE_URL}/admin/users?${params}`;
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