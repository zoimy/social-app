const Follows = require("../models/Follows")


const FollowController = {
	follow: async (req, res) => {
		const { followingId } = req.body
		const userId = req.user.userId

		if (!followingId) {
			return res.status(400).json({ error: 'All fields are required' })
		}

		if (followingId === userId) {
			return res.status(400).json({
				message: 'You cannot follow yourself'
			})
		}

		try {
			const subscribe = await Follows.findOne({ follower: userId, followingId: followingId })

			if (subscribe) {
				return res.status(402).json({
					message: 'This subcriby already exists'
				})
			}

			const follow = await Follows.create({ follower: userId, followingId: followingId })

			res.json(follow)
		} catch (error) {
			console.error("Follow error: ", error);
			res.status(500).json({ message: "Internal Server Error" });
		}
	},
	unfollow: async (req, res) => {
		const { followingId } = req.body
		const userId = req.user.userId

		if (!followingId) {
			return res.status(400).json({ error: 'All fields are required' })
		}

		try {
			const follow = await Follows.findOneAndDelete({ follower: userId, followingId: followingId })

			if (!follow){
				return res.status(402).json({
          message: 'This subcriby does not exist'
        })
			}

			res.status(201).json({message: "You unfollowed user"})
		} catch (error) {
			console.error("Unfollow  error: ", error);
			res.status(500).json({ message: "Internal Server Error" });
		}
	}
}

module.exports = FollowController;