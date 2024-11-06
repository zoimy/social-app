import { api } from "./api";
import { Follows } from "../types";


export const followApi = api.injectEndpoints({
	endpoints: (builder) => ({
		follow: builder.mutation<
			Follows, { followingId: string }
		>({
			query: (body) => ({
				url: '/follow',
				method: 'POST',
				body,
			})
		}),
		unfollow: builder.mutation<
			void, { followingId: string }
		>({
			query: () => ({
				url: `/unfollow`,
				method: 'DELETE',
			})
		})
	})
})

export const {
	useFollowMutation,
	useUnfollowMutation
} = followApi;

export const {
	endpoints: { follow, unfollow }
} = followApi