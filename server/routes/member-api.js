const express = require('express');
const router = express.Router();
const memberController = require('../controllers/member-api');
const { check } = require('express-validator');
const User = require('../models/user');


router.get('/books', memberController.getBooks);
router.get("/loginStatus" , memberController.getLoginStatus);
router.get("/me" , memberController.getMe);
router.post("/login", memberController.postLogin); 
router.post(
    '/signup',
    [
        check("firstName")
            .trim()
            .isLength({ min: 1 })
            .withMessage("First name must be at least 1 character long")
            .isAlpha()
            .withMessage("First name must contain only alphabets"),
        check("lastName")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Last name must be at least 1 character long")
            .isAlpha()
            .withMessage("Last name must contain only alphabets"),
        check("password").custom((value) => {
            const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{4,12}$/;
            if (!passwordRegex.test(value)) {
                throw new Error(
                    "Password must contain at least one letter, one number, and be between 4 and 12 characters long"
                );
            }
            return true;
        }),
        check("confirmPassword").custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Passwords do not match");
            }
            return true;
        }),
        check("email")
            .isEmail()
            .withMessage("Invalid email format")
            .custom(async (value) => {
                const existingUser = await User.findOne({
                    "details.email": value,
                });
                if (existingUser) {
                    throw new Error("Email already exists");
                }
                return true;
            }),
        check("contactNumber")
            .trim()
            .isLength({ min: 10, max: 10 })
            .withMessage("Contact number must be a 10-digit number")
            .isNumeric()
            .withMessage("Contact number must be a 10-digit number")
            .custom(async (value) => {
                const existingUser = await User.findOne({
                    "details.contactNumber": value,
                });
                if (existingUser) {
                    throw new Error("Contact Number already exists");
                }
                return true;
            }),
    ],
    memberController.postSignup
);


module.exports = router;
