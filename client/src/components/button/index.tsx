import React from 'react'
import { Button as NextButton } from '@nextui-org/react'

type buttonProps = {
	children: React.ReactNode
	icon?: JSX.Element
	className?: string
	type?: "button" | "reset" | "submit"
	fullWidth?: boolean
	color?: "default"
	| "primary"
	| "secondary"
	| "success"
	| "warning"
	| "danger"
	| undefined
}

const Button = ({
	children,
	icon,
	className,
	type,
	fullWidth,
	color
}: buttonProps) => {
	return (
		<NextButton
			startContent={icon}
			size='lg'
			variant='light'
			className={className}
			type={type}
			fullWidth={fullWidth}
			color={color}
		>
			{children}
		</NextButton>
	)
}

export default Button