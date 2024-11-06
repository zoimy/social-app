const Comment = require("../models/Comment")
const Like = require("../models/Like")
const Post = require("../models/Post")


const PostController = {
	createPost: async (req, res) => {
		const authorId = req.user.userId
		const { content } = req.body

		if (!content) {
			return res.status(400).json({
				message: 'Please fill all fields'
			})
		}
		try {
			const post = await Post.create({ author: authorId, content })

			res.json(post)
		} catch (error) {
			console.error("CreatePost error: ", error)
			res.status(500).json({ message: "Internal Server Error" })
		}
	},
	getAllPosts: async (req, res) => {
		const userId = req.user.userId.toString()

		try {
			const posts = await Post.find()
				.populate('author')
				.populate('likes')
				.populate('comments')
				.sort({ createdAt: 'desc' })
				.lean()

			const postsWithLikes = posts.map(post => ({
				...post,
				likedByUser: post.likes.some(like => like.userId.toString() === userId)
			}))

			res.json(postsWithLikes)
		} catch (error) {
			console.error("AllPostsGet error: ", error)
			res.status(500).json({ message: "Internal Server Error" })
		}
	},
	getPostById: async (req, res) => {
		const { id } = req.params
		const userId = req.user.userId

		try {
			const post = await Post.findById(id)
				.populate('likes')
				.populate('comments')
				.populate('author')
				.lean()

			if (!post) {
				return res.status(404).json({
					message: 'Post not found'
				})
			}

			const postsWithLikes = {
				...post,
				likedByUser: post.likes.some(like => like.userId === userId)
			}

			res.json(postsWithLikes)
		} catch (error) {
			console.error("GetPostById error: ", error)
			res.status(500).json({ message: "Internal Server Error" })
		}
	},
	deletePost: async (req, res) => {
		const { id } = req.params
		const userId = req.user.userId

		try {
			const post = await Post.findById(id)

			if (!post) {
				return res.status(404).json({
					message: 'Post not found'
				})
			}

			if (post.author.toString() !== userId) {
				return res.status(403).json({
					message: 'You are not authorized to delete this post'
				})
			}

			await Promise.all([
				Like.deleteMany({ postId: id }),
				Comment.deleteMany({ postId: id }),
				Post.findByIdAndDelete(id)
			])

			res.json({ message: "Removed succesfully" })
		} catch (error) {
			console.error("deletePost error: ", error)
			res.status(500).json({ message: "Internal Server Error" })
		}
	},
}

module.exports = PostController;