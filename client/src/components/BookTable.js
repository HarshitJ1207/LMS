import React, { useState, useEffect } from 'react';
import loadingIcon from '../assets/loading-icon.png';

function BookTable({ query, setQuery }) {
    const [loaded, setLoaded] = useState(false);
    const [bookList, setBookList] = useState([]);

    useEffect(() => {
        const params = new URLSearchParams();
        if (query) {
            Object.keys(query).forEach(key => {
                params.append(key, encodeURIComponent(query[key]));
            });
        }
        const url = `http://localhost:8000/api/books?${params.toString()}`;
        console.log(url);
        fetch(url)
            .then(response => response.json())
            .then(data => setBookList(data.bookList))
            .then(() => setLoaded(true))
            .catch(error => console.error('Error:', error));
    }, [query]);

    if (!loaded) {
        return (
            <div className="flex justify-center items-top h-screen">
                <img src={loadingIcon} alt="Loading..." className="w-16 h-16 mt-4" />
            </div>
        );
    }

    if(bookList.length === 0) {
        return (
            <div className="shadow-md m-3 border h-auto p-4 rounded-lg bg-white">
                <h1 className="text-center text-2xl font-bold text-gray-500">No Books Found</h1>
            </div>
        );
    }

    else return (
        <div className="shadow-md m-3 border h-auto p-4 rounded-lg bg-white">
            <table className="min-w-full divide-y divide-gray-800">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {bookList.map((book, index) => (
                        <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">{book.bookID}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{book.details.title}</td>
                            <td className="px-6 py-4 whitespace-nowrap" onClick={() => setQuery(query => ({searchType: 'author', searchValue: book.details.author , page: 1}))}>
                                {book.details.author}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap" onClick={() => setQuery(query => ({searchType: 'title', subject: book.details.subject , page: 1 , searchValue: ''}))}>
                                {book.details.subject}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{book.availability ? 'Available' : 'Unavailable'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                <button onClick={() => setQuery(query => ({...query , page: query.page - 1}))} hidden={query.page === 1} className="m-2 p-2 bg-blue-500 text-white rounded-md">Previous</button>
                <button onClick={() => setQuery(query => ({...query , page: query.page + 1}))} className="m-2 p-2 bg-blue-500 text-white rounded-md">Next</button>
            </div>
        </div>
    );
}

export default BookTable;