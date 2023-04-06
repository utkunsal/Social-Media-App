const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    username: {
        type: String,
    },
    title: {
        type: String,
    },
    body: {
        type: String,
    },
    image: {
        type: String,
        default: "",
    },

}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);