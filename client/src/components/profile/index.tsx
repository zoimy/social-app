import { Card, CardBody, CardHeader, Image } from '@nextui-org/react'
import React from 'react'
import { BASE_URL } from '../../constants'
import { useSelector } from 'react-redux'
import { selectCurrent } from '../../features/user/userSlice'
import { Link } from 'react-router-dom'
import { MdEmail } from 'react-icons/md'

const Profile = () => {
	const current = useSelector(selectCurrent)

	if (!current) {
		return null
	}

	const { name, email, avatarUrl, _id} = current
	
	return (
		<div>
			<Card className='w-[200px]'>
				<CardHeader className='pb-0 px-4 flex-col '>
					<Image src={`${BASE_URL}${avatarUrl}`} className='object-cover rounded-xl'/>
				</CardHeader>
				<CardBody className='overflow-visible mb-4 py-0 flex-col items-center'> 
					<Link to={`/users/${_id}`} className='font-bold text-zinc-200 text-xl mb-2'>{name}</Link>
					<p className='text-default-500 text-sm flex items-center gap-5'><MdEmail/>{email}</p>
				</CardBody>
			</Card>
		</div>
	)
}

export default Profile