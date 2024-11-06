import React from 'react'
import { useParams } from 'react-router-dom'
import { useGetPostByIdQuery } from '../../app/services/postsApi'
import Card from '../../components/card'
import GoBack from '../../components/goback'
import CreateComment from '../../components/create-comment'
import { useGetUserByIdQuery } from '../../app/services/userApi'

const CurrentPost = () => {
	const params = useParams<{ id: string }>()
	const { data } = useGetPostByIdQuery(params?.id ?? '')
	
	if (!data) {
		return <div>Post doesn't exist</div>
	}
	const {
		content,
		createdAt,
		author,
		authorId,
		comments,
		likes,
		likedByUser,
		id
	} = data
	
	return (
		<div>
			<GoBack />
			<Card
				name={author.name ?? ''}
				avatarUrl={author.avatarUrl ?? ''}
				authorId={authorId}
				content={content}
				cardFor='current-post'
				likesCount={likes.length}
				commentsCount={comments.length}
				id={id}
				likedByUser={likedByUser}
				createdAt={createdAt}
				/>
			<div className="mt-10">
				<CreateComment />
			</div>
			<div className='mt-10'>
				{data.comments && data.comments.map(comment => {
					return (
						<Card
						key={comment._id}
						name='anonymous'
						avatarUrl={comment.user.avatarUrl ?? 'https://sun6-21.userapi.com/s/v1/ig2/PTmB9725YNvMtpBMRYQyZb2diHbBUu62K-Ew_3Sqh9QVEMVQDymnL76KccHdrd81BRMc5rYxHT4H24AbpcOl346G.jpg?size=1648x1648&quality=96&crop=3,3,1648,1648&ava=1'}
						authorId={comment.userId}
						content={comment.content}
						cardFor='comment'
						_id={id}
						commentId={comment._id}
						/>
					)
				}
				)}
			</div>
		</div>
	)
}

export default CurrentPost