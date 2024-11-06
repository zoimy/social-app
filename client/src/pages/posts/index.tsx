import React, { useEffect } from 'react'
import CreatePost from '../../components/create-post'
import { useGetAllPostsQuery } from '../../app/services/postsApi'
import Card from '../../components/card'

const Posts = () => {
	const { data } = useGetAllPostsQuery()


	return (
		<div>
			<div className='mb-10 w-full flex'>
				<CreatePost />
			</div>
			{data && Array.isArray(data) && data.length > 0 ? data.map(({ _id, createdAt, content, author, comments, likes, likedByUser }) => {
				const id = _id;

				return (
					<Card
						key={id}
						name={author.name || ''}
						authorId={author._id}
						content={content}
						likesCount={likes.length}
						commentsCount={comments.length}
						avatarUrl={author.avatarUrl ?? ''}
						id={id}
						likedByUser={likedByUser}
						createdAt={createdAt}
						cardFor="post"
					/>
				)
			}) : null}
		</div>
	)
}

export default Posts
