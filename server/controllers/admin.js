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

function daysDiff(date1, date2) {
    date1.setHours(0, 0, 0, 0);
    date2.setHours(0, 0, 0, 0);
    if(date2 >= date1) return 0;
    const oneDay = 24 * 60 * 60 * 1000;
    const timeDifference = date1.getTime() - date2.getTime();
    const daysDifference = Math.round(timeDifference / oneDay);
    return daysDifference;
}

async function calulateFines() {
    const currentDate = new Date();
    const doc = await dbs.findOne();
    const oldDate = doc.lastUpdate;

    if (oldDate && daysDiff(currentDate, oldDate) === 0) {
        return;
    }

    doc.lastUpdate = currentDate;
    await doc.save();

    const users = await User.find();

    for (const user of users) {
        let fine = 0;
        await user.populate('currentIssues');

        for (const issue of user.currentIssues) {
            fine += Math.max(0, daysDiff(currentDate, issue.returnDate)) * 15;
        }

        user.overdueFine = fine;
        await user.save();
    }
};

exports.getAdminDashboard = async (req , res, next) => {
    try {
        const flashMsg = await req.flash('msg');
        res.render('./admin/adminDashboard', {
            flashMsg: flashMsg.length? flashMsg[0]: undefined
        });
    } catch (error) {
        console.log(error);
        next();
    }
};

exports.getusers = async (req , res, next) => {
    try {
        if(Object.keys(req.query).length === 0) {
            let userList = await User.find();
            const flashMsg = await req.flash('msg');
            res.render('./admin/users', {
                'userList': userList,
                flashMsg: flashMsg.length? flashMsg[0]: undefined
            });
            return;
        }
        let searchType = `details.${req.query.searchType}`;
        let searchValue = req.query.searchValue;
        let userType = req.query.userType;
        let userList;
        if(userType === 'any') userList = await User.find({ [searchType] : { $regex: searchValue, $options: 'i' } });
        else userList = await User.find({ [searchType] : { $regex: searchValue, $options: 'i' }  , 'details.userType': userType});
        const flashMsg = await req.flash('msg');
        res.render('./admin/users', {
            userList: userList,
            searchType: req.query.searchType,
            searchValue: searchValue,
            userType: userType,
            flashMsg: flashMsg.length? flashMsg[0]: undefined
        });
    } catch (error) {
        console.log(error);
        next();
    }
}; 
exports.getuser = async (req , res , next) => {
    try {
        let user = await User.findOne({'details.username': req.params.username});
        if(!user) res.redirect('/admin/users');
        await user.populate('issueHistory');
        await user.populate('currentIssues');
        await user.populate('issueHistory.bookID');
        await user.populate('currentIssues.bookID');
        const flashMsg = await req.flash('msg');
        res.render('./admin/user', {
            user : user,
            flashMsg: flashMsg.length? flashMsg[0]: undefined
        }); 
    } catch (error) {
        console.log(error);
        next();
    }
}; 

exports.getAddUser = async (req , res, next) => {
    try {
        const flashMsg = await req.flash('msg');
        res.render('./admin/addUser', {
            error: undefined,
            oldInput: {
                'username': '',
                'email': '',
                'contactNumber': '',
                'userType': '',
                'password': '',
            },
            flashMsg: flashMsg.length? flashMsg[0]: undefined
        });
    } catch (error) {
        console.log(error);
        next();
    }
}; 
exports.postAddUser = async (req, res, next) => {
    try {
        const errors = validationResult(req).array();
        if(errors.length){
            console.log(errors);
            console.log(errors[0]);
            const flashMsg = await req.flash('msg');
            res.render('./admin/addUser', {
                error: errors[0],
                oldInput: req.body,
                flashMsg: flashMsg.length? flashMsg[0]: undefined
            });
            return;
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
        User.create({
            details: {
                username: req.body.username,
                email: req.body.email,
                contactNumber: req.body.contactNumber,
                userType: req.body.userType,
                password: req.body.password,
            },
            admin: req.body.userType === 'Admin' ? true : false,
            bookIssuePrivilege: {
                maxBooks: maxBooks,
                issueDuration: issueDuration,
            },
        })
        .then((user) => user.save())
        .then(async() => {
            await req.flash('msg', 'User Successfully Added');
            res.redirect('/admin/users')
        })
        .catch((err) => {
            console.log(err);
            next();
        });
    } catch (error) {
        console.log(error);
        next();
    }
};


exports.getBooks = async (req , res ,next) => {
    try {
        let page = +req.query.page;
        if(!page) page = 1;
        if(Object.keys(req.query).length < 2) {
            let bookList = await Book.find().skip((page - 1)*perPage).limit(perPage);
            const totalProducts = await Book.find().countDocuments();
            const flashMsg = await req.flash('msg');
            res.render('./admin/books', {
                'bookList': bookList,
                page: page,
                lastPage: Math.ceil(totalProducts/perPage),
                searchType: 'title',
                searchValue: '',
                subject: '',
                flashMsg: flashMsg.length? flashMsg[0]: undefined
            });
            return;
        }
        let searchType = `details.${req.query.searchType}`;
        let searchValue = req.query.searchValue;
        let subject = req.query.subject;
        let bookList = await Book.find({ [searchType] : { $regex: searchValue, $options: 'i' } , 'details.subject': { $regex: subject, $options: 'i' }})
        .skip((page - 1)*perPage).limit(perPage);
        const totalProducts = await Book.find({ [searchType] : { $regex: searchValue, $options: 'i' } , 'details.subject': { $regex: subject, $options: 'i' }}).countDocuments();
        const flashMsg = await req.flash('msg');
        res.render('./admin/books', {
            'bookList': bookList,
            page: page,
            lastPage: Math.ceil(totalProducts/perPage),
            searchType: req.query.searchType,
            searchValue: searchValue,
            subject: subject,
            flashMsg: flashMsg.length? flashMsg[0]: undefined
        });
    } catch (error) {
        console.log(error);
        next();
    }

}; 

exports.getAddBook = async(req , res, next) => {
    try {
        const flashMsg = await req.flash('msg');
        res.render('./admin/addBook', {
            error: undefined,
            oldInput: {
                'title': '',
                'author': '',
                'subject': '',
                'ISBN': '',
            },
            flashMsg: flashMsg.length? flashMsg[0]: undefined
        });
    } catch (error) {
        console.log(error);
        next();
    }
};


exports.postAddBook = async (req , res , next) => {
    try {
        const errors = validationResult(req).array();
        if(errors.length){
            const flashMsg = await req.flash('msg');
            res.render('./admin/addBook', {
                error: errors[0],
                oldInput: req.body,
                flashMsg: flashMsg.length? flashMsg[0]: undefined
            });
            return;
        }
        const doc = await dbs.findOne();
        const bookID = newBookID(doc.lastAllocatedBookID);
        const book = await Book.create({
            bookID: bookID,
            details: {
                subject: req.body.subject,
                title: req.body.title,
                author: req.body.author,
                subject: req.body.subject,
                ISBN: req.body.ISBN,
            },
        });
        doc.lastAllocatedBookID = bookID;
        await book.save();
        await doc.save();
        await req.flash('msg' , 'Book Successfully Added');
        res.redirect('/admin/books');
    } catch (error) {
        console.log(error);
        next();
    }
};

exports.getBookIssue = async (req , res, next) => {
    try {
        const flashMsg = await req.flash('msg');
        res.render('./admin/bookIssue' , {
            error: undefined,
            oldInput: {
                'bookID': '',
                'username': '',
            },
            flashMsg: flashMsg.length? flashMsg[0]: undefined
        });
    } catch (error) {
        console.log(error);
        next();
    }
}; 

exports.postBookIssue = async (req, res, next) => {
    try {
        await calulateFines();
        const errors = validationResult(req).array();
        if(errors.length){
            const flashMsg = await req.flash('msg');
            res.render('./admin/bookIssue', {
                error: errors[0],
                oldInput: req.body,
                flashMsg: flashMsg.length? flashMsg[0]: undefined
            });
            return;
        }
        const book = await Book.findOne({
            'bookID': req.body.bookID
        });
        
        const user = await User.findOne({
            'details.username': req.body.username
        });
        
        if (user.overdueFine || (user.currentIssues.length === user.bookIssuePrivilege.maxBooks)) {
            const error = {
                msg:user.overdueFine ? "User has Overdue Fine": "User has already issued Max number of books"
            };
            const flashMsg = await req.flash('msg');
            res.render('./admin/bookIssue', {
                error: error,
                oldInput: req.body,
                flashMsg: flashMsg.length? flashMsg[0]: undefined
            });
            return;
        }
        const currentDate = new Date();
        const returnDate = new Date(currentDate);
        returnDate.setDate(returnDate.getDate() + user.bookIssuePrivilege.issueDuration);
        
        const bookIssue = await BookIssue.create({
            bookID: book._id,
            userID: user._id,
            issueDate: currentDate,
            returnDate: returnDate,
        });
        
        user.currentIssues.push(bookIssue);
        book.issueHistory.push(bookIssue);
        book.availability = false;
        await bookIssue.save();
        await user.save();
        await book.save();
        await req.flash('msg' , 'Book Successfully Issued');
        res.redirect('/admin/bookIssue');
    } catch (err) {
        console.log(err);
        next();
    }
};


exports.getBookReturn = async (req , res, next) => {
    try {
        const flashMsg = await req.flash('msg');
        res.render('./admin/bookReturn', {
            error: undefined,
            oldInput: {
                'bookID': '',
            },
            flashMsg: flashMsg.length? flashMsg[0]: undefined
        });
    } catch (error) {
        console.log(error);
        next();
    }
}; 

exports.getIssueData = async (req , res) => {
    try{
        const book = await Book.findOne({
            'bookID': req.query.bookID
        });
        if (!book) {
            res.json({ user: 'not found', fine: 'NAN', error:'Book not found'});
            return;
        }
        if(book.availability){
            res.json({ user: 'not found', fine: 'NAN', error:'No such issue'});
            return;
        }
        const bookIssueID = book.issueHistory[book.issueHistory.length - 1];
        const bookIssue = await BookIssue.findById(bookIssueID);
        const user = await User.findById(bookIssue.userID);
        const fine = Math.max(0, daysDiff(new Date(), bookIssue.returnDate)) * 15;
        res.json({ user: user.details.username, fine: fine });
    }
    catch(err){
        res.json({ error:'Something went wrong'});
        return;
    }
}; 

exports.postBookReturn = async (req, res, next) => {
    try {
        await calulateFines();
        const errors = validationResult(req).array();
        if(errors.length){
            const flashMsg = await req.flash('msg');
            res.render('./admin/bookReturn', {
                error: errors[0],
                oldInput: req.body,
                flashMsg: flashMsg.length? flashMsg[0]: undefined
            });
            return;
        }
        const book = await Book.findOne({
            'bookID': req.body.bookID
        });
        const bookIssueID = book.issueHistory[book.issueHistory.length - 1];
        const bookIssue = await BookIssue.findById(bookIssueID);
        const user = await User.findById(bookIssue.userID);
        bookIssue.returnStatus = true;
        bookIssue.dateofReturn = new Date();
        book.availability = true; 
        user.issueHistory.push(bookIssue);
        user.currentIssues = user.currentIssues.filter(element => !element.equals(bookIssue._id));
        user.overdueFine -= Math.max(0, daysDiff(bookIssue.dateofReturn, bookIssue.returnDate)) * 15;
        await bookIssue.save();
        await book.save();
        await user.save();
        await req.flash('msg', 'Book Successfully Returned');
        res.redirect('/admin/books');
    } catch (err) {
        console.log(err);
        next();
    }
};

exports.getBook = async (req , res , next) => {
    try {
        let book = await Book.findOne({bookID: req.params.bookID});
        if(!book){
            res.redirect('/admin/books');
            return;
        }
        await book.populate('issueHistory');
        await book.populate('issueHistory.userID');
        if(!book) res.redirect('/admin/books');
        else {
            const flashMsg = await req.flash('msg');
            res.render('./admin/book', {
                book : book,
                flashMsg : flashMsg.length? flashMsg[0]: undefined
            }); 
        }
    } catch (error) {
        console.log(error);
        next();
    }
}; 


exports.getCalulateFines = async (req, res, next) => {
    try {
        await calulateFines();
        res.redirect('/admin');
    } catch (error) {
        console.log(error);
        next();
    }
};