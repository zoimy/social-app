const mongoose = require('mongoose')

const followsSchema = new mongoose.Schema({
  follower: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  followerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  following: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  followingId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const Follows = mongoose.model('Follows', followsSchema);
module.exports = Follows