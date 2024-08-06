import React from 'react'
import { useCreatePostMutation, useLazyGetAllPostsQuery, useLazyGetPostByIdQuery } from '../../app/services/postsApi'
import { Controller, useForm } from 'react-hook-form'
import { Button, Textarea } from '@nextui-org/react'
import ErrorMessage from '../error-message'
import { MdCreate } from 'react-icons/md'
import { useCreateCommentMutation } from '../../app/services/commentsApi'
import { useParams } from 'react-router-dom'

const CommentCreate = () => {
	const { id } = useParams<{ id: string }>()
	const [createComment] = useCreateCommentMutation()
	const [triggerGetPostById] = useLazyGetPostByIdQuery()

	const {
		handleSubmit,
		formState: { errors },
		control,
		setValue
	} = useForm()

	const handleCommentCreateSubmit = handleSubmit(async (data) => {
		try {
			if (id) {
				await createComment({ content: data.comment, postId: id }).unwrap()
				await triggerGetPostById(id).unwrap()
				setValue("comment", '')
			}
		} catch (error) {
			console.log("error", error);
		}
	})

	const error = errors?.post?.message as string

	return (
		<form className='max-w-[600px] mx-auto w-full' onSubmit={handleCommentCreateSubmit}>
			<Controller
				name='comment'
				control={control}
				defaultValue=''
				rules={{
					required: "Required field"
				}}
				render={({ field }) => (
					<Textarea
						{...field}
						fullWidth
						placeholder='Express your feelings!'
						labelPlacement='outside'
						className='w-full mt-5 '
					/>
				)}
			/>
			{errors && <ErrorMessage error={error} />}
			<Button color='primary' type='submit' className='flex justify-center mt-4' startContent={<MdCreate />}>
				Send Comment
			</Button>
		</form>
	)
}

export default CommentCreate
