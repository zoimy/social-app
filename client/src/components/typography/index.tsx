import React from 'react'

type TypographyProps = {
	children: string,
	size?: string
}

const Typography = ({ children, size = "2xl" }: TypographyProps) => {
	return (
		<p className={`${size}`}>{children}</p>
	)
}

export default Typography