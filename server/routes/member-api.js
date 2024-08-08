const express = require('express');
const router = express.Router();
const memberController = require('../controllers/member-api');


router.get("/" , memberController.getHome);
router.get('/books', memberController.getBooks);
router.get("/login" , memberController.getLogin);
router.get("/loginStatus" , memberController.getLoginStatus);
router.get("/logout" , memberController.getLogout);
router.get("/me" , memberController.getMe);

router.get("/studio", memberController.getStudio);


router.post("/login", memberController.postLogin); 
router.post("/studio", memberController.postStudio); 

router.post("/postTest", (req, res) => {
    console.log(req.body);
    res.json({message: 'Test successful'});
}); 



module.exports = router;
