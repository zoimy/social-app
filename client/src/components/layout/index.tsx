import React, { useEffect } from 'react'
import Header from '../header'
import Container from '../container'
import NavBar from '../nav-bar'
import { Outlet, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated, selectUser } from '../../features/user/userSlice'
import Profile from '../profile'

const Layout = () => {
	const isAuth = useSelector(selectIsAuthenticated)
	const user = useSelector(selectUser)
	const navigate = useNavigate()

	useEffect(() => {
		if (!isAuth) {
			navigate("/auth")
		}
	}, [])

	return (
		<>
			<Header />
			<Container>
				<div className=''>
					<NavBar />
				</div>
				<div className='flex-grow mx-auto'>
					<Outlet />
				</div>
				<div className='ml-auto'>
					<div className='flex-col flex gap-5'>
						{!user && <Profile />}
					</div>
				</div>
			</Container>
		</>
	)
}

export default Layout
