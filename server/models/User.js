const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
    },
    password: {
        type: String,
    },
    postCount: {
        type: Number,
        default: 0,
    },
    followers: [{
    }],
    following: [{
    }],
});

module.exports = mongoose.model("User", userSchema);