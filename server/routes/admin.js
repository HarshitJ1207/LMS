const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const auth = require('../middleware/auth');
const User = require('../models/user')
const Book = require('../models/book')
const { check } = require('express-validator');

router.get("/" , auth.authAdmin, adminController.getAdminDashboard);
router.get("/users" , auth.authAdmin, adminController.getusers);
router.get("/addUser" , auth.authAdmin, adminController.getAddUser);
router.get("/users/:username" , auth.authAdmin, adminController.getuser);
router.get("/addBook" , auth.authAdmin, adminController.getAddBook);
router.get("/books" , auth.authAdmin, adminController.getBooks);
router.get("/bookIssue" , auth.authAdmin, adminController.getBookIssue);
router.get("/bookReturn" , auth.authAdmin, adminController.getBookReturn);
router.get("/books/:bookID" , auth.authAdmin, adminController.getBook);
router.get("/issueData" , adminController.getIssueData);
router.get("/calulateFines" , auth.authAdmin, adminController.getCalulateFines);

router.post("/addUser" , auth.authAdmin,[
    check('username')
        .custom(async (value) => {
            const existingUser = await User.findOne({ 'details.username': value });
            if (existingUser) {
                throw new Error('Username already exists');
            }
            return true;
        }),
    check('password')
        .isLength({ min: 4, max: 10 }).withMessage('Password must be between 4 and 10 characters'),
    check('email')
        .isEmail().withMessage('Invalid email format')
        .custom(async (value) => {
            const existingUser = await User.findOne({ 'details.email': value });
            if (existingUser) {
                throw new Error('Email already exists');
            }
            return true;
        }),
    check('contactNumber')
        .isLength({ min: 10, max: 10 }).withMessage('Contact number must be a 10-digit number')
        .isNumeric().withMessage('Contact number must be a numeric value')
        .custom(async (value) => {
            const existingUser = await User.findOne({ 'details.contactNumber': value });
            if (existingUser) {
                throw new Error('Contact Number already exists');
            }
            return true;
        }),
], adminController.postAddUser);


router.post("/bookReturn" , auth.authAdmin, [
    check('bookID').custom(async (value) => {
        const existingBook = await Book.findOne({ 'bookID': value });
        if (!existingBook) {
            throw new Error('No such Book');
        }
        if(existingBook.availability){
            throw new Error('No such Issue');
        }
        return true;
    })
], adminController.postBookReturn);


router.post("/bookIssue" , auth.authAdmin,[
    check('username')
    .custom(async (value) => {
        const existingUser = await User.findOne({ 'details.username': value });
        if (!existingUser) {
            throw new Error('User Not Found');
        }
        return true;
    }),
    check('bookID').custom(async (value) => {
        const existingBook = await Book.findOne({ 'bookID': value });
        if (!existingBook) {
            throw new Error('No such Book');
        }
        if(!existingBook.availability){
            throw new Error('Book Unavailable');
        }
        return true;
    })
],adminController.postBookIssue);

router.post("/addBook", auth.authAdmin, [
    check('ISBN').isLength({ min: 13, max: 13 }).withMessage('ISBN number must be a 13-digit number')
    .isNumeric().withMessage('ISBN must be a numeric value'),
], adminController.postAddBook);

module.exports = router;
 