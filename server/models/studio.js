const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const studioSchema = new Schema({
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bookingDate: {
        type: Date,
        required: true
    },
    bookingTime: {
        type: String,
        required: true
    },
    equipment: {
        type: Array,
        required: true,
    },
    purpose: {
        type: String,
        required: true,
    },
    people: {
        type: Number,
        required: true ,
    },
    topic: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('Studio' , studioSchema);