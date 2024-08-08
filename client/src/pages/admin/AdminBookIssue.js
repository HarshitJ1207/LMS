import React, { useState } from 'react';

const AdminBookIssue = () => {
    const [username, setUsername] = useState('');
    const [bookID, setBookID] = useState('');
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [formLoading , setFormLoading] = useState(false);


    const handleBlur = async () => {
        setUserData(null);
        setError('');
        setSuccess(null);
        if (username) {
            try {
                const url = `http://localhost:8000/api/admin/users/${username}`;
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
                setUserData(data.user);
                setError('');
                console.log(data.user);
            } catch (err) {
                setUserData(null);
                setError(err.message);
            }
        } else {
            setUserData(null);
        }
    }

    const handleSubmit = async (e) => {
        if(formLoading) return;
        e.preventDefault();
        setFormLoading(true);
        try {
            const url = `http://localhost:8000/api/admin/bookIssue`;
            const response = await fetch(url, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, bookID })
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => {
                    throw new Error('Network response was not ok');
                });
                throw new Error(errorData.error || 'Network response was not ok');
            }
            const data = await response.json();
            setError(null);
            setSuccess(data.message);
            handleBlur();
        } catch (err) {
            setError(err.message);
            setSuccess(null);
        } finally{
            setFormLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-top mt-6">
            <div className="w-full max-w-md bg-slate-200 shadow-lg rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4 border-b pb-2">Issue Book</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="mb-4">
                        <label className="block text-lg font-semibold mb-2">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onBlur={handleBlur}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    {userData && (
                        <div className="text-center">
                            <div className="mb-4 bg-blue-900 text-white p-4 rounded-lg inline-block">
                                <div className="text-center">
                                    <p className="text-lg">Pending Fine: {userData.overdueFine}</p>
                                    <p className="text-lg">Books Issued: {userData.currentIssues.length}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="mb-4">
                        <label className="block text-lg font-semibold mb-2">Book ID</label>
                        <input
                            type="text"
                            value={bookID}
                            onChange={(e) => setBookID(e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                            />
                    </div>
                    {error && <p className="text-red-500">{error}</p>}
                    {success && <p className="text-green-500">{success}</p>}
                    <button
                        type="submit"
                        disabled={formLoading}
                        className={`p-2 rounded ${formLoading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500"} text-white`}
                    >
                        {formLoading ? "Issuing..." : "Issue Book"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminBookIssue;