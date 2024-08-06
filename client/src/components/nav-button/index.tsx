import React from 'react'
import Button from '../button'
import { Link } from 'react-router-dom'

type NavButton = {
	icon: JSX.Element
	href: string
	children: React.ReactNode
}

const NavButton = ({
	icon,
	href,
	children
}: NavButton) => {
	return (
		<div>
			<Button className='flex justify-start text-xl' icon={icon}>
				<Link to={href}>
					{children}
				</Link>
			</Button>
		</div>
	)
}

export default NavButton