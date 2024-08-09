import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; 

function BookSearchBox({ query, setQuery, setLoading}) {
    const navigate = useNavigate();
    const { isLoggedIn } = useContext(AuthContext); 
    console.log('render query', query);
    const [formValues, setFormValues] = useState({ searchType: 'title', searchValue: '', subject: '' });
    const [dropdownVisible, setDropdownVisible] = useState(false);
    console.log(isLoggedIn);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value
        });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        console.log('submit', formValues);
        setQuery({ ...formValues, page: 1 });
        setLoading(true);
    };

    const handleReset = () => {
        setFormValues({
            searchType: 'title',
            subject: '',
            searchValue: ''
        });
        setQuery({ page: 1, searchType: 'title', searchValue: '', subject: '' });
        setLoading(true);
    };

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const handleAddBook = () => {
        navigate('/admin/addBook');
    };

    const handleRemoveBook = () => {
        navigate('/admin/removeBook');
    };

    return (
        <div className="relative shadow-md m-3 border h-auto p-4 rounded-lg bg-white">
            <form onSubmit={onSubmit} className="flex flex-row items-center justify-center w-full flex-wrap">
                <select
                    name="searchType"
                    value={formValues.searchType}
                    onChange={handleChange}
                    className="mx-2 border-2 p-2 shadow-sm rounded-md"
                >
                    <option value="title">Title</option>
                    <option value="author">Author</option>
                    <option value="ISBN">ISBN</option>
                </select>
                <input
                    name="subject"
                    placeholder="Subject"
                    value={formValues.subject}
                    onChange={handleChange}
                    className="mx-2 border-2 p-2 shadow-sm rounded-md"
                />
                <input
                    name="searchValue"
                    placeholder="Search Value"
                    value={formValues.searchValue}
                    onChange={handleChange}
                    className="mx-2 border-2 p-2 shadow-sm rounded-md"
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
                    onClick={handleReset}
                >
                    Reset
                </button>
                {isLoggedIn === 'Admin' && (
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
                                    onClick={handleAddBook} type="button"
                                >
                                    Add Book
                                </button>
                                <button
                                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                    onClick={handleRemoveBook} type="button"
                                >
                                    Remove Book
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </form>
        </div>
    );
}

export default BookSearchBox;