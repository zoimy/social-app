import React from 'react'
import { useSelector } from 'react-redux'
import { selectCurrent } from '../../features/user/userSlice'
import { Card, CardBody, CardHeader, Image } from '@nextui-org/react'
import { BASE_URL } from '../../constants'
import { Link } from 'react-router-dom'
import { MdEmail } from 'react-icons/md'

const Profile = () => {
	const current = useSelector(selectCurrent)

	if (!current) return null

	const { email, name, avatarUrl, id } = current
	return (
		<div className="flex justify-center items-center ">
			<Card className='py-4 max-w-[300px] w-full'>
				<CardHeader className='pb-0 pt-2 px-4 flex-col items-start'>
					<Image
						alt='bg'
						className='object-cover rounded-xl'
						src={`${BASE_URL}${avatarUrl}`}
						width={370}
					/>
				</CardHeader>
				<CardBody className='overflow-visible py-2'>
					<Link to={`/users/${id}`}>
						<h4 className='font-bold text-center text-large mb-2'>{name}</h4>
					</Link>
					<p className='justify-center text-default-500 flex gap-4 items-center'>
						<MdEmail />
						{email}
					</p>
				</CardBody>
			</Card>
		</div>
	)
}

export default Profile
