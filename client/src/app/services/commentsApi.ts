import { Comment } from "../types";
import { api } from "./api";

type CreateCommentPayload = {
	content: string;
	postId: string;
	parentCommentId?: string; // Optional for replies
}

type GetCommentsQueryParams = {
	postId: string | undefined;
}

export const commentsApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getComments: builder.query<
			Comment[],
			GetCommentsQueryParams
		>({
			query: ({ postId }) => ({
				url: `/comments/${postId}`,
				method: "GET"
			})
		}),
		createComment: builder.mutation<
			Comment,
			{ content: string; postId: string; parentCommentId?: string }
		>({
			query: ({ content, postId, parentCommentId }) => ({
				url: "/comments",
				method: "POST",
				body: { content, postId, parentCommentId },
			})
		}),
		getCommentReplies: builder.mutation<
			Comment[],
			{parentCommentId: string}
		>({
			query: ({parentCommentId}) => ({
				url: `/comments/${parentCommentId}/replies`,
				method: "GET",
			})
		}),
		deleteComment: builder.mutation<
			void,
			string
		>({
			query: (commentId) => ({
				url: `/comments/${commentId}`,
				method: "DELETE",
			})
		}),
	})
})

export const {
	useCreateCommentMutation,
	useDeleteCommentMutation,
	useGetCommentsQuery,
	useGetCommentRepliesMutation,
} = commentsApi

export const {
	endpoints: {
		createComment,
		deleteComment,
		getComments,
		getCommentReplies,
	}
} = commentsApi