const moment = require('moment');   
const { validationResult } = require('express-validator')

const User = require('../models/user');
const Book = require('../models/book');
const BookIssue = require('../models/bookIssue');
const dbs = require('../models/databaseStats');
const perPage = 30;


function newBookID(oldBookID){
    if(!oldBookID) return 'A0000';
    let num = parseInt(oldBookID.substring(1), 10);
    let A = oldBookID.charAt(0);
    if(num === 9999){
        num = 0;
        A = String.fromCharCode(A.charCodeAt(0) + 1);
    }
    else num++;
    num = String(num).padStart(4, '0');
    return A + num;
};


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

exports.getDashboard = async (req, res) => {
    try {
        const stats = await dbs.findOne();
        res.status(200).json({
            totalBooks: stats.totalBooks,
            totalUsers: stats.totalUsers,
            recentActivities: stats.recentActivities,
            activeUsers: stats.activeUsers,
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


exports.getusers = async (req, res) => {
    try {
        console.log(req.query);
        const {
            page = 1,
            searchType = "name",
            searchValue = "",
            userType = "any",
        } = req.query;
        let decodedPage = parseInt(page, 10);
        if (isNaN(decodedPage) || decodedPage < 1) {
            decodedPage = 1;
        }
        const decodedSearchType = decodeURIComponent(searchType) === 'username' ? decodeURIComponent(searchType): `details.${decodeURIComponent(searchType)}`;
        const decodedSearchValue = decodeURIComponent(searchValue).trim();
        const decodedUserType = decodeURIComponent(userType);
        const query = {
            [decodedSearchType]: { $regex: decodedSearchValue, $options: "i" },
        };

        if (decodedUserType !== "any") {
            query["details.userType"] = decodedUserType;
        }
        console.log(query);
        const userList = await User.find(query).skip((decodedPage - 1) * perPage)
        .limit(perPage);
        const totalUsers = await User.countDocuments(query);
        const maxPage = Math.ceil(totalUsers / perPage);
        res.status(200).json({userList, maxPage});
    } catch (error) {
        console.error("Error fetching users:", error);
        if (error instanceof SyntaxError) {
            res.status(400).json({ error: "Invalid query parameters" });
        } else if (error.name === "MongoError") {
            res.status(500).json({ error: "Database error" });
        } else {
            res.status(500).json({ error: "Internal server error" });
        }
    }
};

exports.getuser = async (req, res) => {
    try {
        const user = await User.findOne({ 'username': req.params.username.trim().toLowerCase()})
        .populate({
            path: 'issueHistory',
            model: 'BookIssue',
            populate: {
                path: 'bookID',
                model: 'Book'
            }
        })
        .populate({
            path: 'currentIssues',
            model: 'BookIssue',
            populate: {
                path: 'bookID',
                model: 'Book'
            }
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const userCopy = JSON.parse(JSON.stringify(user));
        let totalFine = 0;
        userCopy.currentIssues.forEach(issue => {
            const currentDate = new Date();
            const daysOverdue = calculateDaysOverdue(currentDate, issue.returnDate);
            const fine = calculateFine(daysOverdue);
            issue.daysOverdue = daysOverdue;
            issue.fine = fine;
            totalFine += fine;
        });

        userCopy.issueHistory.forEach(issue => {
            const daysOverdue = calculateDaysOverdue(issue.dateofReturn, issue.returnDate);
            const fine = calculateFine(daysOverdue);
            issue.daysOverdue = daysOverdue;
            issue.fine = fine;
        });
        console.log(totalFine);
        userCopy.overdueFine = totalFine;
        res.status(200).json({ user: userCopy });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
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

exports.postAddUser = async (req, res) => {
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
        let maxBooks = 0;
        let issueDuration = 0;
        switch (req.body.userType) {
            case 'Faculty':
            case 'Admin':
                maxBooks = 20;
                issueDuration = 90;
                break;
            case 'Visiting / Guest Faculty':
                maxBooks = 5;
                issueDuration = 90;
                break;
            case 'Permanent Staff':
                maxBooks = 5;
                issueDuration = 30;
                break;
            case 'Contractual Staff':
                maxBooks = 3;
                issueDuration = 30;
                break;
            case 'Research Scholars/PhD':
                maxBooks = 8;
                issueDuration = 30;
                break;
            case 'PG Student':
                maxBooks = 6;
                issueDuration = 30;
                break;
            case 'UG Student':
                maxBooks = 4;
                issueDuration = 15;
                break;
            case 'Young Learner':
                maxBooks = 3;
                issueDuration = 15;
                break;
            default:
                return res.status(400).json({
                    errors: {message: 'Invalid user type'},
                });
        }
        const user = await User.create({
            username: await generateUsername(req.body.firstName, req.body.lastName),
            password: req.body.password,
            details: {
                email: req.body.email.trim().toLowerCase(),
                contactNumber: req.body.contactNumber.trim(),
                userType: req.body.userType.trim(),
                firstName: req.body.firstName.trim(),
                lastName: req.body.lastName.trim(),
            },
            admin: req.body.userType === 'Admin',
            bookIssuePrivilege: {
                maxBooks: maxBooks,
                issueDuration: issueDuration,
            },
        });
        await user.save();
        const stats = await dbs.findOne();
        stats.recentActivities.push(`New user ${user.username} added`);
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


exports.deleteUser = async (req, res) => {
    console.log('delete user request', req.params);
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
        const username = req.params.username.toLowerCase().trim();
        await User.findOneAndDelete({ 'username': username });
        const stats = await dbs.findOne();
        stats.recentActivities.push(`User ${username} deleted`);
        if (stats.recentActivities.length > 100) {
            stats.recentActivities.shift();
        }
        stats.totalUsers--;
        await stats.save();
        res.status(200).json({
            message: 'User successfully deleted'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            errors: {message: error.message},
        });
    }
};

exports.postAddBook = async (req, res) => {
    console.log(req.body);
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
        const doc = await dbs.findOne();
        const bookID = newBookID(doc.lastAllocatedBookID);
        const book = await Book.create({
            bookID: bookID,
            details: {
                subject: req.body.subject.trim(),
                title: req.body.title.trim(),
                author: req.body.author.trim(),
                ISBN: req.body.ISBN.trim(),
            },
        });
        doc.lastAllocatedBookID = bookID;
        await book.save();
        await doc.save();
        const stats = await dbs.findOne();
        stats.recentActivities.push(`New book ${bookID} added: ${req.body.title}`);
        if (stats.recentActivities.length > 100) {
            stats.recentActivities.shift();
        }
        stats.totalBooks++;
        await stats.save();
        res.status(201).json({
            message: 'Book Successfully Added',
        });
    } catch (error) {
        res.status(500).json({
            errors: {message: error.message},
        });
    }
};


exports.deleteBook = async (req, res) => {
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
        const bookID = req.params.bookID.trim();
        await Book.findOneAndDelete({ bookID: bookID });
        const stats = await dbs.findOne();
        stats.recentActivities.push(`Book ${bookID} deleted`);
        if (stats.recentActivities.length > 100) {
            stats.recentActivities.shift();
        }
        stats.totalBooks--;
        await stats.save();
        res.status(200).json({
            message: 'Book Successfully Deleted',
        });
    } catch (error) {
        res.status(500).json({
            errors: {
                message: error.message,
            }
        });
    }
};

exports.postBookIssue = async (req, res) => {
    console.log(req.body);
    try {
        const book = await Book.findOne({ 'bookID': req.body.bookID.trim() });
        const user = await User.findOne({ 'username': req.body.username.trim().toLowerCase() });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        if (user.currentIssues.length >= user.bookIssuePrivilege.maxBooks) {
            return res.status(400).json({ error: 'User has already issued the maximum number of books' });
        }
        if (!book.availability) {
            return res.status(400).json({ error: 'Book is not available' });
        }

        const currentDate = new Date();
        const returnDate = new Date(currentDate);
        returnDate.setDate(returnDate.getDate() + user.bookIssuePrivilege.issueDuration);

        const bookIssue = new BookIssue({
            bookID: book._id,
            userID: user._id,
            issueDate: currentDate,
            returnDate: returnDate,
        });

        user.currentIssues.push(bookIssue._id);
        book.issueHistory.push(bookIssue._id);
        book.availability = false;

        await bookIssue.save();
        await user.save();
        await book.save();
        const stats = await dbs.findOne();
        stats.recentActivities.push(`Book ${book.bookID} issued to ${user.username}`);
        if (stats.recentActivities.length > 100) {
            stats.recentActivities.shift();
        }
        await stats.save();
        res.status(200).json({ message: 'Book successfully issued' });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.getIssueData = async (req, res) => {
    try {
        console.log(req.query);
        if (!req.query.bookID.trim()) {
            return res.status(400).json({ error: 'BookID is required' });
        }
        const book = await Book.findOne({ 'bookID': req.query.bookID.trim()});
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        if (book.availability) {
            return res.status(404).json({ error: 'No issue found for the book' });
        }
        if (book.issueHistory.length === 0) throw new Error;
        const bookIssueID = book.issueHistory[book.issueHistory.length - 1];
        const bookIssue = await BookIssue.findById(bookIssueID);
        if (!bookIssue) {
            return res.status(404).json({ error: 'Issue record not found' });
        }
        const user = await User.findById(bookIssue.userID);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const daysOverdue = calculateDaysOverdue(new Date(), bookIssue.returnDate);
        const fine = daysOverdue * 15;
        res.status(200).json({ user: user.username, daysOverdue: daysOverdue, fine: fine });
    } catch (err) {
        console.error('Error fetching issue data:', err); 
        res.status(500).json({ error: 'Internal server error' }); 
    }
};

exports.postBookReturn = async (req, res) => {
    try {
        const book = await Book.findOne({ 'bookID': req.body.bookID.trim() });
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        const bookIssueID = book.issueHistory[book.issueHistory.length - 1];
        const bookIssue = await BookIssue.findById(bookIssueID);
        if (!bookIssue) {
            return res.status(404).json({ error: 'Book issue record not found' });
        }
        const user = await User.findById(bookIssue.userID);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        bookIssue.returnStatus = true;
        bookIssue.dateofReturn = new Date();
        book.availability = true;
        user.issueHistory.push(bookIssue);
        user.currentIssues = user.currentIssues.filter(element => !element.equals(bookIssue._id));
        await Promise.all([
            bookIssue.save(),
            book.save(),
            user.save()
        ]);
        const stats = await dbs.findOne();
        stats.recentActivities.push(`Book ${book.bookID} returned by ${user.username}`);
        if (stats.recentActivities.length > 100) {
            stats.recentActivities.shift();
        }
        await stats.save();
        res.status(200).json({ message: 'Book successfully returned' });
    } catch (err) {
        console.error('Error returning book:', err); 
        res.status(500).json({ message: 'Internal server error' }); 
    }
};

exports.getBook = async (req, res) => {
    try {
        let book = await Book.findOne({ bookID: req.params.bookID.trim() });
        if (!book) {
            res.status(404).json({ error: 'Book not found' });
            return;
        }
        await book.populate('issueHistory');
        await book.populate('issueHistory.userID');
        console.log(book);
        res.status(200).json({
            book: book
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

