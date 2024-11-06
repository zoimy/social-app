import { api } from "./api";
import { Like } from "../types";


export const likesApi = api.injectEndpoints({
	endpoints: (builder) => ({
		like: builder.mutation<
			Like, { postId: string }
		>({
			query: (body) => ({
				url: '/likes',
				method: 'POST',
				body: body,
			})
		}),
		unlike: builder.mutation<
			void, string
		>({
			query: (postId) => ({
				url: `/likes/${postId}`,
				method: 'DELETE',
			})
		})
	})
})

export const {
	useLikeMutation,
	useUnlikeMutation
} = likesApi;

export const {
	endpoints: { like, unlike }
} = likesApi