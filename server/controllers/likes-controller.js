const { prisma } = require("../prisma/prisma-client");

const LikeController = {
	like: async (req,res) => {
		const { postId } = req.body
		const { userId } = req.user

		if (!postId) {
			return res.status(400).json({ error: "This filed is required" });
		}

		try {
			const like = await prisma.like.findFirst({
				where: { userId, postId }
			})

			if (like) {
				return res.status(400).json({ error: "You have already liked this post" });
			}

			const newLike = await prisma.like.create({
				data: { userId, postId }
			})

			res.json(newLike)
		} catch (error) {
			console.error("Error in like:", error);
			res.status(500).json({ error: "Internal server error" });
		}
	},
	deleteLike: async (req,res) => {
		const { userId } = req.user
		const { id } = req.params

		if (!id) {
			return res.status(400).json({ error: "No like on this post" });
		}

		try {
			const like = await prisma.like.findFirst({
				where: { userId, postId: id }
			})

			if (!like) {
				return res.status(400).json({ error: "You have already liked this post" });
			}

			 await prisma.like.deleteMany({
				where: {postId: id, userId}
			 })

			 res.json({message: "Like removed"})
		} catch (error) {
			console.error("Error in deleteLike:", error);
			res.status(500).json({ error: "Internal server error" });
		}
	}
}

module.exports = LikeController