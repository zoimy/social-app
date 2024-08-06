import React from 'react'
import { useSelector } from 'react-redux'
import { selectCurrent } from '../../features/user/userSlice'
import User from '../../components/user'
import { Card, CardBody } from '@nextui-org/react'
import { Link } from 'react-router-dom'
import GoBack from '../../components/go-back'

const Followers = () => {
	const current = useSelector(selectCurrent)

	if (!current) return null

	return (
		<>
			<GoBack />
			{current.followers.length > 0 ? (
				<div className='flex flex-col gap-5 '>
					{
						current.followers.map((user) => (
							<Card key={user.follower.id} className='mr-auto  w-[300px] max-w-full'>
								<Link to={`/users/${user.follower.id}`} key={user.follower.id}>
									<CardBody>
										<User
											name={user.follower.name ?? ""}
											avatarUrl={user.follower.avatarUrl ?? ""}
											description={user.follower.bio ?? ""}
										/>
									</CardBody>
								</Link>
							</Card>
						))
					}
				</div>
			) : (
				<p className='text-center text-default-500'>You have no followers</p>
			)}
		</>
	)
}

export default Followers