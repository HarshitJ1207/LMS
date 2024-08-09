import React, { useState } from "react";

const AdminAddUser = () => {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [contactNumber, setContactNumber] = useState("");
	const [userType, setUserType] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState({});
    const [formLoading, setFormLoading] = useState(false);
    const [success , setSuccess] = useState(null);
    const [responseError , setResponseError] = useState(null);
	const userTypes = [
		"Faculty",
		"Admin",
		"Visiting / Guest Faculty",
		"Permanent Staff",
		"Contractual Staff",
		"Research Scholars/PhD",
		"PG Student",
		"UG Students",
		"Young Learner",
	];

	const validate = () => {
		const errors = {};
		if (!username) {
			errors.username = "Username is required";
		} else if (username.length < 4 || username.length > 12) {
			errors.username = "Username must be between 4 and 12 characters";
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!email) {
			errors.email = "Email is required";
		} else if (!emailRegex.test(email)) {
			errors.email = "Email is not valid";
		}

		const contactNumberRegex = /^\d{10}$/;
		if (!contactNumber) {
			errors.contactNumber = "Contact number is required";
		} else if (!contactNumberRegex.test(contactNumber)) {
			errors.contactNumber = "Contact number must be a 10-digit number";
		}

		if (!userType) {
			errors.userType = "User type is required";
		}

		const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,12}$/;
		if (!password) {
			errors.password = "Password is required";
		} else if (!passwordRegex.test(password)) {
			errors.password =
				"Password must be alphanumeric, contain at least one letter and one number, and be between 4 and 12 characters long";
		}

		return errors;
	};
	const handleSubmit = async (e) => {
        setFormLoading(true);   
        setSuccess(null);
        setErrors({});
        setResponseError(null);
		e.preventDefault();
		const validationErrors = validate();
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
            setFormLoading(false);
			return;
		}
		try {
			const response = await fetch(
				`${process.env.REACT_APP_API_BASE_URL}/admin/addUser`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
                    credentials: 'include',
					body: JSON.stringify({
						username,
						email,
						contactNumber,
						userType,
						password,
					}),
				}
			);
			if (!response.ok) {
                const errorData = await response.json().catch(() => {
                    throw new Error("Network response was not ok");
                });
                throw new Error(errorData.error || "Network response was not ok");
			}
			setUsername("");
			setEmail("");
			setContactNumber("");
			setUserType("");
			setPassword("");
            setSuccess("User added successfully");
		} catch (error) {
			setResponseError(error.message);
		} finally{
            setFormLoading(false);
        }
	};

	return (
		<div className="max-w-md mx-auto mt-10 p-6 bg-slate-300 rounded-lg shadow-md">
			<h1 className="text-2xl font-bold mb-6 text-center">Add User</h1>
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
				<div className="mb-4">
					<label className="block text-gray-700 font-bold mb-2">
						Email
					</label>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					{errors.email && (
						<p className="text-red-500 text-sm mt-1">
							{errors.email}
						</p>
					)}
				</div>
				<div className="mb-4">
					<label className="block text-gray-700 font-bold mb-2">
						Contact Number
					</label>
					<input
						type="text"
						value={contactNumber}
						onChange={(e) => setContactNumber(e.target.value)}
						className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					{errors.contactNumber && (
						<p className="text-red-500 text-sm mt-1">
							{errors.contactNumber}
						</p>
					)}
				</div>
				<div className="mb-4">
					<label className="block text-gray-700 font-bold mb-2">
						User Type
					</label>
					<select
						value={userType}
						onChange={(e) => setUserType(e.target.value)}
						className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="">Select User Type</option>
						{userTypes.map((type) => (
							<option key={type} value={type}>
								{type}
							</option>
						))}
					</select>
					{errors.userType && (
						<p className="text-red-500 text-sm mt-1">
							{errors.userType}
						</p>
					)}
				</div>
				<div className="mb-4">
					<label className="block text-gray-700 font-bold mb-2">
						Password
					</label>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					{errors.password && (
						<p className="text-red-500 text-sm mt-1">
							{errors.password}
						</p>
					)}
				</div>
                <button
                    type="submit"
                    className={`w-full text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                    disabled={formLoading}
                >
                    {formLoading ? 'Adding User...' : 'Add User'}
                </button>
                {success && <p className="text-green-500 text-center mt-2">{success}</p>}
                {responseError && <p className="text-red-500 text-center mt-2">{responseError}</p>}
			</form>
		</div>
	);
};

export default AdminAddUser;
