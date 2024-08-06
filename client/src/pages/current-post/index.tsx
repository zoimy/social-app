import React from 'react'
import { useParams } from 'react-router-dom'
import { useGetPostByIdQuery } from '../../app/services/postsApi'
import { Spinner } from '@nextui-org/react'
import Card from '../../components/card'
import GoBack from '../../components/go-back'
import CommentCreate from '../../components/comment-create'

const CurrentPost = () => {
	const params = useParams<{ id: string }>()
	const { data } = useGetPostByIdQuery(params?.id ?? "")

	if (!data) return <Spinner size='lg' className='flex justify-center mt-24 ' />

	const {
		id,
		author,
		authorId,
		content,
		comments,
		createdAt,
		likedByUser,
		likes
	} = data

	return (
		<>
			<GoBack />
			<Card
				cardFor='current-post'
				avatarUrl={author?.avatarUrl ?? ""}
				name={author?.name ?? ""}
				authorId={authorId}
				content={content}
				createdAt={createdAt}
				likedByUser={likedByUser}
				id={id}
				likesCount={likes?.length}
				commentsCount={comments?.length}
			/>
			<div className='mt-10'>
				<CommentCreate />
			</div>
			<div className='mt-10'>
				{
					data.comments && data.comments.length > 0 ?
						<p className='text-center text-default-700 text-xl font-semibold mb-3'>Comments</p>
						: null
				}
				{
					data.comments
						? data.comments.map((comment) => (
							<Card
								cardFor="comment"
								key={comment.id}
								avatarUrl={comment.user.avatarUrl ?? ""}
								content={comment.content}
								name={comment.user.name ?? ""}
								authorId={comment.userId}
								commentId={comment.id}
								id={id}
							/>
						)) : null
				}
			</div>
		</>
	)
}

export default CurrentPost