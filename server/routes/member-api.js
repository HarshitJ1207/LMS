const express = require('express');
const router = express.Router();
const memberController = require('../controllers/member-api');


router.get('/books', memberController.getBooks);
router.get("/loginStatus" , memberController.getLoginStatus);
router.get("/me" , memberController.getMe);
router.post("/login", memberController.postLogin); 
router.post("/logout", memberController.postLogout);
router.post('/signup', memberController.postSignup);    

// router.post("/studio", memberController.postStudio); 
// router.get("/studio", memberController.getStudio);

module.exports = router;
