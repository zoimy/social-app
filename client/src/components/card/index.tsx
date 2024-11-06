import React, { useState } from 'react'
import { CardBody, CardFooter, CardHeader, Card as NextCard, Spinner } from '@nextui-org/react'
import { useLikeMutation, useUnlikeMutation } from '../../app/services/likesApi'
import { useDeletePostMutation, useLazyGetAllPostsQuery, useLazyGetPostByIdQuery } from '../../app/services/postsApi'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrent } from '../../features/user/userSlice'
import { formatToClientDate } from '../../utils/format-to-client-date'
import { RiDeleteBinLine } from 'react-icons/ri'
import Typography from '../typography'
import MetaInfo from '../meta-info'
import { FcDislike } from 'react-icons/fc'
import { MdOutlineFavoriteBorder } from 'react-icons/md'
import { FaComment, FaRegComment } from 'react-icons/fa'
import ErrorMessage from '../error-message'
import User from '../user'
import { hasErrorField } from '../../utils/has-error-field'
import { useDeleteCommentMutation } from '../../app/services/commentsApi'

type CardProps = {
	name: string
	avatarUrl: string
	authorId: string
	content: string
	commentId?: string
	likesCount?: number
	commentsCount?: number
	createdAt?: Date
	_id?: string
	id?: string
	cardFor: 'post' | 'comment' | 'current-post'
	likedByUser?: boolean
}

const Card: React.FC<CardProps> = ({
	name = '',
	avatarUrl = '',
	authorId = '',
	content = '',
	commentId = '',
	likesCount = 0,
	commentsCount = 0,
	createdAt,
	id = '',
	cardFor = 'post',
	likedByUser = false,
}) => {
	const [like] = useLikeMutation()
	const [unlike] = useUnlikeMutation()
	const [deleteComment, deleteCommentStatus] = useDeleteCommentMutation()
	const [deletePost, deletePostStatus] = useDeletePostMutation()
	const [triggerGetAllPosts] = useLazyGetAllPostsQuery()
	const [triggerGetPostById] = useLazyGetPostByIdQuery()
	const [error, setError] = useState<string>("")
	const navigate = useNavigate()
	const currentUser = useSelector(selectCurrent)

	const refetchPosts = async () => {
		switch (cardFor) {
			case 'post':
				await triggerGetAllPosts().unwrap()
				break
			case 'current-post':
				await triggerGetPostById(id).unwrap()
				break
			case 'comment':
				await triggerGetPostById(id).unwrap()
				break
			default:
				throw new Error('Invalid cardFor argument')
		}
	}

	
	const handleLike = async () => {
		try {
			console.log(id);
			
			likedByUser
				? await unlike(id).unwrap()
				: await like({ postId: id }).unwrap()

			await refetchPosts()
		} catch (error) {
			if (hasErrorField(error)) {
				setError(error.data.error);
			} else {
				setError(JSON.stringify(error));
			}
		}
	}

	const handleDelete = async () => {
		try {
			switch (cardFor) {
				case 'post':
					await deletePost(id).unwrap()
					await refetchPosts()
					break
				case 'current-post':
					await deletePost(id).unwrap()
					navigate('/')
					break
				case 'comment':
					await deleteComment(commentId).unwrap()
					await refetchPosts()
					break
				default:
					throw new Error('Invalid cardFor argument')
			}
		} catch (error: any) {
			if (hasErrorField(error)) {
				setError(error.data.error)
			} else {
				setError(JSON.stringify(error));
			}
		}
	}


	return (
		<NextCard className='mb-5'>
			<CardHeader className="justify-between items-center bg-transparent">
				<Link to={`/users/${authorId}`}>
					<User
						name={name}
						className="text-small font-semibold leading-none text-default-600"
						avatarUrl={avatarUrl}
						description={createdAt && formatToClientDate(createdAt)}
					/>
				</Link>
				{authorId === currentUser?._id && (
					<div className="cursor-pointer" onClick={handleDelete}>
						{deletePostStatus.isLoading || deleteCommentStatus.isLoading ? (
							<Spinner />
						) : (
							<RiDeleteBinLine />
						)}
					</div>
				)}
			</CardHeader>
			<CardBody className="px-3 py-2 mb-5">
				<Link to={`/posts/${id}`}>
					<Typography>{content}</Typography>
				</Link>
			</CardBody>
			{cardFor !== "comment" && (
				<CardFooter className="gap-3">
					<div className="flex gap-5 items-center">
						<div onClick={handleLike}>
							<MetaInfo
								count={likesCount}
								Icon={likedByUser ? FcDislike : MdOutlineFavoriteBorder}
							/>
						</div>
						<Link to={`/posts/${id}`}>
							<MetaInfo count={commentsCount} Icon={FaRegComment} />
						</Link>
					</div>
					<ErrorMessage error={error} />
				</CardFooter>
			)}
		</NextCard>
	)
}

export default Card
