import { Like } from "../types";
import { api } from "./api";

export const likesApi = api.injectEndpoints({
	endpoints: (builder) => ({
		likePost: builder.mutation<
			Like,
			{ postId: string }
		>({
			query: (body) => ({
				url: "/likes",
				method: "POST",
				body,
			})
		}),
		deletePostLike: builder.mutation<
			void,
			string
		>({
			query: (postId) => ({
				url: `/likes/${postId}`,
				method: "DELETE",
			})
		}),
		likeComment: builder.mutation<Like, { commentId: string }>({
			query: (body) => ({
				url: "/comment-likes",
				method: "POST",
				body,
			}),
		}),
		deleteCommentLike: builder.mutation<void, {commentId: string}>({
			query: ({commentId}) => ({
				url: `/comment-likes`,
				method: "DELETE",
				body: {commentId}
			}),
		}),
	}),

})

export const {
	useLikeCommentMutation,
	useLikePostMutation,
	useDeletePostLikeMutation,
	useDeleteCommentLikeMutation,
} = likesApi

export const {
	endpoints: {
		likeComment,
		likePost,
		deletePostLike,
		deleteCommentLike
	}
} = likesApi