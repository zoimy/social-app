const { prisma } = require("../prisma/prisma-client")

const FollowsController = {
	follow: async (req, res) => {
		const { followingId } = req.body
		const { userId } = req.user

		if (!followingId) {
			return res.status(400).json({ error: 'This field is required' })
		}

		if (followingId === userId) {
			return res.status(400).json({ error: 'You cannot follow yourself' })
		}

		try {
			const existingFollow = await prisma.follows.findFirst({
				where: {
					AND: [
						{ followerId: userId },
						{ followingId }
					]
				}
			})

			if (existingFollow) {
				return res.status(409).json({ error: 'You are already following this user' })
			}

			await prisma.follows.create({
				data: {
					follower: { connect: { id: userId } },
					following: { connect: { id: followingId } },
				}
			})

			res.json({ message: "You followed successfully" })
		} catch (error) {
			console.error("Error in follow:", error);
			res.status(500).json({ error: "Internal server error" });
		}
	},
	unfollow: async (req, res) => {
		const { id } = req.params
		const { userId } = req.user

		try {
			const follows = await prisma.follows.findFirst({
				where: {
					AND: [
						{ followerId: userId },
						{ followingId: id },
					]
				}
			})

			if (!follows) {
				return res.status(404).json({ error: 'You are not following this user' })
			}

			await prisma.follows.delete({
				where: {
					id: follows.id
				}
			})

			res.json({ message: "You unfollowed successfully" })
		} catch (error) {
			console.error("Error in unfollow:", error);
			res.status(500).json({ error: "Internal server error" });
		}
	},
}

module.exports = FollowsController;