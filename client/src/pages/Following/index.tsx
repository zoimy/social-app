import React from 'react'
import { useSelector } from 'react-redux'
import { selectCurrent } from '../../features/user/userSlice'
import User from '../../components/user'
import { Card, CardBody } from '@nextui-org/react'
import { Link } from 'react-router-dom'
import GoBack from '../../components/go-back'

const Following = () => {
	const current = useSelector(selectCurrent)

	if (!current) return null

	return (
		<>
			<GoBack />
			{current.following.length > 0 ? (
				<div className='flex flex-col gap-5'>
					{
						current.following.map((user) => (
							<Card key={user.following.id} className='mr-auto  w-[300px] max-w-full'>
								<Link to={`/users/${user.following.id}`} key={user.following.id}>
									<CardBody>
										<User
											name={user.following.name ?? ""}
											avatarUrl={user.following.avatarUrl ?? ""}
											description={user.following.bio ?? ""}
										/>
									</CardBody>
								</Link>
							</Card>
						))
					}
				</div>
			) : (
				<p className='text-center text-default-500'>You have no Following</p>
			)
			}
		</>
	)
}

export default Following