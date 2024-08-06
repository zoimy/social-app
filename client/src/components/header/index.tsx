import { avatar, Button, Card, CardBody, Image, Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@nextui-org/react'
import React, { useContext } from 'react'
import { ThemeContext } from '../theme-provider'
import { FaMoon, FaRegSun } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { logout, selectCurrent, selectIsAuthenticated } from '../../features/user/userSlice'
import { Link, useNavigate } from 'react-router-dom'
import { LuLogOut } from 'react-icons/lu'
import { BASE_URL } from '../../constants'

const Header = () => {
	const isAuth = useSelector(selectIsAuthenticated)
	const current = useSelector(selectCurrent)
	const { theme, toggleTheme } = useContext(ThemeContext)
	const dispatch = useDispatch()
	const navigate = useNavigate()

	if (!current) return null

	const { avatarUrl, name, id} = current

	const handleLogout = () => {
		dispatch(logout())
		localStorage.removeItem("token")
		navigate("/auth")
	}

	return (
		<Navbar>
			<NavbarBrand>
				<p className='text-inherit font-bold'>Bistogram</p>
			</NavbarBrand>
			<NavbarContent justify='end' className='flex gap-8'>
				<NavbarItem className='lg:flex text-3xl cursor-pointer' onClick={() => toggleTheme()}>
					{theme === 'light' ? <FaMoon /> : <FaRegSun />}
				</NavbarItem>
				<NavbarItem>
					{
						isAuth && (
								<Button variant='ghost' color='default' onClick={handleLogout} className='gap-2'>
									<LuLogOut size={18} />
									<span>logout</span>
								</Button>
						)
					}
				</NavbarItem>
			</NavbarContent>
		</Navbar>
	)
}

export default Header