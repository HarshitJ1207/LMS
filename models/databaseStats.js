const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const dbs = new Schema({
    lastAllocatedBookID: {
        type: String,
        default: null
    },
    lastUpdate: {
        type:Date,
        default: null
    }
});

module.exports = mongoose.model('databaseStats', dbs);
