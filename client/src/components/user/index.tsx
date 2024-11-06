import React, { useEffect } from 'react'
import {User as UserNextUi} from '@nextui-org/react'
import { BASE_URL } from '../../constants'

type UserProps = {
	name: string
	avatarUrl: string
	description?: string
	className?: string
}


const User: React.FC<UserProps> = ({ name = '', description = '', avatarUrl = '', className = '' }) => {
	
	return (
		<UserNextUi
      name={name}
      description={description}
      className={className}
			avatarProps={{
				src: `${BASE_URL}${avatarUrl}`
			}}
    />
	)
}

export default User