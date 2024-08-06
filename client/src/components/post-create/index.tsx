import React from 'react'
import { useCreatePostMutation, useLazyGetAllPostsQuery } from '../../app/services/postsApi'
import { Controller, useForm } from 'react-hook-form'
import { Button, Textarea } from '@nextui-org/react'
import ErrorMessage from '../error-message'
import { MdCreate } from 'react-icons/md'

const PostCreate = () => {
	const [createPost] = useCreatePostMutation()
	const [triggerGetAllPosts] = useLazyGetAllPostsQuery()
	const {
		handleSubmit,
		formState: { errors },
		control,
		setValue
	} = useForm()

	const handlePostCreateSubmit = handleSubmit(async (data) => {
		try {
			await createPost({ content: data.post }).unwrap()
			setValue("post", '')
			await triggerGetAllPosts().unwrap()
		} catch (error) {
			console.log("error", error);
		}
	})

	const error = errors?.post?.message as string

	return (
		<form className='max-w-[600px] mx-auto w-full' onSubmit={handlePostCreateSubmit}>
			<Controller
				name='post'
				control={control}
				defaultValue=''
				rules={{
					required: "Required field"
				}}
				render={({ field }) => (
					<Textarea
						{...field}
						fullWidth
						placeholder='Tell us about something!'
						labelPlacement='outside'
						className='w-full mt-5 '
					/>
				)}
			/>
			{errors && <ErrorMessage error={error} />}
			<Button color='success' type='submit' className='flex justify-center mt-4' startContent={<MdCreate />}>
				Create Post
			</Button>
		</form>
	)
}

export default PostCreate
