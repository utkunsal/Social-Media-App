const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");
const { verifyToken } = require("../middleware/auth");


router.route("/")
    .get(verifyToken, userController.getUsers) // returns all users
    .patch(verifyToken, userController.updateUser) // updates logged-in user's credentials
    .delete(verifyToken, userController.deleteUser) // deletes logged-in user

// id: user id
// logged-in user follows/unfollows the given user
router.post("/follow/:id", verifyToken, userController.followUser);
router.post("/unfollow/:id", verifyToken, userController.unfollowUser);

// id: user id
// returns the profile information of the given user
router.get("/:id", verifyToken, userController.getUser);

// id: user id
// returns 1 if logged-in user follows the given user
// returns 0 if logged-in user does not follow the given user
// returns -1 if logged-in user and the given user are the same
router.get("/:id/isFollowing", verifyToken, userController.getFollowStatus);



module.exports = router;