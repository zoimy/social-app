import React, { useEffect } from 'react'
import Header from '../header'
import Container from '../container'
import NavBar from '../nav-bar'
import { Outlet, useNavigate } from 'react-router-dom'
import { useSelect } from '@nextui-org/react'
import { useSelector } from 'react-redux'
import { selectIsAuth, selectUser } from '../../features/user/userSlice'
import Profile from '../profile'

const Layout = () => {
	const isAuth = useSelector(selectIsAuth)
	const user = useSelector(selectUser)
	const navigate = useNavigate()

	useEffect(() => {
		if (!isAuth) {
			navigate('/auth')
		}
	}, [])

	return (
		<>
			<Header />
			<Container>
				<div className="flex-2 p-4">
					<NavBar />
				</div>
				<div className="flex-1 p-4">
					<Outlet />
				</div>
				<div className='flex-2 p-4'>
					<div className='flex-col gap-5'>{!user && <Profile />}</div>
				</div>
			</Container>
		</>
	)
}

export default Layout