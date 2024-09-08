const express = require('express');
const router = express.Router();
const multer = require('multer');
const { UserController, PostController, CommentsController, LikesController, FollowsController } = require('../controllers/index');
const { checkAuth } = require('../middleware/auth');

const uploadDestination = 'uploads';

const storage = multer.diskStorage({
	destination: uploadDestination,
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	}
});

const uploads = multer({ storage: storage });

/* User routes */
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/current", checkAuth, UserController.current);
router.get("/users/:id", checkAuth, UserController.getUserById);
router.put("/users/:id", checkAuth, uploads.single('avatar'), UserController.updateUser);

/* Posts routes */
router.post("/posts", checkAuth, PostController.create);
router.get("/posts", checkAuth, PostController.getAllPosts);
router.get("/posts/:id", checkAuth, PostController.getPostById);
router.delete("/posts/:id", checkAuth, PostController.deletePost);

/* Comments routes */
router.post("/comments", checkAuth, CommentsController.createComment);
router.delete("/comments/:id", checkAuth, CommentsController.deleteComment);
router.get("/comments/:postId", checkAuth, CommentsController.getComments);

/* Likes routes */
router.post("/likes", checkAuth, LikesController.like);
router.delete("/likes/:id", checkAuth, LikesController.deleteLike);

/* Comments-likes routes */
router.post("/comment-likes", checkAuth, LikesController.likeComment);
router.delete("/comment-likes", checkAuth, LikesController.deleteLikeComment);

/* Follows routes */
router.post("/follow", checkAuth, FollowsController.follow);
router.delete("/unfollow/:id", checkAuth, FollowsController.unfollow);

module.exports = router;
