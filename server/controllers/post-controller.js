const { prisma } = require("../prisma/prisma-client");

const PostController = {
	create: async (req, res) => {
		const { content } = req.body
		const userId = req.user.userId

		if (!content) {
			return res.status(400).json({ error: "All fields are required" });
		}

		try {
			const post = await prisma.post.create({
				data: {
					content,
					authorId: userId
				}
			})

			res.json(post)
		} catch (error) {
			console.error("Error in createPost:", error);
			res.status(500).json({ error: "Internal server error" });
		}
	},
	getAllPosts: async (req, res) => {
		const userId = req.user.userId

		try {
			const posts = await prisma.post.findMany({
				include: {
					author: true,
					likes: true,
					comments: true
				},
				orderBy: {
					createdAt: "desc"
				}
			})

			if (!posts) {
				return res.status(404).json({ error: "No posts found" });
			}

			const postsWithLike = posts.map((post) => ({
				...post,
				likedByUser: post.likes.some(like => like.userId === userId)
			}))

			res.json(postsWithLike)
		} catch (error) {
			console.error("Error in getAllPosts:", error);
			res.status(500).json({ error: "Internal server error" });
		}
	},
	getPostById: async (req, res) => {
		const { userId } = req.user
		const { id } = req.params

		try {
			const post = await prisma.post.findUnique({
				where: { id },
				include: {
					comments: {
						include: {
							user: true,
							likes: true
						}
					},
					likes: true,
					author: true,
				}
			})

			if (!post) {
				return res.status(404).json({ error: "Post not found" });
			}

			const postWithLikeInfo = {
				...post,
				likedByUser: post.likes.some(like => like.userId === userId),
				comments: post.comments.map(comment => ({
					...comment,
					likedByUser: comment.likes.some(like => like.userId === userId)
				}))
			};


			res.json(postWithLikeInfo)
		} catch (error) {
			console.error("Error in getUserById:", error);
			res.status(500).json({ error: "Internal server error" });
		}
	},
	deletePost: async (req, res) => {
		const { id } = req.params
		const { userId } = req.user

		const post = await prisma.post.findUnique({ where: { id } })

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		if (post.authorId !== userId) {
			return res.status(403).json({ error: "No access" });
		}

		try {
			const transaction = await prisma.$transaction([
				prisma.comment.deleteMany({ where: { postId: id } }),
				prisma.like.deleteMany({ where: { postId: id } }),
				prisma.post.delete({ where: { id } }),
			])

			res.json({message: "Post removed successfully"})
		} catch (error) {
			console.error("Error in deletePost:", error);
			res.status(500).json({ error: "Internal server error" });
		}
	},
}

module.exports = PostController