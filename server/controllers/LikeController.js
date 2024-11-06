const Like = require("../models/Like");
const Post = require("../models/Post");

const LikeController = {
	like: async (req, res) => {
    const { postId } = req.body;
    const userId = req.user.userId;
		console.log('post:'+ postId,'user:' + userId);

    if (!postId) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {

        const newLike = await Like.create({ userId, postId });

        // Получаем пост, к которому добавляем лайк
        const post = await Post.findById(postId);

        // Добавляем созданный лайк в массив лайков поста
        post.likes.push(newLike._id);
        await post.save();

        // Возвращаем информацию о созданном лайке
        res.json(newLike);
    } catch (error) {
        console.error("Like error: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
},
	unlike: async (req, res) => {
		const { id } = req.params;
		const userId = req.user.userId;

		if (!id) {
			return res.status(400).json({ error: 'Post ID is required' });
		}

		try {
			const post = await Post.findById(id);

			if (!post) {
				return res.status(404).json({ error: 'Post not found' });
			}

			if (!Array.isArray(post.likes)) {
				return res.status(400).json({ error: 'Invalid likes field in the post' });
			}

			post.likes = post.likes.filter(like => like && like.userId && like.userId.toString() !== userId);
			await post.save();

			res.json({ message: 'Like removed successfully' });
		} catch (error) {
			console.error("Unlike error: ", error);
			res.status(500).json({ message: "Internal Server Error" });
		}
	}

}

module.exports = LikeController;