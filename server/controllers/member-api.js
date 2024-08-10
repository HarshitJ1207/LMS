const User = require('../models/user');
const Book = require('../models/book');
const Studio = require('../models/studio');
const perPage = 30;



exports.getLoginStatus = async (req , res) => {
    try{
        console.log('GET /api/member/loginStatus', req.session.user);
        if(req.session.user) return res.json({userType: req.session.user.details.userType});
        else return res.json({userType: false});
    }
    catch(error){
        console.log(error);
        return res.json({userType: false});
    }
}



exports.postLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Login attempt:', req.body);
        const user = await User.findOne({
            'details.username': username,
            'details.password': password
        });

        if (!user) {
            return res.status(401).json({
                error: 'Email and Password do not match',
            });
        }

        req.session.user = user;
        req.session.save(err => {
            if (err) {
                console.error('Session save error:', err);
                return res.status(500).json({ error: 'Session save error' });
            }

            return res.status(200).json({ userType: user.details.userType });
        });
    } catch (error) {
        console.error('Internal server error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getBooks = async (req, res) => {
    try {
        console.log(req.query);
        const { page = 1, searchType = 'title', searchValue = '', subject = '' } = req.query;

        const decodedPage = parseInt(page, 10);
        if (isNaN(decodedPage) || decodedPage < 1) {
            decodedPage = 1;
        }

        const decodedSearchType = `details.${decodeURIComponent(searchType)}`;
        const decodedSearchValue = decodeURIComponent(searchValue);
        const decodedSubject = decodeURIComponent(subject);

        const query = {
            [decodedSearchType]: { $regex: decodedSearchValue, $options: 'i' },
            'details.subject': { $regex: decodedSubject, $options: 'i' }
        };

        console.log(query);

        const bookList = await Book.find(query)
            .skip((decodedPage - 1) * perPage)
            .limit(perPage);
        res.status(200).json({ bookList });
    } catch (error) {
        console.error('Error fetching books:', error);
        if (error instanceof SyntaxError) {
            res.status(400).json({ error: 'Invalid query parameters' });
        } else if (error.name === 'MongoError') {
            res.status(500).json({ error: 'Database error' });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

exports.getMe = async (req, res) => {
    console.log('GET /api/member/me', req.session.user);
    try {
        if (!req.session.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const user = await User.findOne({ 'details.username': req.session.user.details.username })
            .populate('issueHistory')
            .populate('currentIssues')
            .populate('issueHistory.bookID')
            .populate('currentIssues.bookID');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.postLogout = async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Session destroy error' });
        }
        res.clearCookie("connect.sid", {
			path: "/",
			sameSite: "none",
			secure: true,
			httpOnly: true,
		});
        res.status(200).json({ message: 'Logout successful' });
    });  
};

exports.postSignup = async (req, res) => {
    const { username, email, contactNumber, password, confirmPassword } = req.body;

    const validateForm = (data) => {
        const { username, password, confirmPassword, contactNumber } = data;
    
        if (username.length < 4 || username.length > 12) {
            return 'Username must be between 4 and 12 characters long';
        }
        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,12}$/.test(password)) {
            return 'Password must be alphanumeric, contain at least one letter and one number, and be between 4 and 12 characters long';
        }
        if (password !== confirmPassword) {
            return 'Passwords must match';
        }
        if (!/^\d{10}$/.test(contactNumber)) {
            return 'Contact number must be 10 digits';
        }
        if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
            return 'Invalid email address';
        }
        return null;
    };

    const validationError = validateForm({ username, password, confirmPassword, contactNumber});
    if (validationError) {
        return res.status(400).json({ error: validationError });
    }
    try {
        const user = await User.create({
            details: {
                username: username,
                email: email,
                contactNumber: contactNumber,
                password: password,
            },
        });
        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// exports.getStudio = async (req , res, next) => { 
//     try {
//         if(!req.session.user) return res.redirect('/login');
//         const user = await User.findOne({'details.username' : req.session.user.details.username});
//         const bookingHistory = await Studio.find({
//             userID: user._id
//         });
//         const flashMsg = await req.flash('msg');
//         res.render('./member/studio', {
//             user : user,
//             flashMsg: flashMsg.length? flashMsg[0]: undefined,
//             error: null,
//             oldInput: {
//                 bookingDate: null, 
//                 bookingTime: null,
//                 people: null,
//                 purpose: null,
//                 equipment: [],
//                 topic: null
//             },
//             bookingHistory: bookingHistory
//         });
//     } catch (error) {
//         console.log(error);
//         next();
//     }
// }
// exports.postStudio = async (req , res, next) => { 
//     try {
//         if(!req.session.user) return res.redirect('/login');
//         console.log(req.body);
//         const user = await User.findOne({'details.username' : req.session.user.details.username});
//         const existingBooking = await Studio.findOne({
//             bookingDate: req.body.bookingDate,
//             bookingTime: req.body.bookingTime,
//         })
//         if(existingBooking){
//             const flashMsg = await req.flash('msg');
//             const bookingHistory = await Studio.find({
//                 userID: user._id
//             })
//             res.render('./member/studio', {
//                 user : user,
//                 flashMsg: flashMsg.length? flashMsg[0]: undefined,
//                 error: 'Slot is unavailable',
//                 oldInput: {
//                     bookingDate: req.body.bookingDate,
//                     bookingTime: req.body.bookingTime,
//                     people: req.body.people,
//                     purpose: req.body.purpose,
//                     equipment: req.body.equipment,
//                     topic: req.body.topic
//                 },
//                 bookingHistory: bookingHistory
//             });
//             return;
//         }
//         else{
//             await Studio.create({
//                 userID: user._id,
//                 bookingDate: req.body.bookingDate,
//                 bookingTime: req.body.bookingTime,
//                 people: req.body.people,
//                 purpose: req.body.purpose,
//                 equipment: req.body.equipment,
//                 topic: req.body.topic
//             })
//             await req.flash('msg', 'Slot successfully booked');
//             const flashMsg = await req.flash('msg');
//             res.render('./member/home', {
//                 flashMsg: flashMsg.length ? flashMsg[0]: undefined,
//             });
//             return
//         }
//     } catch (error) {
//         console.log(error);
//         next();
//     }
// }


