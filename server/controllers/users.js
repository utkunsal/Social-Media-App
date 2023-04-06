const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");


// returns all users
const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').lean();
        res.json(users)
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// id: user id
// returns the profile information of the given user
// if called with id = 0, returns logged-in user's information
const getUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (id == 0) {
            res.status(200).json(req.user);
        } else {
            res.status(200).json(await User.findById(id));
        }

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// id: user id
// returns 1 if logged-in user follows the given user
// returns 0 if logged-in user does not follow the given user
// returns -1 if logged-in user and the given user are the same
const getFollowStatus = async (req, res) => {
    try {
        const { id } = req.params;

        if (id == req.user._id || id == 0) {
            return res.json(-1); // users are the same
        }
        let found = 0
        req.user.following.forEach((key) => {
            if (key.id == id) {
                found++;
            }
        })
        if (found > 0) {
            return res.json(1); // is following
        } else {
            return res.json(0); // not following
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// to create user with the credentials from request body
const createUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).send("Empty username or password field");
        }

        if (await User.findOne({ username }).lean()) {
            return res.status(409).send("Username already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username: username,
            password: hashedPassword,
        });
        res.status(201).send(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// updates logged-in user's credentials from request body
const updateUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(400).send("user does not exist");
        }

        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }
        if (username) {
            // Checking if username already exists
            const secondUser = await User.findOne({ username }).lean();
            if (secondUser?._id != id && secondUser) {
                return res.status(409).send("username already exists");
            }
            user.username = username;
        }
        await user.save();
        res.status(200).send("user updated");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// deletes logged-in user
const deleteUser = async (req, res) => {
    try {
        // Deleting user's posts
        const posts = await Post.find({ user: req.user }).lean();
        posts.forEach(post => Post.findByIdAndRemove(post._id).exec());

        // Deleting user 
        if (await User.findByIdAndRemove(req.user._id).exec()) {
            return res.status(200).send("user deleted");
        }
        res.status(400).send("user does not exist");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// id: user id
// logged-in user follows the given user
const followUser = async (req, res) => {
    try {
        const { id } = req.params;

        const followed = await User.findById(id);
        followed.followers.push({ username: req.user.username, id: req.user._id });
        followed.save();

        const user = await User.findById(req.user._id);
        user.following.push({ username: followed.username, id: id });
        user.save();

        res.status(200).send("success");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// id: user id
// logged-in user unfollows the given user
const unfollowUser = async (req, res) => {
    try {
        const { id } = req.params;

        const following = await User.findById(id);
        following.followers.pull({ username: req.user.username, id: req.user._id });
        following.save();

        const user = await User.findById(req.user._id);
        user.following.pull({ username: following.username, id: id });
        user.save();

        res.status(200).send("success");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


module.exports = { getUsers, getUser, createUser, updateUser, deleteUser, followUser, unfollowUser, getFollowStatus };