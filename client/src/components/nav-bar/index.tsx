import React from 'react'
import NavButton from '../nav-button'
import { BsFilePost } from 'react-icons/bs'
import { FaUsers } from 'react-icons/fa'
import { ImUsers } from 'react-icons/im'

const NavBar = () => {
	return (
		<nav>
			<ul className='flex flex-col gap-5'>
				<li>
					<NavButton icon={<BsFilePost/>} href='/'>
						Posts
					</NavButton>
				</li>
				<li>
					<NavButton icon={<FaUsers/>} href='/followers'>
						Followers
					</NavButton>
				</li>
				<li>
					<NavButton icon={<ImUsers/>} href='/following'>
						Following
					</NavButton>
				</li>
			</ul>
		</nav>
	)
}

export default NavBar