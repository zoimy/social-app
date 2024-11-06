const User = require("../models/User")
const jdenticon = require("jdenticon")
const path = require("path")
const fs = require("fs")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const Follows = require("../models/Follows")

const UserController = {
	register: async (req, res) => {
		const { password, name, email } = req.body

		if (!email || !password || !name) {
			return res.status(400).json({
				message: 'Please fill all fields'
			})
		}

		try {
			const existingUser = await User.findOne({ email })

			if (existingUser) {
				return res.status(400).json({
					message: 'User already exists'
				})
			}

			const file = jdenticon.toPng(`${name}${Date.now()}`, 200)
			const avatarUrl = `${name}_${Date.now()}.png`
			const avatarPath = path.join(__dirname, '/../uploads', avatarUrl)
			fs.writeFileSync(avatarPath, file)

			const salt = await bcrypt.genSalt(10)
			const hashedPassword = await bcrypt.hash(password, salt)

			const newUser = new User({
				name,
				email,
				password: hashedPassword,
				avatarUrl: `/uploads/${avatarUrl}`,
			})

			const user = await newUser.save()

			res.json(user)
		} catch (error) {
			console.error("Register error: ", error)
			res.status(500).json({ message: "Internal Server Error" })
		}
	},
	login: async (req, res) => {
		const { password, email } = req.body

		if (!email || !password) {
			return res.status(400).json({
				message: 'Please fill all fields'
			})
		}

		try {
			const user = await User.findOne({ email })

			if (!user) {
				return res.status(400).json({
					message: 'Wrong password or email'
				})
			}

			const isValid = await bcrypt.compare(password, user.password)

			if (!isValid) {
				return res.status(400).json({
					message: 'Wrong password or email'
				})
			}

			const token = jwt.sign({
				userId: user._id
			}, process.env.SECRET)

			res.json({ ...user._doc, token })
		} catch (error) {
			console.error("Register error: ", error)
			res.status(500).json({ message: "Internal Server Error" })
		}
	},
	getUserById: async (req, res) => {
		const { id } = req.params
		const userId = req.user.userId

		try {
			const user = await User.findById(id)
				.populate('following')

			if (!user) {
				return res.status(404).json({
					message: 'User not found'
				})
			}

			const isFollowing = await Follows.findOne(
				{
					followingId: id,
					followerId: userId,
				}
			)

			res.json({ user, isFollowing: Boolean(isFollowing) })
		} catch (error) {
			console.error("getUserById error: ", error)
			res.status(500).json({ message: "Internal Server Error" })
		}
	},
	updateUser: async (req, res) => {
		const { id } = req.params
		const { email, name, dateOfBirth, bio, location } = req.body

		let filePath;

		if (req.file && req.file.path) {
			filePath = req.file.path
		}

		if (id !== req.user.userId) {
			return res.status(401).json({
				message: 'Not allowed permis'
			})
		}

		try {
			const existingUser = await User.findOne({ email })

			if (existingUser && existingUser._id !== id) {
				return res.status(400).json({
					message: 'Email already exists'
				})
			}

			const user = await User.findByIdAndUpdate(id, {
				email,
				name,
				dateOfBirth,
				bio,
				location,
				avatarUrl: filePath ? `/${filePath}` : undefined,
			})

			const updatedUser = await user.save()

			res.json(updatedUser)
		} catch (error) {
			console.error("updateUser error: ", error)
			res.status(500).json({ message: "Internal Server Error" })
		}
	},
	currentUser: async (req, res) => {
		const userId = req.user.userId
		try {
			const user = await User.findById(userId)
				.populate({
					path: 'following',
					populate: {
						path: 'following',
					}
				})
				.populate({
					path: 'followers',
					populate: {
						path: 'follower',
					}
				})

			if (!user) {
				return res.status(404).json({
					message: 'User not found'
				})
			}

			res.status(200).json(user)
		} catch (error) {
			console.error("currentUser error: ", error)
			res.status(500).json({ message: "Internal Server Error" })
		}
	},
	allUsers: async (req, res) => {
		try {
				const {email} = req.query;
				console.log(email)
 
				console.log("Received email query:", email);
 
				if (!email) {
						return res.status(400).json({
								message: 'Email query parameter is required'
						});
				}
 
				const users = await User.find({ email: { $regex: email, $options: 'i' } });
 
				if (users.length === 0) {
						return res.status(404).json({
								message: 'No users found'
						});
				}
 
				console.log("Found users:", users);
				res.status(200).json(users[0]);
		} catch (error) {
				console.error("Error fetching users:", error);
				res.status(500).json({ message: "Internal Server Error" });
		}
 },
}

module.exports = UserController;