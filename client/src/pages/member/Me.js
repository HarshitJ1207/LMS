import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LoadingComponent from '../../components/extras/LoadingComponent';
import ErrorComponent from '../../components/extras/ErrorComponent';
const UserDetailsCard = ({ userDetails }) => {
    return (
        <div className="container mx-auto mt-3 bg-slate-200 shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">User Details</h2>
            <div className="space-y-4">
                <div className="flex flex-wrap -mx-2">
                    <div className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4 flex items-center">
                        <span className="font-semibold text-lg w-32">Username:</span>
                        <span className="text-lg">{userDetails.details.username}</span>
                    </div>
                    <div className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4 flex items-center">
                        <span className="font-semibold text-lg w-32">Email:</span>
                        <span className="text-lg">{userDetails.details.email}</span>
                    </div>
                    <div className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4 flex items-center">
                        <span className="font-semibold text-lg w-32">Contact Number:</span>
                        <span className="text-lg">{userDetails.details.contactNumber}</span>
                    </div>
                    <div className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4 flex items-center">
                        <span className="font-semibold text-lg w-32">User Type:</span>
                        <span className="text-lg">{userDetails.details.userType}</span>
                    </div>
                    <div className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4 flex items-center">
                        <span className="font-semibold text-lg w-32">Max Books:</span>
                        <span className="text-lg">{userDetails.bookIssuePrivilege.maxBooks}</span>
                    </div>
                    <div className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4 flex items-center">
                        <span className="font-semibold text-lg w-32">Issue Duration:</span>
                        <span className="text-lg">{userDetails.bookIssuePrivilege.issueDuration} days</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const IssueHistoryCard = ({ issues, title }) => {
    return (
        <div className="container mx-auto bg-slate-200 shadow-md rounded-lg p-6 mt-3 mb-6">
            <h2 className="text-xl font-semibold mb-4">{title}</h2>
            {issues.length === 0 ? (
                <p>No current issues.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white text-center">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">Book ID</th>
                                <th className="py-2 px-4 border-b">Issue Date</th>
                                <th className="py-2 px-4 border-b">Return Date</th>
                                <th className="py-2 px-4 border-b">Days Overdue</th>
                                <th className="py-2 px-4 border-b">Fine</th>
                            </tr>
                        </thead>
                        <tbody>
                            {issues.map((issue, index) => {
                                return (
                                    <tr key = {index}>
                                        <td className="py-2 px-4 border-b">{issue.bookID.bookID}</td>
                                        <td className="py-2 px-4 border-b">{new Date(issue.issueDate).toLocaleDateString()}</td>
                                        <td className="py-2 px-4 border-b">{new Date(issue.dateofReturn || issue.returnDate).toLocaleDateString()}</td>
                                        <td className="py-2 px-4 border-b">{issue.daysOverdue}</td>
                                        <td className="py-2 px-4 border-b">{issue.fine}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
const Me = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [userDetails, setUserDetails] = useState(null);
    const [error, setError] = useState(null);   
    console.log(userDetails);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const url = `${process.env.REACT_APP_API_BASE_URL}/me`;
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
                setUserDetails(data.user);
                console.log(data.user);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }
        fetchUserDetails();
    }, [id]);

    if (error) {
        return <ErrorComponent error={error} />;
    }

    if (loading) {
        return <LoadingComponent />;
    }

    return (
        <div className="container mx-auto p-4">
            <UserDetailsCard userDetails={userDetails} />
            <IssueHistoryCard issues = {userDetails.currentIssues} title = {'Current Issues'} />
            <IssueHistoryCard issues = {userDetails.issueHistory} title = {'Past Issues'} />
        </div>
    );
};

export default Me;