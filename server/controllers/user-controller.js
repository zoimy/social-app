const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const path = require("path")
const Jdenticon = require('jdenticon');
const { prisma } = require("../prisma/prisma-client");
const fs = require("fs");

const UserController = {
	register: async (req, res) => {
		const { email, password, name } = req.body;

		// Проверяем поля на существование
		if (!email || !password || !name) {
			return res.status(400).json({ error: "All fiels are required" });
		}

		try {
			// Проверяем, существует ли пользователь с таким emai
			const existingUser = await prisma.user.findUnique({ where: { email } });
			if (existingUser) {
				return res.status(400).json({ error: "User already exists" });
			}

			// Хешируем пароль
			const hashedPassword = await bcrypt.hash(password, 10);

			// Генерируем аватар для нового пользователя
			const png = Jdenticon.toPng(name, 200);
			const avatarName = `${name}_${Date.now()}.png`;
			const avatarPath = path.join(__dirname, '/../uploads', avatarName);
			fs.writeFileSync(avatarPath, png);

			// Создаем пользователя
			const user = await prisma.user.create({
				data: {
					email,
					password: hashedPassword,
					name,
					avatarUrl: `/uploads/${avatarName}`,
				},
			});

			res.json(user);
		} catch (error) {
			console.error("Error in register:", error);
			res.status(500).json({ error: "Internal server error" });
		}
	},
	login: async (req, res) => {
		const { email, password } = req.body

		if (!email || !password) {
			return res.status(400).json({ error: "All fields are required" });
		}

		try {
			const user = await prisma.user.findUnique({ where: { email } })

			if (!user) {
				return res.status(401).json({ error: "Wrong email or password" });
			}

			const valid = await bcrypt.compare(password, user.password)

			if (!valid) {
				return res.status(401).json({ error: "Wrong email or password" });
			}

			const token = jwt.sign(({ userId: user.id }), process.env.SECRET_KEY)

			res.json({ token })
		} catch (error) {
			console.error("Error in login:", error);
			res.status(500).json({ error: "Internal server error" });
		}

	},
	current: async (req, res) => {
		const { userId } = req.user

		try {
			const user = await prisma.user.findUnique({
				where: { id: userId },
				include: {
					followers: {
						include: {
							follower: true
						}
					},
					following: {
						include: {
							following: true
						}
					},
					posts: true
				},
			})

			if (!user) {
				return res.status(401).json({ error: "User not found" });
			}

			res.json(user);
		} catch (error) {
			console.error("Error in currentUser:", error);
			res.status(500).json({ error: "Internal server error" });
		}
	},
	getUserById: async (req, res) => {
		const { id } = req.params
		const userId = req.user.userId

		try {
			const user = await prisma.user.findUnique({
				where: { id },
				include: {
					followers: true,
					following: true,
				}
			})

			if (!user) {
				return res.status(404).json({ error: "User not found" });
			}

			const isFollowing = await prisma.follows.findFirst({
				where: {
					AND: [
						{ followerId: userId },
						{ followingId: id }
					]
				}
			})

			res.json({ ...user, isFollowing: Boolean(isFollowing) });
		} catch (error) {
			console.error("Error in getUserById:", error);
			res.status(500).json({ error: "Internal server error" });
		}
	},
	updateUser: async (req, res) => {
		const { id } = req.params
		const { name, email, dateOfBirth, bio, location } = req.body

		let filePath

		if (req.file && req.file.path) {
			filePath = req.file.path;
		}
		console.log(filePath);
		

		if (id !== req.user.userId) {
			return res.status(403).json({ error: "No access" });
		}

		try {
			if (email) {
				const existingUser = await prisma.user.findFirst({ where: { email: email } })

				if (existingUser && existingUser.id !== id) {
					return res.status(400).json({ error: "Email already exists" });
				}

			}

			const user = await prisma.user.update({
				where: { id },
				data: {
					email: email || undefined,
					name: name || undefined,
					dateOfBirth: dateOfBirth || undefined,
					bio: bio || undefined,
					location: location || undefined,
					avatarUrl: filePath ? `/${filePath}` : undefined,
				}
			})

			res.json(user)
		} catch (error) {
			console.error("Error in updateUser:", error);
			res.status(500).json({ error: "Internal server error" });
		}
	},
}

module.exports = UserController;