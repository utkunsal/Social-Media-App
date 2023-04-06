const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username) {
            return res.status(400).send("Invalid Username");
        }

        if (!password) {
            return res.status(400).send("Invalid Password");
        }

        if (await User.findOne({ username }).lean()) {
            return res.status(409).send("Username Already Exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username: username,
            password: hashedPassword,
        });

        res.status(201).json(newUser);

    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username) {
            return res.status(400).send("Invalid Username");
        }

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).send("User Does Not Exist");
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).send("Invalid Password");
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        delete user.password;
        res.status(200).json({ token, user });


    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}

module.exports = { register, login };