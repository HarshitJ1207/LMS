const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const dbs = new Schema({
    lastAllocatedBookID: {
        type: String,
        default: null
    },
    totalBooks: {
        type: Number,
        default: 0
    },
    totalUsers: {
        type: Number,
        default: 0
    },
    recentActivities: [
        {
            type: String,
            default: []
        }
    ],
    activeUsers: {
        type: [{
            user: {
                type: String,
            },
            lastActive: {
                type: Date,
            }
        }],
        default: []
    }
});

module.exports = mongoose.model('databaseStats', dbs);

