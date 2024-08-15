const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin-api");
const auth = require("../middleware/auth");
const User = require("../models/user");
const Book = require("../models/book");
const { check } = require("express-validator");

router.get("/dashboard", auth.authAdmin, adminController.getDashboard);
router.get("/users", auth.authAdmin, adminController.getusers);
router.get("/users/:username", auth.authAdmin, adminController.getuser);
router.get("/books/:bookID", auth.authAdmin, adminController.getBook);
router.get("/issueData", adminController.getIssueData);

router.post("/bookReturn", auth.authAdmin, adminController.postBookReturn);
router.post("/bookIssue", adminController.postBookIssue);

router.post(
    "/addUser",
    auth.authAdmin,
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
            .withMessage("Contact number must be a numeric value")
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
    adminController.postAddUser
);

router.post(
	"/addBook",
	auth.authAdmin,
	[
		check("ISBN")
			.trim()
			.isLength({ min: 13, max: 13 })
			.withMessage("ISBN number must be a 13-digit number")
			.isNumeric()
			.withMessage("ISBN must be a numeric value"),
		check("title")
			.trim()
			.isLength({ min: 1 })
			.withMessage("Title cannot be empty")
			.isLength({ max: 100 })
			.withMessage("Title must be less than 100 characters"),
		check("author")
			.trim()
			.isLength({ min: 1 })
			.withMessage("Author cannot be empty")
			.isLength({ max: 100 })
			.withMessage("Author must be less than 100 characters"),
		check("subject")
			.trim()
			.isLength({ min: 1 })
			.withMessage("Subject cannot be empty")
			.isLength({ max: 100 })
			.withMessage("Subject must be less than 100 characters"),
	],
	adminController.postAddBook
);

router.delete(
    "/removeUser/:username",
    auth.authAdmin,
    [
        check("username").custom(async (value) => {
            const username = value.toLowerCase().trim();
            const existingUser = await User.findOne({ username: username });
            if (!existingUser) {
                throw new Error("User does not exist");
            }
            if(existingUser.currentIssues.length > 0){
                throw new Error("User has pending issues");
            }
			if(existingUser.username === "root"){
				throw new Error("Cannot delete root user");
			}
            return true;
        }),
    ],
    adminController.deleteUser
);

router.delete(
	"/removeBook/:bookID",
	auth.authAdmin,
	[
		check("bookID")
			.trim()
			.matches(/^[A-Z]\d{4}$/)
			.withMessage(
				"Book ID should follow the pattern: capital letter followed by 4 digits"
			)
			.custom(async (value) => {
				const existingBook = await Book.findOne({ bookID: value });
				if (!existingBook) {
					throw new Error("Book does not exist");
				}
                if(existingBook.availability === false){
                    throw new Error("Book is not available");
                }
				return true;
			}),
	],
	adminController.deleteBook
);

module.exports = router;
