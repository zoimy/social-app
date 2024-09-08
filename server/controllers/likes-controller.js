const { prisma } = require("../prisma/prisma-client");

const LikeController = {
	like: async (req, res) => {
		const { postId } = req.body;
		const { userId } = req.user;

		if (!postId) {
			return res.status(400).json({ error: "postId is required" });
		}

		try {
			const like = await prisma.like.findFirst({
				where: {
					userId,
					postId,
				},
			});

			if (like) {
				return res.status(400).json({ error: "You have already liked this post" });
			}

			const newLike = await prisma.like.create({
				data: {
					user: { connect: { id: userId } },
					post: { connect: { id: postId } },
				},
			});

			res.json(newLike);
		} catch (error) {
			console.error("Error in like:", error);
			res.status(500).json({ error: "Internal server error" });
		}
	},

	getComments: async (req, res) => {
		const { postId } = req.params;
		const { userId } = req.user;

		if (!postId) {
			return res.status(400).json({ error: "postId is required" });
		}

		try {
			const comments = await prisma.comment.findMany({
				where: { postId },
				include: {
					user: true,
					likes: true,
					replies: {
						include: {
							user: true,
							likes: true,
						},
					},
				},
			});

			const commentsWithLikeInfo = comments.map(comment => ({
				...comment,
				likedByUser: comment.likes.some(like => like.userId === userId),
			}));

			res.json(commentsWithLikeInfo);
		} catch (error) {
			console.error("Error in getComments:", error);
			res.status(500).json({ error: "Internal server error" });
		}
	},

	deleteLike: async (req, res) => {
		const { userId } = req.user;
		const { id } = req.params;

		if (!id) {
			return res.status(400).json({ error: "postId is required" });
		}

		try {
			const like = await prisma.like.findFirst({
				where: { userId, postId: id },
			});

			if (!like) {
				return res.status(400).json({ error: "Like not found" });
			}

			await prisma.like.deleteMany({
				where: { postId: id, userId },
			});

			res.json({ message: "Like removed" });
		} catch (error) {
			console.error("Error in deleteLike:", error);
			res.status(500).json({ error: "Internal server error" });
		}
	},

	likeComment: async (req, res) => {
		const { commentId } = req.body;
		const { userId } = req.user;  // Предполагается, что userId извлекается из аутентификации

		if (!commentId) {
			return res.status(400).json({ error: "commentId is required" });
		}

		try {
			// Проверка, существует ли уже лайк от этого пользователя на этот комментарий
			const existingLike = await prisma.like.findFirst({
				where: {
					userId: userId,
					commentId: commentId,
				},
			});

			if (existingLike) {
				return res.status(400).json({ error: "You have already liked this comment" });
			}

			// Создание нового лайка
			const newLike = await prisma.like.create({
				data: {
					user: { connect: { id: userId } },
					comment: { connect: { id: commentId } },
				},
			});

			res.json(newLike);
		} catch (error) {
			console.error("Error in likeComment:", error);
			res.status(500).json({ error: "Internal server error" });
		}
	},

	deleteLikeComment: async (req, res) => {
		const { commentId } = req.body;
		const { userId } = req.user;  // Предполагается, что userId извлекается из аутентификации

		if (!commentId) {
			return res.status(400).json({ error: "commentId is required" });
		}

		try {
			// Проверка, существует ли лайк от этого пользователя на этот комментарий
			const existingLike = await prisma.like.findFirst({
				where: {
					userId: userId,
					commentId: commentId,
				},
			});

			if (!existingLike) {
				return res.status(400).json({ error: "You have not liked this comment yet" });
			}

			// Удаление лайка
			await prisma.like.delete({
				where: { id: existingLike.id },
			});

			res.json({ message: "Like removed" });
		} catch (error) {
			console.error("Error in unlikeComment:", error);
			res.status(500).json({ error: "Internal server error" });
		}
	},
};

module.exports = LikeController;
