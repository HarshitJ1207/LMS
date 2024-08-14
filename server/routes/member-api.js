const express = require('express');
const router = express.Router();
const memberController = require('../controllers/member-api');


router.get('/books', memberController.getBooks);
router.get("/loginStatus" , memberController.getLoginStatus);
router.get("/me" , memberController.getMe);
router.post("/login", memberController.postLogin); 
router.post('/signup', memberController.postSignup);    


module.exports = router;
