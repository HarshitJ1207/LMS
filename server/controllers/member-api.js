const moment = require("moment");
const User = require("../models/user");
const Book = require("../models/book");
const perPage = 30;
const jwt = require("jsonwebtoken");

const calculateDaysOverdue = (dateofReturn, returnDate) => {
	const returnDateMoment = moment(returnDate);
	const dateofReturnMoment = moment(dateofReturn);
	const daysOverdue = dateofReturnMoment.diff(returnDateMoment, "days");
	return daysOverdue > 0 ? daysOverdue : 0;
};

const calculateFine = (daysOverdue) => {
	const finePerDay = 15;
	return daysOverdue * finePerDay;
};

exports.getLoginStatus = async (req, res) => {
	try {
		if (req.user)
			return res.json({ userType: req.user.details.userType});
		else return res.json({ userType: false });
	} catch (error) {
		console.log(error);
		return res.json({ userType: false });
	}
};

exports.postLogin = async (req, res) => {
	try {
		const { username, password } = req.body;
		console.log("Login attempt:", req.body);
		const user = await User.findOne({
			"details.username": username,
			"details.password": password,
		});

		if (!user) {
			return res.status(401).json({
				error: "Email and Password do not match",
			});
		}
		const token = jwt.sign(
			{ username: user.details.username },
			process.env.JWT_SECRET,
			{ expiresIn: "1h" }
		);
        res.status(200).json({ token, userType: user.details.userType });
	} catch (error) {
		console.error("Internal server error:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

exports.getBooks = async (req, res) => {
	try {
		console.log(req.query);
		const {
			page = 1,
			searchType = "title",
			searchValue = "",
			subject = "",
		} = req.query;

		const decodedPage = parseInt(page, 10);
		if (isNaN(decodedPage) || decodedPage < 1) {
			decodedPage = 1;
		}

		const decodedSearchType = `details.${decodeURIComponent(searchType)}`;
		const decodedSearchValue = decodeURIComponent(searchValue);
		const decodedSubject = decodeURIComponent(subject);

		const query = {
			[decodedSearchType]: { $regex: decodedSearchValue, $options: "i" },
			"details.subject": { $regex: decodedSubject, $options: "i" },
		};

		console.log(query);

		const bookList = await Book.find(query)
			.skip((decodedPage - 1) * perPage)
			.limit(perPage);
		res.status(200).json({ bookList });
	} catch (error) {
		console.error("Error fetching books:", error);
		if (error instanceof SyntaxError) {
			res.status(400).json({ error: "Invalid query parameters" });
		} else if (error.name === "MongoError") {
			res.status(500).json({ error: "Database error" });
		} else {
			res.status(500).json({ error: "Internal server error" });
		}
	}
};

exports.getMe = async (req, res) => {
	console.log("GET /api/member/me", req.user);
	try {
		if (!req.user) {
			return res.status(401).json({ error: "Unauthorized" });
		}

		const user = await User.findOne({
			"details.username": req.user.details.username,
		})
        .populate({
            path: "issueHistory",
            model: "BookIssue",
            populate: {
                path: "bookID",
                model: "Book",
            },
        })
        .populate({
            path: "currentIssues",
            model: "BookIssue",
            populate: {
                path: "bookID",
                model: "Book",
            },
        });

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}
		const userCopy = JSON.parse(JSON.stringify(user));
		let totalFine = 0;
		userCopy.currentIssues.forEach((issue) => {
			const currentDate = new Date();
			const daysOverdue = calculateDaysOverdue(
				currentDate,
				issue.returnDate
			);
			const fine = calculateFine(daysOverdue);
			issue.daysOverdue = daysOverdue;
			issue.fine = fine;
			totalFine += fine;
		});

		userCopy.issueHistory.forEach((issue) => {
			const daysOverdue = calculateDaysOverdue(
				issue.dateofReturn,
				issue.returnDate
			);
			const fine = calculateFine(daysOverdue);
			issue.daysOverdue = daysOverdue;
			issue.fine = fine;
		});
		console.log(totalFine);
		userCopy.overdueFine = totalFine;
		res.status(200).json({ user: userCopy });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};


exports.postSignup = async (req, res) => {
	const { username, email, contactNumber, password, confirmPassword } =
		req.body;

	const validateForm = (data) => {
		const { username, password, confirmPassword, contactNumber } = data;

		if (username.length < 4 || username.length > 12) {
			return "Username must be between 4 and 12 characters long";
		}
		if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,12}$/.test(password)) {
			return "Password must be alphanumeric, contain at least one letter and one number, and be between 4 and 12 characters long";
		}
		if (password !== confirmPassword) {
			return "Passwords must match";
		}
		if (!/^\d{10}$/.test(contactNumber)) {
			return "Contact number must be 10 digits";
		}
		if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
			return "Invalid email address";
		}
		return null;
	};

	const validationError = validateForm({
		username,
		password,
		confirmPassword,
		contactNumber,
	});
	if (validationError) {
		return res.status(400).json({ error: validationError });
	}
	try {
		const user = await User.create({
			details: {
				username: username,
				email: email,
				contactNumber: contactNumber,
				password: password,
			},
		});
		res.status(201).json({ message: "User created successfully", user });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
