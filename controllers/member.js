const User = require('../models/user');
const Book = require('../models/book');
const Studio = require('../models/studio');
const perPage = 30;

exports.getHome = async(req , res, next) => {
    try {
        if(req.session.user && req.session.user.admin) {
            res.redirect('/admin');
            return;
        }
        const flashMsg = await req.flash('msg');
        res.render('./member/home', {
            flashMsg: flashMsg.length ? flashMsg[0]: undefined,
        });
    } catch (error) {
        console.log(error);
        next();
    }
};
exports.getLogin = async (req , res, next) => {
    try {
        const flashMsg = await req.flash('msg');
        const errors = await req.flash('errors');
        res.render('./member/login', {
            error: errors.length ? errors[0]: undefined,
            oldInput: {
                'username': '',
                'password': ''
            },
            flashMsg: flashMsg.length ? flashMsg[0]: undefined
        });
    } catch (error) {
        console.log(error);
        next();
    }
};
exports.postLogin = async (req , res, next) => {
    try {
        let error = await req.flash('errors');
        if(error.length){
            const flashMsg = await req.flash('msg');
            res.render('./member/login', {
                error: error[0],
                oldInput: req.body,
                flashMsg: flashMsg.length ? flashMsg[0]: undefined
            });
            return;
        }
        let user = await User.findOne({
            'details.username': req.body.username,
            'details.password': req.body.password
        });
        if(!user){
            const flashMsg = await req.flash('msg');
            await req.flash('errors' , 'Email and Password do not match');
            error = await req.flash('errors');
            res.render('./member/login', {
                error: error[0],
                oldInput: req.body,
                flashMsg: flashMsg.length ? flashMsg[0]: undefined
            });
            return;
        }
        else{
            req.session.user = user;
            await req.session.save(error => console.log(error));
            await req.flash('msg', "You have successfully logged in");
            res.redirect('/');
        }
    } catch (error) {
        console.log(error); 
        next();
    }
};

exports.getLogout = async (req , res , next) => {
    try {
        req.session.user = null;
        await req.flash('msg', "You have been logged out");
        await req.session.save(error => console.log(error));
        res.redirect('/');
    } catch (error) {
        console.log(error);
        next();
    }

}

exports.getBooks = async (req , res ,next) => {
    try {
        let page = +req.query.page;
        if(!page) page = 1;
        if(Object.keys(req.query).length < 2) {
            const flashMsg = await req.flash('msg');
            let bookList = await Book.find().skip((page - 1)*perPage).limit(perPage);
            const totalProducts = await Book.find().countDocuments();
            res.render('./member/books', {
                'bookList': bookList,
                page: page,
                lastPage: Math.ceil(totalProducts/perPage),
                searchType: 'title',
                searchValue: '',
                subject: '',
                flashMsg: flashMsg.length ? flashMsg[0]: undefined
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
        res.render('./member/books', {
            'bookList': bookList,
            page: page,
            lastPage: Math.ceil(totalProducts/perPage),
            searchType: req.query.searchType,
            searchValue: searchValue,
            subject: subject,
            flashMsg: flashMsg.length ? flashMsg[0]: undefined
        });
    } catch (error) {
        console.log(error);
        next();
    }
}; 

exports.getMe = async (req , res) => {
    try {
        if(!req.session.user) return res.redirect('/');
        const flashMsg = await req.flash('msg');
        const user = await User.findOne({'details.username' : req.session.user.details.username});
        await user.populate('issueHistory');
        await user.populate('currentIssues');
        await user.populate('issueHistory.bookID');
        await user.populate('currentIssues.bookID');
        res.render('./member/me', {
            user : user,
            flashMsg: flashMsg.length ? flashMsg[0]: undefined
        });
    } catch (error) {
        console.log(error);
    }
} 


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



