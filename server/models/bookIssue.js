const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookIssueSchema = new Schema({
    bookID: {
        type: Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    returnStatus: {        
        type: Boolean,
        required: false
    },
    issueDate:{
        type: Date,
        required: true
    },
    returnDate:{
        type: Date,
        required: true
    },
    dateofReturn: {
        type: Date,
        default: null
    },
});

module.exports = mongoose.model('BookIssue' , bookIssueSchema);