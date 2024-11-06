import React from "react"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import App from "./App"
import { store } from "./app/store"
import "./index.css"
import { NextUIProvider } from "@nextui-org/react"
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import { ThemeProvider } from "./components/theme-provider"
import Layout from "./components/layout"
import Auth from "./pages/auth"
import Followers from "./pages/followers"
import Following from "./pages/following"
import Posts from "./pages/posts"
import CurrentPost from "./pages/current-post"
import UserProfile from "./pages/user-profile"
import AuthGuard from "./features/user/AuthGuard"

const container = document.getElementById("root")

const router = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
		children: [
			{
				path: "followers",
				element: <Followers />,
			},
			{
				path: "following",
				element: <Following />,
			},
			{
				path: "",
				element: <Posts />,
			},
			{
				path: "posts/:id",
				element: <CurrentPost />,
			},
			{
				path: "users/:id",
				element: <UserProfile />,
			},
		]
	},
	{
		path: "/auth",
		element: <Auth />,
	},
])

if (container) {
	const root = createRoot(container)

	root.render(
			<Provider store={store}>
				<NextUIProvider>
					<ThemeProvider>
						<AuthGuard>
							<RouterProvider router={router} />
						</AuthGuard>
					</ThemeProvider>
				</NextUIProvider>
			</Provider>
	)
} else {
	throw new Error(
		"Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
	)
}
