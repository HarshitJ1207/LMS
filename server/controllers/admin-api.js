const moment = require('moment');   
const { validationResult } = require('express-validator')

const User = require('../models/user');
const Book = require('../models/book');
const BookIssue = require('../models/bookIssue');
const dbs = require('../models/databaseStats');



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

exports.getusers = async (req, res) => {
    try {
        const { searchType, searchValue, userType } = req.query;
        console.log(req.query);
        const query = {};
        if (searchValue && searchValue.trim() !== '') {
            query[`details.${searchType}`] = { $regex: searchValue, $options: 'i' };
        }
        if (userType && userType !== 'any') {
            query['details.userType'] = userType;
        }
        const userList = await User.find(query);
        res.status(200).json({
            userList,
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getuser = async (req, res) => {
    try {
        const user = await User.findOne({ 'details.username': req.params.username })
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
exports.postAddUser = async (req, res) => {
    try {
        const errors = validationResult(req).array();
        if (errors.length) {
            return res.status(400).json({
                error: "validation failed",
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
            case 'UG Students':
                maxBooks = 4;
                issueDuration = 15;
                break;
            case 'Young Learner':
                maxBooks = 3;
                issueDuration = 15;
                break;
            default:
                maxBooks = 3;
                issueDuration = 15;
                break;
        }
        const user = await User.create({
            details: {
                username: req.body.username,
                email: req.body.email,
                contactNumber: req.body.contactNumber,
                userType: req.body.userType,
                password: req.body.password,
            },
            admin: req.body.userType === 'Admin',
            bookIssuePrivilege: {
                maxBooks: maxBooks,
                issueDuration: issueDuration,
            },
        });
        await user.save();
        const stats = await dbs.findOne();
        stats.recentActivities.push(`New user ${req.body.username} added`);
        if (stats.recentActivities.length > 100) {
            stats.recentActivities.shift();
        }
        await stats.save();
        res.status(201).json({
            message: 'User successfully added'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error.message
        });
    }
};


exports.deleteUser = async (req, res) => {
    console.log('delete user request', req.params);
    try {
        const username = req.params.username.trim();
        const user = await User.findOne({ 'details.username': username });
        if (!user) {
            return res.status(404).json({
                error: 'User not found'
            });
        }
        if (user.currentIssues.length > 0) {
            return res.status(400).json({
                error: 'User cannot be deleted due to pending book returns'
            });
        }
        await User.deleteOne({ 'details.username': username });
        const stats = await dbs.findOne();
        stats.recentActivities.push(`User ${username} deleted`);
        if (stats.recentActivities.length > 100) {
            stats.recentActivities.shift();
        }
        await stats.save();
        res.status(200).json({
            message: 'User successfully deleted'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error.message
        });
    }
};

exports.postAddBook = async (req, res) => {
    console.log(req.body);
    try {
        const errors = validationResult(req).array();
        if (errors.length) {
            return res.status(400).json({
                error: errors[0].msg,
            });
        }
        const doc = await dbs.findOne();
        const bookID = newBookID(doc.lastAllocatedBookID);
        const book = await Book.create({
            bookID: bookID,
            details: {
                subject: req.body.subject,
                title: req.body.title,
                author: req.body.author,
                ISBN: req.body.ISBN,
            },
        });
        doc.lastAllocatedBookID = bookID;
        await book.save();
        await doc.save();
        const stats = await dbs.findOne();
        stats.recentActivities.push(`New book ${bookID} added`);
        if (stats.recentActivities.length > 100) {
            stats.recentActivities.shift();
        }
        await stats.save();
        res.status(201).json({
            message: 'Book Successfully Added',
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};


exports.deleteBook = async (req, res) => {
    try {
        const errors = validationResult(req).array();
        if (errors.length) {
            return res.status(400).json({
                error: errors[0].msg,
            });
        }
        const bookID = req.params.bookID;
        const book = await Book.findOne({ bookID: bookID });
        if (!book) {
            return res.status(404).json({
                error: 'Book not found',
            });
        }
        if (!book.availability) {
            return res.status(400).json({
                error: 'Book is currently issued to a user and cannot be deleted',
            });
        }
        await Book.findOneAndDelete({ bookID: bookID });
        const stats = await dbs.findOne();
        stats.recentActivities.push(`Book ${bookID} deleted`);
        if (stats.recentActivities.length > 100) {
            stats.recentActivities.shift();
        }
        await stats.save();
        res.status(200).json({
            message: 'Book Successfully Deleted',
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};

exports.postBookIssue = async (req, res) => {
    console.log(req.body);
    try {
        const book = await Book.findOne({ 'bookID': req.body.bookID });
        const user = await User.findOne({ 'details.username': req.body.username });

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
        stats.recentActivities.push(`Book ${book.bookID} issued to ${user.details.username}`);
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
        if (!req.query.bookID) {
            return res.status(400).json({ error: 'BookID is required' });
        }
        const book = await Book.findOne({ 'bookID': req.query.bookID });
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
        res.status(200).json({ user: user.details.username, daysOverdue: daysOverdue, fine: fine });
    } catch (err) {
        console.error('Error fetching issue data:', err); 
        res.status(500).json({ error: err.message || 'Internal server error' }); 
    }
};

exports.postBookReturn = async (req, res) => {
    try {
        const book = await Book.findOne({ 'bookID': req.body.bookID });
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
        stats.recentActivities.push(`Book ${book.bookID} returned by ${user.details.username}`);
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
        let book = await Book.findOne({ bookID: req.params.bookID });
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

