const dotenv = require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const dbs = require('./models/databaseStats.js');
const User = require('./models/user.js');
const flash = require('connect-flash');


const MONGODB_URI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.9ronrfd.mongodb.net/${process.env.MONGODB_DBNAME}?retryWrites=true&w=majority`;
const app = express();

app.use(session({
   secret: 'your-secret-key',
   resave: false,
   saveUninitialized: false,
   store: MongoStore.create({
        mongoUrl: MONGODB_URI,
        stringify: false,
    })
})); 

app.use(flash());

app.use((req , res , next) => {
    if(req.session.user) res.locals.loggedIn = true;
    else res.locals.loggedIn = false;
    next();
})

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs'); 
app.set("views", __dirname + "/views");      


const adminRoutes = require('./routes/admin.js');
const memberRoutes = require('./routes/member.js');

 
app.use('/admin', adminRoutes);
app.use(memberRoutes);

app.use((req , res) => {
    res.render('./404');
})

connectDB();


async function connectDB(){
    try{
        await mongoose.connect(MONGODB_URI);
        let doc = await dbs.findOne({});
        let root = await User.findOne({admin: true});
        if(!doc){
            doc = await dbs.create({});
            await doc.save();
        }
        if(!root){
            root = await User.create({
                admin: true, 
                details: {
                    username: 'root',
                    email: 'jain1207harshit@gmail.com',
                    contactNumber: '9406817091',
                    userType: 'admin',
                    password: 'root'
                },
                bookIssuePrivilege:{
                    maxBooks: 20,
                    issueDuration: 90
                }
            });
            await root.save();
        }
        app.listen(process.env.PORT || 3000);
        console.log("connection success");
    }
    catch(err){
        console.log(err);
    }
}

