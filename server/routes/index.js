const express = require('express');
const multer = require('multer');
const UserController = require('../controllers/UserController');
const { authMiddleware } = require('../middleware/auth');
const PostController = require('../controllers/PostController');
const CommentsController = require('../controllers/CommentsController');
const LikeController = require('../controllers/LikeController');
const FollowController = require('../controllers/FollowController');
const router = express.Router();

const storage = multer.diskStorage({
	destination: "uploads",
  filename: function (req, file, cb) {
    cb(null, file.originalName)
  }
})

const upload = multer({ storage: storage });

/* User routes */
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/users/:id',authMiddleware, UserController.getUserById);
router.patch('/users/:id',authMiddleware, UserController.updateUser);
router.get('/current',authMiddleware, UserController.currentUser);

router.get('/users', UserController.allUsers);

/* Post routes */
router.post('/posts', authMiddleware, PostController.createPost);
router.get('/posts', authMiddleware, PostController.getAllPosts)
router.get('/posts/:id', authMiddleware, PostController.getPostById);
router.delete('/posts/:id', authMiddleware, PostController.deletePost);

/* Comments routes */
router.post('/comments', authMiddleware, CommentsController.createComment);
router.delete('/comments/:id', authMiddleware, CommentsController.deleteComment);

/* Likes routes */
router.post('/likes', authMiddleware, LikeController.like);
router.delete('/likes/:id', authMiddleware, LikeController.unlike);

/* Follow routes */
router.post('/follow', authMiddleware, FollowController.follow);
router.delete('/unfollow', authMiddleware, FollowController.unfollow);


module.exports = router;
