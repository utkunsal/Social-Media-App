const User = require("../models/User");
const Post = require("../models/Post");
const fs = require('fs')


// returns all posts
const getPosts = async (req, res) => {
    try {
        const posts = await Post.find();

        res.status(200).json(posts)
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// returns posts from followed users and current user
const getPostFromFollowedUsers = async (req, res) => {
    try {
        req.user.following.push({ id: req.user._id }) // to also add current user's posts
        res.status(200).json(await Post.find({ user: { $in: req.user.following.map((user) => user.id) } }))

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// id: user id
// returns posts of the given user
const getUserPosts = async (req, res) => {
    try {
        const { id } = req.params;

        if (id == 0) {
            res.status(200).json(await Post.find({ user: req.user._id }))
        } else {
            res.status(200).json(await Post.find({ user: id }))
        }

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// creates post with title and body from the request body
// title is required
const createPost = async (req, res) => {
    try {
        const { title, body } = req.body;

        if (!title) {
            return res.status(201).send({ message: "Title cannot be empty" });
        }

        const newPost = await Post.create({
            user: req.user,
            username: req.user.username,
            title: title,
            body: body,
        });

        const user = await User.findById(req.user._id);
        user.postCount++;
        await user.save();

        res.status(201).send({ message: "Post shared successfully", postId: newPost._id });

    } catch (err) {
        res.status(500).send(err.message);
    }
}

// id: post id
// updates the given post with new body or title
const updatePost = async (req, res) => {
    try {
        const { title, body } = req.body;
        const { id } = req.params;

        const post = await Post.findById(id);
        if (!post) {
            return res.status(400).send("post does not exist");
        }

        if (title) { post.title = title; }
        post.body = body;
        await note.save();
        res.status(200).send("post updated");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// id: post id
// deletes the given post and its uploaded image
const deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await Post.findById(id);
        if (post.image) { fs.unlinkSync(`./images/${post.image}`); }

        if (await Post.findByIdAndRemove(id).exec()) {

            const user = await User.findById(req.user._id);
            user.postCount--;
            await user.save();

            return res.status(200).send("post deleted");
        }

        res.status(400).send("post does not exist");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// id: post id
// saves filename of the uploaded image for the given post
const uploadImage = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await Post.findById(id);

        post.image = req.file.filename;
        post.save()

        res.status(200).send("success");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


module.exports = { getPosts, getPostFromFollowedUsers, getUserPosts, createPost, updatePost, deletePost, uploadImage };