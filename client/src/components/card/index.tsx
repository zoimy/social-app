import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDeleteLikeMutation, useLikeMutation } from '../../app/services/likesApi'
import { useCreateCommentMutation, useDeleteCommentMutation } from '../../app/services/commentsApi'
import { useDeletePostMutation, useGetAllPostsQuery, useLazyGetAllPostsQuery, useLazyGetPostByIdQuery } from '../../app/services/postsApi'
import { Link, useNavigate } from 'react-router-dom'
import { card, CardBody, CardFooter, CardHeader, Card as NextCard, Spinner } from '@nextui-org/react'
import User from '../user'
import { formatToClientDate } from '../../utils/format-to-client-date'
import { useSelector } from 'react-redux'
import { selectCurrent } from '../../features/user/userSlice'
import { FcDeleteDatabase, FcDislike, FcLike, FcLikePlaceholder } from 'react-icons/fc'
import Typography from '../typography'
import MetaInfo from '../meta-info'
import { MdDelete, MdFavorite, MdFavoriteBorder, MdOutlineFavoriteBorder } from 'react-icons/md'
import { FaComment, FaRegComment, FaRegHeart } from 'react-icons/fa'
import ErrorMessage from '../error-message'
import { hasErrorField } from '../../utils/has-error-field'
import { AiOutlineDislike, AiOutlineLike } from 'react-icons/ai'

type CardProps = {
	avatarUrl: string,
	name: string
	authorId: string
	content: string
	commentId?: string
	likesCount?: number
	commentsCount?: number
	createdAt?: Date
	id?: string
	cardFor: "comment" | "post" | "current-post"
	likedByUser?: boolean
}

const Card = (
	{
		avatarUrl = "",
		name = "",
		authorId = "",
		content = " ",
		commentId = "",
		likesCount = 0,
		commentsCount = 0,
		createdAt,
		id = "",
		cardFor = "post",
		likedByUser = false
	}: CardProps
) => {
	const [like] = useLikeMutation()
	const [deleteLike] = useDeleteLikeMutation()
	const [createComment] = useCreateCommentMutation()
	const [deleteComment, deleteCommentStatus] = useDeleteCommentMutation()
	const [deletePost, deletePostStatus] = useDeletePostMutation()
	const [triggerGetAllPosts] = useLazyGetAllPostsQuery()
	const [triggerGetPostById] = useLazyGetPostByIdQuery()
	const [error, setError] = useState("")
	const navigate = useNavigate()
	const current = useSelector(selectCurrent)

	const refetchPosts = async () => {
		switch (cardFor) {
			case "post":
				await triggerGetAllPosts().unwrap()
				break
			case "current-post":
				await triggerGetPostById(id).unwrap()
				break
			case "comment":
				await triggerGetPostById(id).unwrap()
				break
			default:
				throw new Error("Неверный аргумент cardFor")
		}
	}

	const handleDelete = async () => {
		switch (cardFor) {
			case "post":
				await deletePost(id).unwrap()
				await refetchPosts()
				break
			case "current-post":
				await deletePost(id).unwrap()
				navigate('/')
				break
			case "comment":
				await deleteComment(commentId).unwrap()
				await refetchPosts()
				break
			default:
				throw new Error("Неверный аргумент cardFor")
		}
	}

	const handleClick = async () => {
		try {
			likedByUser
				? await deleteLike(id).unwrap()
				: await like({ postId: id }).unwrap()

			await refetchPosts()
		} catch (error) {
			if (hasErrorField(error)) {
				setError(error.data.error)
			} else {
				setError(error as string)
			}
		}
	}

	return (
		<NextCard className='max-w-[600px] mx-auto mb-5'>
			<CardHeader className='flex justify-between items-center bg-transparent'>
				<Link to={`/users/${authorId}`}>
					<User
						name={name}
						description={createdAt && formatToClientDate(createdAt)}
						avatarUrl={avatarUrl}
						className='text-small font-semibold leading-none text-default-600'
					/>
				</Link>
				{authorId === current?.id && (
					<div className='cursor-pointer' onClick={handleDelete}>
						{deletePostStatus.isLoading || deleteCommentStatus.isLoading ? (
							<Spinner />
						) : (
							<MdDelete size={24} />
						)}
					</div>
				)}
			</CardHeader>
			<CardBody className='px-3 py-2 mb-5'>
				<Link to={`/posts/${id}`}>
					<Typography >
						{content}
					</Typography>
				</Link>
			</CardBody>
			{cardFor !== "comment" && (
				<CardFooter className=''>
					<div className='flex gap-5 items-center'>
						<div onClick={handleClick}>
							<MetaInfo
								count={likesCount} Icon={likedByUser ? FcDislike : FaRegHeart}
							/>
						</div>
						<Link to={`/posts/${id}`}>
							<MetaInfo
								count={commentsCount}
								Icon={commentsCount > 0  ? FaComment : FaRegComment}
							/>
						</Link>
					</div>
					<ErrorMessage error={error} />
				</CardFooter>
			)}
		</NextCard>
	)
}

export default Card