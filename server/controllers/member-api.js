const User = require('../models/user');
const Book = require('../models/book');
const Studio = require('../models/studio');
const perPage = 30;



exports.getLoginStatus = async (req , res) => {
    try{
        if(req.session.user) return res.json({loggedIn: true});
        else return res.json({loggedIn: false});
    }
    catch(error){
        console.log(error);
        return res.json({loggedIn: false});
    }
}



exports.postLogin = async (req, res) => {
    try {
        let error = await req.flash('errors');
        if (error.length) {
            const flashMsg = await req.flash('msg');
            return res.status(400).json({
                error: error[0],
                oldInput: req.body,
                flashMsg: flashMsg.length ? flashMsg[0] : undefined
            });
        }

        console.log(req.body);

        let user = await User.findOne({
            'details.username': req.body.username,
            'details.password': req.body.password
        });

        if (!user) {
            const flashMsg = await req.flash('msg');
            await req.flash('errors', 'Email and Password do not match');
            error = await req.flash('errors');
            return res.status(401).json({
                error: error[0],
                oldInput: req.body,
                flashMsg: flashMsg.length ? flashMsg[0] : undefined
            });
        } else {
            console.log('User found');
            req.session.user = user;
            await req.session.save(err => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ message: 'Session save error' });
                }
            });
            await req.flash('msg', "You have successfully logged in");
            return res.status(200).json({ message: 'Login successful' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


exports.getBooks = async (req, res, next) => {
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


exports.getStudio = async (req , res, next) => { 
    try {
        if(!req.session.user) return res.redirect('/login');
        const user = await User.findOne({'details.username' : req.session.user.details.username});
        const bookingHistory = await Studio.find({
            userID: user._id
        });
        const flashMsg = await req.flash('msg');
        res.render('./member/studio', {
            user : user,
            flashMsg: flashMsg.length? flashMsg[0]: undefined,
            error: null,
            oldInput: {
                bookingDate: null, 
                bookingTime: null,
                people: null,
                purpose: null,
                equipment: [],
                topic: null
            },
            bookingHistory: bookingHistory
        });
    } catch (error) {
        console.log(error);
        next();
    }
}
exports.postStudio = async (req , res, next) => { 
    try {
        if(!req.session.user) return res.redirect('/login');
        console.log(req.body);
        const user = await User.findOne({'details.username' : req.session.user.details.username});
        const existingBooking = await Studio.findOne({
            bookingDate: req.body.bookingDate,
            bookingTime: req.body.bookingTime,
        })
        if(existingBooking){
            const flashMsg = await req.flash('msg');
            const bookingHistory = await Studio.find({
                userID: user._id
            })
            res.render('./member/studio', {
                user : user,
                flashMsg: flashMsg.length? flashMsg[0]: undefined,
                error: 'Slot is unavailable',
                oldInput: {
                    bookingDate: req.body.bookingDate,
                    bookingTime: req.body.bookingTime,
                    people: req.body.people,
                    purpose: req.body.purpose,
                    equipment: req.body.equipment,
                    topic: req.body.topic
                },
                bookingHistory: bookingHistory
            });
            return;
        }
        else{
            await Studio.create({
                userID: user._id,
                bookingDate: req.body.bookingDate,
                bookingTime: req.body.bookingTime,
                people: req.body.people,
                purpose: req.body.purpose,
                equipment: req.body.equipment,
                topic: req.body.topic
            })
            await req.flash('msg', 'Slot successfully booked');
            const flashMsg = await req.flash('msg');
            res.render('./member/home', {
                flashMsg: flashMsg.length ? flashMsg[0]: undefined,
            });
            return
        }
    } catch (error) {
        console.log(error);
        next();
    }
}



