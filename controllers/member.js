const User = require('../models/user');
const Book = require('../models/book');
const perPage = 30;

exports.getHome = async(req , res) => {
    const flashMsg = await req.flash('msg');
    res.render('./member/home', {
        flashMsg: flashMsg.length ? flashMsg[0]: undefined,
    });
};
exports.getLogin = async (req , res) => {
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
};
exports.postLogin = async (req , res) => {
    try {
        const flashMsg = await req.flash('msg');
        let error = await req.flash('errors');
        if(error.length){
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
    }
};

exports.getLogout = async (req , res) => {
    try {
        req.session.user = null;
        await req.flash('msg', "You have been logged out");
        await req.session.save(error => console.log(error));
        res.redirect('/');
    } catch (error) {
        console.log(error);
    }

}

exports.getBooks = async (req , res ,next) => {
    const flashMsg = await req.flash('msg');
    let page = +req.query.page;
    if(!page) page = 1;
    try {
        if(Object.keys(req.query).length < 2) {
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
    const flashMsg = await req.flash('msg');
    if(!req.session.user) return res.redirect('/');
    const user = await User.findOne({'details.username' : req.session.user.details.username});
    await user.populate('issueHistory');
    await user.populate('currentIssues');
    await user.populate('issueHistory.bookID');
    await user.populate('currentIssues.bookID');
    res.render('./member/me', {
        user : user,
        flashMsg: flashMsg.length ? flashMsg[0]: undefined
    });
} 