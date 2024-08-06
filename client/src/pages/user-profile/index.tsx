import React, { useEffect } from 'react'
import GoBack from '../../components/go-back'
import { Button, Card, Image, useDisclosure } from '@nextui-org/react'
import { useCurrentQuery, useGetUserByIdQuery, useLazyCurrentQuery, useLazyGetUserByIdQuery } from '../../app/services/userApi'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { resetUser, selectCurrent } from '../../features/user/userSlice'
import { BASE_URL } from '../../constants'
import { MdPersonAddAlt, MdPersonAddDisabled } from 'react-icons/md'
import { CiEdit } from 'react-icons/ci'
import ProfileInfo from '../../components/profile-info'
import { formatToClientDate } from '../../utils/format-to-client-date'
import CountInfo from '../../components/count-info'
import { useGetAllPostsQuery } from '../../app/services/postsApi'
import { useFollowMutation, useUnfollowMutation } from '../../app/services/followApi'
import EditProfile from '../../components/edit-profile'

const UserProfile = () => {
	const { id } = useParams<{ id: string }>()
	const { isOpen, onClose, onOpen } = useDisclosure()
	const currentUser = useSelector(selectCurrent)
	const { data } = useGetUserByIdQuery(id ?? "")
	const [triggerCurrentQuery] = useLazyCurrentQuery()
	const [triggerGetUserByIdQuery] = useLazyGetUserByIdQuery()
	const [follow] = useFollowMutation()
	const [unfollow] = useUnfollowMutation()
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(resetUser())
	}, [])

	const handleFollow = async () => {
		try {
			if (id) {
				data?.isFollowing
					? await unfollow(id).unwrap()
					: await follow({ followingId: id }).unwrap()

				await triggerGetUserByIdQuery(id)
				await triggerCurrentQuery()
			}
		} catch (error) {

		}
	}

	const handleClose = async () => {
		try {
			if (id) {
				await triggerGetUserByIdQuery(id).unwrap()
				await triggerCurrentQuery()
				onClose()
			}
		} catch (error) {
			console.log(error);
		}
	}

	if (!data) return null

	return (
		<>
			<GoBack />
			<div className='flex items-stretch gap-4 '>
				<Card className='flex flex-col items-center text-center space-y-4 p-5 max-w-[400px] w-full'>
					<Image
						src={`${BASE_URL}${data?.avatarUrl}`}
						alt={data.name}
						width={300}
						height={200}
						className='border-4 border-white object-cover'
					/>
					<div className='flex flex-col gap-5 items-center font-bold text-lg'>
						{data.name}
						{
							currentUser?.id !== id ? (
								<Button
									color={data.isFollowing ? 'default' : "primary"}
									variant='flat'
									className=''
									onClick={handleFollow}
									endContent={
										data.isFollowing ? (
											<MdPersonAddDisabled />
										) : (
											<MdPersonAddAlt />
										)
									}
								>
									{data.isFollowing ? "Unfollow" : "Follow"}
								</Button>
							) : (
								<Button
									endContent={<CiEdit />}
									onClick={() => onOpen()}
								>
									Edit
								</Button>
							)
						}

					</div>
				</Card>
				<Card fullWidth className='max-h-[400px] pb-5'>
					<div className='ml-5 mt-1'>
						<ProfileInfo title='Email' info={data.email} />
					</div>
					<div className='flex justify-center items-center h-screen gap-5 text-lg'>
						<CountInfo title='posts' count={currentUser?.posts.length ?? 0} />
						<CountInfo title='followers' count={data.followers.length} />
						<CountInfo title='following' count={data.following.length} />
					</div>
					<div className='flex flex-col justify-center ml-5 gap-1 '>
						<ProfileInfo title='Location' info={data.location} />
						<ProfileInfo title='Birth' info={formatToClientDate(data.dateOfBirth)} />
						<ProfileInfo title='About' info={data.bio} />
					</div>
				</Card>
			</div>
			<EditProfile user={data} onClose={handleClose} isOpen={isOpen} />
		</>
	)
}

export default UserProfile