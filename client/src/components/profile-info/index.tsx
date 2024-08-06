import React from 'react'

type Props = {
	title: string
	info?: string
}

const ProfileInfo = ({
	title,
	info
}: Props) => {

	if (!info) return null

	return (
		<p className='font-semibold'>
			<span className='mr-2 text-gray-500'>{title + ": "}</span>{info}
		</p>
	)
}

export default ProfileInfo