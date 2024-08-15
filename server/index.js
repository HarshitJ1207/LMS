dotenv = require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose');
const cors = require('cors');
const dbs = require('./models/databaseStats.js');
const User = require('./models/user.js');
const jwt = require('jsonwebtoken');
const MONGODB_URI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.9ronrfd.mongodb.net/${process.env.MONGODB_DBNAME}?retryWrites=true&w=majority`;
const app = express();
const {logUserActivity} = require('./middleware/activeUsers.js');

const corsOptions = {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

app.use('/', async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        if (token) {
            try {
                const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
                req.user = await User.findOne({ 'username': decodedToken.username });
            } catch (err) {
                req.user = null;
            }
        }
    }
    next();
});
app.use(logUserActivity);
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
                username: 'root',
                password: 'root@123',
                details: {
                    firstName: 'root',
                    lastName: 'root',
                    email: 'jain1207harshit@gmail.com',
                    contactNumber: '9406817091',
                    userType: 'Admin',
                },
                bookIssuePrivilege:{
                    maxBooks: 20,
                    issueDuration: 90
                }
            });
            await root.save();
            const stats = await dbs.findOne({});
            stats.totalUsers++;
            stats.recentActivities.push('New user added: root');
            await stats.save();
        }
        app.listen(process.env.PORT || 8000);
        console.log("connection success");
    }
    catch(err){
        console.log(err);
    }
}

