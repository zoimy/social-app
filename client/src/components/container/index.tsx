import React, { FC } from 'react'

type ContainerType = {
	children: React.ReactElement[] | React.ReactElement
}

const Container: FC<ContainerType> = ({ children }) => {
	return (
		<div className='flex max-w-screen-xl mx-auto mt-10 space-x-4'>
			{children}
		</div>
	)
}

export default Container
