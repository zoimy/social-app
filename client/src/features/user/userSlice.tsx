import { createSlice } from "@reduxjs/toolkit";
import { User } from "../../app/types";
import { userApi } from "../../app/services/userApi";
import { RootState } from "../../app/store";


interface IinitialState {
	user: User | null
	users: User[] | null
	current: User | null
	isAuth: boolean
	token?: string
}

const initialState: IinitialState = {
	user: null,
	users: null,
	current: null,
	isAuth: false,
}

const slice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		logout: () => initialState,
		resetUser: (state) => {
			state.user = null
		}
	},
	extraReducers: builder => {
		builder
			.addMatcher(userApi.endpoints.login.matchFulfilled, (state, action) => {
				state.token = action.payload.token
				state.isAuth = true
			})
			.addMatcher(userApi.endpoints.current.matchFulfilled, (state, action) => {
				state.current = action.payload
				state.isAuth = true
			})
			.addMatcher(userApi.endpoints.getUserById.matchFulfilled, (state, action) => {
				state.user = action.payload
			})
	}
})


export const { logout, resetUser } = slice.actions
export default slice.reducer

export const selectIsAuth = (state: RootState) => state.auth.isAuth


export const selectUser = (state: RootState) => state.auth.user

export const selectUsers = (state: RootState) => state.auth.users

export const 	selectCurrent = (state: RootState) => state.auth.current
