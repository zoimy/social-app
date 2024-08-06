const { prisma } = require("../prisma/prisma-client");

const CommentsController = {
	createComment: async (req, res) => {
		const { content, postId } = req.body
		const { userId } = req.user;

		if (!content || !postId) {
			return res.status(400).json({ error: 'All fields are required' });
		}

		try {
			const comment = await prisma.comment.create({
				data: {
					content,
					postId,
					userId
				}
			})

			res.json(comment)
		} catch (error) {
			console.error("Error in createComment:", error);
			res.status(500).json({ error: "Internal server error" });
		}
	},
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