const mongoose = require("mongoose");
const { Schema } = require("mongoose");


const UserSchema = new Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	name: { type: String },
	avatarUrl: String,
	dateOfBirth: Date,
	createdAt: { type: Date, default: Date.now() },
	updatedAt: { type: Date, default: Date.now() },
	bio: String,
	location: String,
	posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
	likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Like" }],
	comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
	followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Follows" }],
	following: [{ type: mongoose.Schema.Types.ObjectId, ref: "Follows" }],
})

const User = mongoose.model('User', UserSchema)
module.exports = User