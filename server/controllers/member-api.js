const moment = require("moment");
const User = require("../models/user");
const Book = require("../models/book");
const dbs = require("../models/databaseStats");
const perPage = 30;
const jwt = require("jsonwebtoken");
const { validationResult } = require('express-validator')


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
        let { identifier, password } = req.body;
        identifier = identifier.toLowerCase().trim();
        console.log("Login attempt:", req.body);

        const user = await User.findOne({
            $or: [
                { 'details.email': identifier, password: password },
                { username: identifier, password: password }
            ]
        });

        if (!user) {
            return res.status(401).json({
                error: "Username/Email and Password do not match",
            });
        }

        const token = jwt.sign(
            { username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.status(200).json({ token, userType: user.details.userType });
    } catch (error) {
        console.error("Internal server error:", error);
        return res.status(500).json({ error: error.message });
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
		const totalBooks = await Book.countDocuments(query);
		const maxPage = Math.ceil(totalBooks / perPage);
		res.status(200).json({ bookList, maxPage });
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
			"username": req.user.username,
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


async function generateUsername(firstName, lastName) {
    firstName = firstName.toLowerCase();
    lastName = lastName.toLowerCase();
    const prefix = `${firstName}.${lastName[0]}`;

    const users = await User.find({ username: { $regex: `^${prefix}` } }, 'username');
    const existingUsernames = new Set(users.map(user => user.username));

    let username = prefix;
    let index = 1;

    while (existingUsernames.has(username) && index <= lastName.length) {
        username = `${firstName}.${lastName.slice(0, index + 1)}`;
        index++;
    }

    let suffix = 1;
    while (existingUsernames.has(username)) {
        username = `${prefix}${suffix}`;
        suffix++;
    }
    return username;
}

exports.postSignup = async (req, res) => {
	try {
        const errors = validationResult(req).array();
        console.log(errors);    
        const errorObj = {};
        errors.forEach(error => { errorObj[error.path] = error.msg });
        if (errors.length) {
            return res.status(400).json({
                errors: errorObj,
            });
        }
        const user = await User.create({
            username: await generateUsername(req.body.firstName, req.body.lastName),
            password: req.body.password,
            details: {
                email: req.body.email.trim().toLowerCase(),
                contactNumber: req.body.contactNumber.trim(),
                firstName: req.body.firstName.trim(),
                lastName: req.body.lastName.trim(),
            },
        });
        await user.save();
        const stats = await dbs.findOne();
        stats.recentActivities.push(`New guest user ${user.username} added`);
        if (stats.recentActivities.length > 100) {
            stats.recentActivities.shift();
        }
        stats.totalUsers++;
        await stats.save();
        res.status(201).json({
            message: 'User successfully added: ' + user.username,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            errors: {message: error.message},
        });
    }
};
