const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyToken = async (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader?.startsWith("Bearer")) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    const token = authHeader.split(' ')[1]

    jwt.verify(
        token,
        process.env.JWT_SECRET,
        (err, decoded) => {
            if (err) return res.status(403).json({ message: "Cannot Verify" })
            const { _id } = decoded;
            User.findById(_id).then(userData => {
                req.user = userData
                next()
            })
        }
    )
}

module.exports = { verifyToken };

