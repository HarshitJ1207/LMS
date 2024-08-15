const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookSchema = new Schema({
    availability:{
        type: Boolean,
        default: true
    },
    bookID: {
        type: String,
        required: true
    },
    details:{
        title: {
            type: String,
            required: true
        },
        author:{
            type: String,
            required: true
        },
        subject: {
            type: String,
            required: true
        },
        ISBN: {
            type: String,
            required: true
        },
    },
    issueHistory: [{
        type: Schema.Types.ObjectId,
        ref: 'BookIssue',
        default: []
    }],
});

module.exports = mongoose.model('Book', bookSchema);
