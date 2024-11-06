import React, { FC } from 'react'
import { Button as NextButton } from '@nextui-org/react'

type Props = {
	children: React.ReactNode
	icon?: JSX.Element
	className?: string
	type?: "button" | "submit" | "reset"
	fullWidth?: boolean
	color?:
	| "default"
	| "primary"
	| "secondary"
	| "success"
	| "warning"
	| "danger"
	| undefined
}


export const Button: FC<Props> = ({ children, icon, className, type, fullWidth, color }) => {
	return (
		<NextButton startContent={icon}
			className={className}
			type={type}
			size='lg'
			variant='shadow'
			fullWidth={fullWidth}
			color={color}
		>
			{children}
		</NextButton>
	)
}
