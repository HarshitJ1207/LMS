const mongoose = require('mongoose');   

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    details: {
        firstName: {
            type: String,
            required: true 
        },
        lastName: {
            type: String,
            required: true
        },
        email:{
            type: String,
            required: true,
            unique: true
        },  
        contactNumber: {
            type: String,
            required: true,
            unique: true
        },
        userType:{ 
            type: String,
            default: 'Guest'
        },
    },
    bookIssuePrivilege:{
        maxBooks: {
            type: Number,
            default: 1
        },
        issueDuration: {
            type: Number,
            default: 3
        }
    },
    admin:{
        type: Boolean,
        default: false
    },
    currentIssues: [{
        type: Schema.Types.ObjectId,
        ref: 'BookIssue',
        default: []
    }],
    issueHistory: [{
        type: Schema.Types.ObjectId,
        ref: 'BookIssue',
        default: []
    }],
});
module.exports = mongoose.model('User' , userSchema);