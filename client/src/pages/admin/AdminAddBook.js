import React, { useState } from "react";

const AdminAddBook = () => {
	const [title, setTitle] = useState("");
	const [author, setAuthor] = useState("");
	const [subject, setSubject] = useState("");
	const [isbn, setIsbn] = useState("");
	const [errors, setErrors] = useState({});
    const [formLoading, setFormLoading] = useState(false);
    const [success , setSuccess] = useState(null);
    const [responseError , setResponseError] = useState(null);

	const validate = () => {
		const errors = {};
		if (title.length > 100)
			errors.title = "Title must be less than 100 characters";
		if (author.length > 100)
			errors.author = "Author must be less than 100 characters";
		if (subject.length > 100)
			errors.subject = "Subject must be less than 100 characters";
		if (!/^\d{13}$/.test(isbn))
			errors.isbn = "ISBN must be a 13-digit number";
		return errors;
	};

	const handleSubmit = async (e) => {
        if(formLoading) return;
        setFormLoading(true);
        setSuccess(null);
        setResponseError(null);
        setErrors({});
		e.preventDefault();
		const validationErrors = validate();
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
            setFormLoading(false);
			return;
		}
		try {
			const response = await fetch(
				`${process.env.REACT_APP_API_BASE_URL}/admin/addBook`,
				{
					method: "POST",
                    credentials: 'include',
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						title,
						author,
						subject,
						ISBN:isbn,
					}),
				}
			);
			if (!response.ok) {
                const errorData = await response.json().catch(() => {
                    throw new Error('Network response was not ok');
                });
                throw new Error(errorData.error || 'Network response was not ok');
			}
			setTitle("");
			setAuthor("");
			setSubject("");
			setIsbn("");
            const data = await response.json();
            setSuccess(data.message);   
		} catch (error) {
			setResponseError(error.message);
		} finally{
            setFormLoading(false);
        }
	};

	return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-slate-300 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-6 text-center">Add Book</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>
                <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Author</label>
                <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author}</p>}
                </div>
                <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Subject</label>
                <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                </div>
                <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">ISBN</label>
                <input
                    type="text"
                    value={isbn}
                    onChange={(e) => setIsbn(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.isbn && <p className="text-red-500 text-sm mt-1">{errors.isbn}</p>}
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
                    {formLoading ? 'Loading...' : 'Add Book'}
                </button>
                {responseError && <p className="text-red-500 text-sm mt-1">{responseError}</p>}
                {success && <p className="text-green-500 text-sm mt-1">{success}</p>}
            </form>
        </div>
    );
};

export default AdminAddBook;
