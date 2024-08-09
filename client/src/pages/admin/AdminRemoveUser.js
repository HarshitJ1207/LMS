import React, { useState } from "react";

const AdminRemoveUser = () => {
	const [username, setUsername] = useState("");
	const [errors, setErrors] = useState({});
    const [formLoading, setFormLoading] = useState(false);
    const [success , setSuccess] = useState(null);

	const validate = () => {
		const errors = {};
		if (!username) errors.username = "Username is required";
		return errors;
	};

	const handleSubmit = async (e) => {
        if(formLoading) return;
		e.preventDefault();
        setFormLoading(true);
        setSuccess(null);
        setErrors({});
		const validationErrors = validate();
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
            setFormLoading(false);
			return;
		}
		try {
			const response = await fetch(
				`${process.env.REACT_APP_API_BASE_URL}/admin/removeUser/${username}`,
				{
					method: "DELETE",
                    credentials: 'include',
					headers: {
                        "Content-Type": "application/json",
					},
				}
			);
			if (!response.ok) {
                const errorData = await response.json().catch(() => {
                    throw new Error("Network response was not ok");
                });
                throw new Error(errorData.error || "Network response was not ok");
			}
            const data = await response.json();
			setUsername("");
			setErrors({});
            setSuccess(data.message);
            console.log(success);   
		} catch (error) {
            setErrors({ username: error.error });
		} finally{
            setFormLoading(false);
        }
	};
	return (
		<div className="max-w-md mx-auto mt-10 p-6 bg-slate-300 rounded-lg shadow-md">
			<h1 className="text-2xl font-bold mb-6 text-center">Remove User</h1>
			<form onSubmit={handleSubmit}>
				<div className="mb-4">
					<label className="block text-gray-700 font-bold mb-2">
						Username
					</label>
					<input
						type="text"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					{errors.username && (
						<p className="text-red-500 text-sm mt-1">
							{errors.username}
						</p>
					)}
				</div>
                <button
                    type="submit"
                    className={`w-full py-2 px-4 rounded-lg focus:outline-none focus:ring-2 ${
                        formLoading
                            ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500'
                    }`}
                    disabled={formLoading}
                >
                    {formLoading ? 'Loading...' : 'Remove User'}
                </button>
                {success && <p className="text-green-500 text-sm mt-1">{success}</p>}
			</form>
		</div>
	);
};

export default AdminRemoveUser;
