const mongoose = require('mongoose');   

const Schema = mongoose.Schema;

const userSchema = new Schema({
    details: {
        username: {
            type: String,
            required: true
        },
        email:{
            type: String,
            required: true
        },  
        contactNumber: {
            type: String,
            required: true
        },
        userType:{ 
            type: String,
            default: 'Guest'
        },
        password: {
            type: String,
            required: true
        }
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