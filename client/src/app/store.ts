import { useState } from 'react';
import type { Action, ThunkAction } from "@reduxjs/toolkit"
import { combineSlices, configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import auth from "../features/user/userSlice"
import { api } from "./services/api"
import { listenerMiddleware } from '../middleware/auth';


export const store = configureStore({
	reducer: {
		[api.reducerPath]: api.reducer,
		auth
	},

	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware()
			.concat(api.middleware)
			.prepend(listenerMiddleware.middleware)

	// Adding the api middleware enables caching, invalidation, polling,
	// and other useful features of `rtk-query`.
})

export type AppStore = typeof store
export type AppDispatch = AppStore["dispatch"]
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>
