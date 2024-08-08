import React from 'react';

const AdminDashboard = () => {
    return (
        <React.Fragment>
            <div className="container mx-auto">
                <h1 className="text-3xl font-semibold mt-10">Admin Dashboard</h1>
                <div className="grid grid-cols-2 gap-4 mt-5">
                    <div className="bg-gray-100 p-4">Total Books: 100</div>
                    <div className="bg-gray-100 p-4">Total Users: 100</div>
                    <div className="bg-gray-100 p-4">Total Books Issued: 100</div>
                    <div className="bg-gray-100 p-4">Total Books Returned: 100</div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default AdminDashboard;