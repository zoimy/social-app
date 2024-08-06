import { Post } from "../types";
import { api } from "./api";


export const postsApi = api.injectEndpoints({
	endpoints: (builder) => ({
		createPost: builder.mutation<
			Post,
			{ content: string }
		>({
			query: (postData) => ({
				url: "/posts",
				method: "POST",
				body: postData,
			})
		}),
		getAllPosts: builder.query<
			Post[],
			void
		>({
			query: () => ({
				url: "/posts",
				method: "GET",
			})
		}),
		getPostById: builder.query<
			Post,
			string
		>({
			query: (id) => ({
				url: `/posts/${id}`,
				method: "GET",
			})
		}),
		deletePost: builder.mutation<
			void,
			string
		>({
			query: (id) => ({
				url: `/posts/${id}`,
				method: "DELETE",
			})
		}),
	})
})

export const {
	useCreatePostMutation,
	useDeletePostMutation,
	useGetAllPostsQuery,
	useGetPostByIdQuery,
	useLazyGetAllPostsQuery,
	useLazyGetPostByIdQuery,
} = postsApi

export const {
	endpoints: {
		createPost,
		getAllPosts,
		getPostById,
		deletePost
	}
} = postsApi