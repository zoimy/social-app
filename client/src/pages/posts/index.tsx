import React from 'react'
import PostCreate from '../../components/post-create'
import { useGetAllPostsQuery } from '../../app/services/postsApi'
import Card from '../../components/card'

const Posts = () => {
	const { data } = useGetAllPostsQuery()
	// console.log(data);

	return (
		<>
			<div className='flex w-full'>
				<PostCreate />
			</div>
			<div className='mt-[62px]'>
				{
					data && data.length > 0
						? data.map(
							({
								content,
								author,
								authorId,
								id,
								createdAt,
								updatedAt,
								likedByUser,
								likes,
								comments,

							}) => {

								return (
									<Card
										key={id}
										avatarUrl={author.avatarUrl ?? ""}
										name={author.name ?? ""}
										likesCount={likes.length}
										commentsCount={comments.length}
										authorId={authorId}
										id={id}
										likedByUser={likedByUser}
										content={content}
										createdAt={createdAt}
										cardFor='post'
									/>
								)
							}) : null
				}
			</div>
		</>
	)
}

export default Posts