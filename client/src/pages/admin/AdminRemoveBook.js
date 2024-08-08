import React, { useState } from "react";

const AdminRemoveBook = () => {
	const [bookId, setBookId] = useState("");
	const [errors, setErrors] = useState({});
    const [formLoading, setFormLoading] = useState(false);
    const [success , setSuccess] = useState(null);
    const [responseError , setResponseError] = useState(null);
	const validate = () => {
        const errors = {};
        if (!bookId) {
            errors.bookId = "Book ID is required";
        } else if (!/^[A-Z]\d{4}$/.test(bookId)) {
            errors.bookId = "Invalid BookId";
        }
        return errors;
	};

	const handleSubmit = async (e) => {
        if(formLoading) return;
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
				`http://localhost:8000/api/admin/removeBook/${bookId}`,
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
			setBookId("");
			setErrors({});
            const data = await response.json();
            setSuccess(data.message);
		} catch (error) {
			setResponseError(error.message);
		} finally{
            setFormLoading(false);
        }
	};

	return (
		<div className="max-w-md mx-auto mt-10 p-6 bg-slate-300 rounded-lg shadow-md">
			<h1 className="text-2xl font-bold mb-6 text-center">Remove Book</h1>
			<form onSubmit={handleSubmit}>
				<div className="mb-4">
					<label className="block text-gray-700 font-bold mb-2">
						Book ID
					</label>
					<input
						type="text"
						value={bookId}
						onChange={(e) => setBookId(e.target.value)}
						className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					{errors.bookId && (
						<p className="text-red-500 text-sm mt-1">
							{errors.bookId}
						</p>
					)}
				</div>
				<button
					type="submit"
					className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					Remove Book
				</button>
                {success && <p className="text-green-500 text-sm mt-1">{success}</p>}
                {responseError && <p className="text-red-500 text-sm mt-1">{responseError}</p>}
			</form>
		</div>
	);
};

export default AdminRemoveBook;
