dotenv = require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const dbs = require('./models/databaseStats.js');
const User = require('./models/user.js');

const MONGODB_URI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.9ronrfd.mongodb.net/${process.env.MONGODB_DBNAME}?retryWrites=true&w=majority`;
const app = express();

const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

app.use(session({
    secret: process.env.SESSION_SECRET || 'default-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: MONGODB_URI,
        stringify: false,
    }),
    proxy: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, 
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', 
        secure: process.env.NODE_ENV === 'production', 
        httpOnly: true, 
    }
}));


app.use(bodyParser.json());  

const memberApiRoutes = require('./routes/member-api.js');
const adminApiRoutes = require('./routes/admin-api.js');

 
app.use('/api/admin',adminApiRoutes);
app.use('/api',memberApiRoutes);
app.use('*' , (req , res) => {
    res.status(404).json({error: 'Page not found'});
});

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
                    userType: 'Admin',
                    password: 'root'
                },
                bookIssuePrivilege:{
                    maxBooks: 20,
                    issueDuration: 90
                }
            });
            await root.save();
        }
        app.listen(process.env.PORT || 8000);
        console.log("connection success");
    }
    catch(err){
        console.log(err);
    }
}

