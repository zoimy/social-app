import { Follows } from "../types";
import { api } from "./api";

export const followApi = api.injectEndpoints({
	endpoints: (builder) => ({
		follow: builder.mutation<
			void,
			{ followingId: string }
		>({
			query: (body) => ({
				url: "/follow",
				method: "POST",
				body: body,
			})
		}),
		unfollow: builder.mutation<
			void,
			string
		>({
			query: (userId) => ({
				url: `/unfollow/${userId}`,
				method: "DELETE",
			})
		}),
	})
})

export const {
	useFollowMutation,
	useUnfollowMutation
} = followApi

export const {
	endpoints: {
		follow,
		unfollow
	}
} = followApi