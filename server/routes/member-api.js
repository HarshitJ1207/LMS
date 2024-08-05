const express = require('express');
const router = express.Router();
const memberController = require('../controllers/member-api');


router.get("/" , memberController.getHome);
router.get('/books', memberController.getBooks);
router.get("/login" , memberController.getLogin);
router.get("/logout" , memberController.getLogout);
router.get("/me" , memberController.getMe);

router.get("/studio", memberController.getStudio);


router.post("/login", memberController.postLogin); 
router.post("/studio", memberController.postStudio); 



module.exports = router;
