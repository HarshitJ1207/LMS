import React, { useState } from 'react';

const AdminBookIssue = () => {
    const [bookID, setBookID] = useState('');
    const [issueData, setIssueData] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!issueData){
            try {
                const url = `http://localhost:8000/api/admin/issueData?bookID=${bookID}`;
                console.log(url);
                const response = await fetch(url, {
                    method: 'GET',
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setIssueData(data);
                setError('');
                console.log(data.user);
            } catch (err) {
                setIssueData(null);
                setError('User not found');
            }
        }
        else{
            try {
                const url = `http://localhost:8000/api/admin/bookReturn`;
                const response = await fetch(url, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ bookID })
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log(data);
            } catch (err) {
                console.log(err);
            }
        }
    };

    return (
        <div className="flex justify-center items-top mt-6">
            <div className="w-full max-w-md bg-slate-200 shadow-lg rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4 border-b pb-2">Return Book</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="mb-4">
                        <label className="block text-lg font-semibold mb-2">Book ID</label>
                        <input
                            type="text"
                            value={bookID}
                            onChange={(e) => {setBookID(e.target.value); setIssueData(null);}}
                            className="w-full p-2 border rounded"
                            required
                            />
                        {issueData && (
                            <div className="text-center">
                                <div className="mb-4 bg-blue-900 text-white p-4 rounded-lg inline-block">
                                    <div className="text-center">
                                        <p className="text-lg">User: {issueData.user}</p>
                                        <p className="text-lg">Fine: {issueData.fine}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        {error && <p className="text-red-500">{error}</p>}
                    </div>
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded">{issueData ? 'Return Book': 'Search Book'}</button>
                </form>
            </div>
        </div>
    );
};

export default AdminBookIssue;