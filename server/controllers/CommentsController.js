const Comment = require("../models/Comment")
const Post = require("../models/Post");
const User = require("../models/User");


const CommentsController = {
	createComment: async (req, res) => {
		console.log("Request body:", req.body); // Log the request body
		const { content, postId } = req.body;
		const userId = req.user.userId;
		console.log(content, postId); // Existing log

		if (!postId || !content) {
			return res.status(400).json({ error: 'All fields required' });
		}

		try {
			const user = await User.findById(userId);
			const post = await Post.findById(postId);
			if (!post) {
				console.log("Post not found:", postId);
				return res.status(404).json({ message: 'Post not found' });
			}

			let comment = await Comment.create({
				user,
				content,
				postId,
			});

			console.log("Comment created:", comment);
			post.comments.push(comment._id);
			await post.save();

			comment = await comment.populate('user');

			res.json(comment);
		} catch (error) {
			console.error("CommentCreate error: ", error);
			res.status(500).json({ message: "Internal Server Error" });
		}
	},
	deleteComment: async (req, res) => {
		const { id } = req.params;
		const userId = req.user.userId;

		try {
			const comment = await Comment.findById(id);

			if (!comment) {
				return res.status(404).json({
					message: 'Comment not found'
				});
			}

			await Comment.findByIdAndDelete(id);

			res.json('Removed successfully');
		} catch (error) {
			console.error("DeleteComment error: ", error);
			res.status(500).json({ message: "Internal Server Error" });
		}
	}
};


module.exports = CommentsController