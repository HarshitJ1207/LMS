import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import LoadingComponent from '../../components/extras/LoadingComponent';
import ErrorComponent from '../../components/extras/ErrorComponent';

const AdminBookDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [issueHistory, setIssueHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const url = `http://localhost:8000/api/admin/books/${id}`;
                console.log(url);
                const response = await fetch(url, {
                    credentials: 'include'
                });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => {
                        throw new Error('Network response was not ok');
                    });
                    throw new Error(errorData.error || 'Network response was not ok');
                }
                const data = await response.json();
                setBook(data.book);
                setIssueHistory(data.book.issueHistory);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchBookDetails();
    }, [id]);

    const handleRemoveBook = async () => {
        try {
            const response = await fetch(
                `http://localhost:8000/api/admin/removeBook/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: 'include',
                }
            );
            if (!response.ok) {
                const errorData = await response.json().catch(() => {
                    throw new Error("Network response was not ok");
                });
                throw new Error(errorData.error || "Network response was not ok");
            }
            navigate('/admin/books');
        } catch (error) {
            setError(error);
        }
    };

    if (loading) {
        return <LoadingComponent />;
    }
    
    if (error) {
        return <ErrorComponent error={error} />;
    }

    return (
        <React.Fragment>
            <div className="container mx-auto p-4">
                <div className="bg-slate-200 shadow-md rounded-lg p-6 mb-6">
                    <h1 className="text-2xl font-bold mb-4 border-b pb-2">Book Detail</h1>
                    {book && (
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <span className="font-semibold text-lg w-32">Title:</span>
                                <span className="text-lg">{book.details.title}</span>
                            </div>
                            <div className="flex items-center">
                                <span className="font-semibold text-lg w-32">Author:</span>
                                <span className="text-lg">{book.details.author}</span>
                            </div>
                            <div className="flex items-center">
                                <span className="font-semibold text-lg w-32">Subject:</span>
                                <span className="text-lg">{book.details.subject}</span>
                            </div>
                            <div className="flex items-center">
                                <span className="font-semibold text-lg w-32">ISBN:</span>
                                <span className="text-lg">{book.details.ISBN}</span>
                            </div>
                            <button 
                                onClick={handleRemoveBook} 
                                className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
                            >
                                Remove Book
                            </button>
                        </div>
                    )}
                </div>
                <div className="bg-slate-200 shadow-md rounded-lg p-6">
                    <h1 className="text-2xl font-bold mb-4">Issue History</h1>
                    {issueHistory.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white text-center">
                                <thead>
                                    <tr>
                                        <th className="py-2 px-4 border-b border-gray-200 text-sm font-semibold text-gray-700">User</th>
                                        <th className="py-2 px-4 border-b border-gray-200 text-sm font-semibold text-gray-700">Issue Date</th>
                                        <th className="py-2 px-4 border-b border-gray-200 text-sm font-semibold text-gray-700">Return Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {issueHistory.map((issue, index) => (
                                        <tr key={issue._id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                            <td className="py-2 px-4 border-b border-gray-200 text-sm">{issue.userID.details.username}</td>
                                            <td className="py-2 px-4 border-b border-gray-200 text-sm">{new Date(issue.issueDate).toLocaleDateString()}</td>
                                            <td className="py-2 px-4 border-b border-gray-200 text-sm">{issue.returnDate ? new Date(issue.returnDate).toLocaleDateString() : 'Not returned yet'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-lg">No past issues</p>
                    )}
                </div>
            </div>
        </React.Fragment>
    );
};

export default AdminBookDetail;