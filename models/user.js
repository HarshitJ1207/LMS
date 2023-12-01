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
            required: true
        },
        password: {
            type: String,
            required: true
        }
    },
    bookIssuePrivilege:{
        maxBooks: {
            type: Number,
        },
        issueDuration: {
            type: Number,
        }
    },
    
    admin:{
        type: Boolean,
        required: true,
        default: false
    },
    overdueFine:{
        type: Number,
        default: 0
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