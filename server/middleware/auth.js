const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
	const headers = req.headers['authorization']

	const token = headers && headers.split(' ')[1]

	if (!token) {
		return res.status(401).json({ message: 'Unauthorized' })
	}

	jwt.verify(token, process.env.SECRET, (err,user) => {
		if (err) {
			return res.status(403).json({ message: 'Invalid token' })
		}

		req.user = user

		next()
	})
}

module.exports = { authMiddleware }