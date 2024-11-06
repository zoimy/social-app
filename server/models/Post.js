const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
	content: String,
	author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Like' }],
	comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
	createdAt: { type: Date, default: Date.now() }
});

const Post = mongoose.model('Post', postSchema)
module.exports = Post