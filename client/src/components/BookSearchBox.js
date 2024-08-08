import React, { useState } from 'react';
import { useEffect } from 'react';

function BookSearchBox({ query, setQuery }) {
    console.log('render query' , query);
    const [formValues, setFormValues] = useState({
        searchType: query.searchType,
        subject: query.subject,
        searchValue: query.searchValue 
    });

    useEffect(() => {
        setFormValues({
            searchType: query.searchType || 'title',
            subject: query.subject || '',
            searchValue: query.searchValue || '' 
        });
    }, [query]);
    console.log('render form' , formValues);

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
    };

    const handleReset = () => {
        setFormValues({
            searchType: 'title',
            subject: '',
            searchValue: ''
        });
        setQuery({ page: 1, searchType: 'title', searchValue: '', subject: '' });
    };

    return (
        <div className="shadow-md m-3 border h-auto p-4 rounded-lg bg-white">
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
            </form>
        </div>
    );
}

export default BookSearchBox;