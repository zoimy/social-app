import React from 'react'
import { IconType } from 'react-icons'

type Props = {
	count: number
	Icon: IconType
}

const MetaInfo = ({
	count,
	Icon
}: Props) => {
	return (
		<div className='flex items-center  gap-1 cursor-pointer'>
			{count > 0 && (
				<p className='font-bold flex  items-center text-default-400 text-lg'>
					{count}
				</p>
			)}
			<p className='font-semibold flex items-center text-default-400 text-xl'>
				<Icon />
			</p>
		</div>
	)
}

export default MetaInfo