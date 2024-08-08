import React, { useState, useEffect } from 'react';
import LoadingComponent from '../components/extras/LoadingComponent';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ErrorComponent from './extras/ErrorComponent';
function BookTable({ query, setQuery, loading, setLoading }) {
    const navigator = useNavigate();
    const [bookList, setBookList] = useState([]);
    const {isLoggedIn} = useContext(AuthContext);
    const [error , setError] = useState(null);
    useEffect(() => {
        setLoading(true);   
        setError(null);
        setBookList([]);
        const fetchBooks = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/books?page=${query.page}&searchType=${query.searchType}&searchValue=${query.searchValue}&subject=${query.subject}`);
                if (!response.ok) {
                    const errorData = await response.json().catch(() => {
                        throw new Error('Network response was not ok');
                    });
                    throw new Error(errorData.error || 'Network response was not ok');
                }
                const data = await response.json();
                setBookList(data.bookList);
            } catch (err) {
                setError(err);
            }finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, [query ,setLoading]);

    const idClickHandler = (event) => {
        if(isLoggedIn) {
            const bookID = event.target.innerHTML;
            navigator(`/admin/book/${bookID}`);
        }
    };

    if(error) {
        <ErrorComponent error={error}/>
    }

    if (loading) {
        return (
            <LoadingComponent/>
        );
    }

    else if(bookList.length === 0) {
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
                            <td className="px-6 py-4 whitespace-nowrap" onClick={idClickHandler}>{book.bookID}</td>
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
            <div className='flex justify-center'>
                <button onClick={() => setQuery(query => ({...query , page: query.page - 1}))} hidden={query.page === 1} className="m-2 p-2 bg-blue-500 text-white rounded-md">Previous</button>
                <button onClick={() => setQuery(query => ({...query , page: query.page + 1}))} className="m-2 p-2 bg-blue-500 text-white rounded-md">Next</button>
            </div>
        </div>
    );
}

export default BookTable;