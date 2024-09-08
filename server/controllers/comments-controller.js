const { prisma } = require("../prisma/prisma-client");

const CommentsController = {
	createComment: async (req, res) => {
		const { content, postId, parentCommentId } = req.body
		const { userId } = req.user;

		if (!content || !postId) {
			return res.status(400).json({ error: 'All fields are required' });
		}

		try {
			const comment = await prisma.comment.create({
				data: {
					content,
					postId,
					userId,
					parentCommentId,
				}
			})

			res.json(comment)
		} catch (error) {
			console.error("Error in createComment:", error);
			res.status(500).json({ error: "Internal server error" });
		}
	},
	getComments: async (req, res) => {
		const { postId } = req.params;
		const { userId } = req.user;

		if (!postId) {
			return res.status(400).json({ error: 'postId is required' });
		}

		try {
			const comments = await prisma.comment.findMany({
				where: { postId },
				include: {
					likes: true,
					replies: {
						include: {
							likes: true,
							replies: {
								include: {
									likes: true
								}
							}
						}
					}
				}
			});

			// Функция для обработки лайков и вложенных комментариев рекурсивно
			const processComments = (comments) => {
				return comments.map(comment => ({
					...comment,
					likedByUser: comment.likes?.some(like => like.userId === userId) || false,
					replies: comment.replies ? processComments(comment.replies) : []
				}));
			};

			const commentsWithLike = processComments(comments);

			res.json(commentsWithLike);
		} catch (error) {
			console.error("Error in getComments:", error);
			res.status(500).json({ error: "Internal server error" });
		}
	},

	// getCommentReplies: async (req, res) => {
	// 	try {
	// 		const { parentCommentId } = req.body
	// 		const { userId } = req.user;
			
	// 		if (!parentCommentId) {
	// 			return 
	// 		}

	// 		const commentReplies = await prisma.comment.findUnique({
	// 			where: { parentCommentId },
	// 			include: {
	// 				replies: true
	// 			} 
	// 		})

	// 		if (!commentReplies) {
	// 			return 
	// 		}


	// 		res.json(commentReplies)
	// 	} catch (error) {
	// 		console.error("Error in deleteComment:", error);
	// 		res.status(500).json({ error: "Internal server error" });
	// 	}
	// },

	deleteComment: async (req, res) => {
		try {
			const { id } = req.params
			const { userId } = req.user;

			const comment = await prisma.comment.findUnique({ where: { id } })

			if (!comment) {
				return res.status(404).json({ error: 'Comment not found' });
			}

			if (comment.userId !== userId) {
				return res.status(403).json({ error: 'No access' });
			}

			await prisma.comment.delete({ where: { id } })

			res.json({ message: "Comment removed successfully" })
		} catch (error) {
			console.error("Error in deleteComment:", error);
			res.status(500).json({ error: "Internal server error" });
		}
	},
}

module.exports = CommentsController;