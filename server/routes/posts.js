const express = require("express");
const router = express.Router();
const postController = require("../controllers/posts");
const { verifyToken } = require("../middleware/auth");
const { upload } = require("../middleware/uploadImage");


// returns all posts
router.get("/", verifyToken, postController.getPosts)

// returns posts from followed users and current user
router.get("/following", verifyToken, postController.getPostFromFollowedUsers)

// id: user id
// returns posts of the given user
router.get("/user/:id", verifyToken, postController.getUserPosts);

// creates post
router.post("/", verifyToken, postController.createPost)

// id: post id
// uploads image for the given post
router.post("/:id/image", verifyToken, upload, postController.uploadImage)

// id: post id
// updates the given post with new body or title
router.patch("/:id", verifyToken, postController.updatePost)

// id: post id
// deletes the given post and its uploaded image
router.delete("/:id", verifyToken, postController.deletePost)



module.exports = router;