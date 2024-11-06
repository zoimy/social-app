import React, { FC } from 'react'
import { Button } from '../button'
import { Link } from 'react-router-dom'

type Props = {
	children: React.ReactNode,
	icon: JSX.Element,
	href: string,
	isActive?: boolean
}

export const NavButton: React.FC<Props> = ({ children, icon, href, isActive }) => {
  return (
    <Button className={ "flex justify-start text-xl"} icon={icon} color={isActive ? 'primary': 'default'}>
      <Link to={href}>
        {children}
      </Link>
    </Button>
  )
}
