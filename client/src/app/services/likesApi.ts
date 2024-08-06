import { Like } from "../types";
import { api } from "./api";

export const likesApi = api.injectEndpoints({
	endpoints: (builder) => ({
		like: builder.mutation<
			Like,
			{ postId: string }
		>({
			query: (body) => ({
				url: "/likes",
				method: "POST",
				body,
			})
		}),
		deleteLike: builder.mutation<
			void,
			string
		>({
			query: (postId) => ({
				url: `/likes/${postId}`,
				method: "DELETE",
			})
		}),
	})
})

export const {
	useDeleteLikeMutation,
	useLikeMutation
} = likesApi

export const {
	endpoints: {
		like,
		deleteLike
	}
} = likesApi