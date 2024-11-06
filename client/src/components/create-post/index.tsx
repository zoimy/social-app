import React from 'react'
import { useCreatePostMutation, useLazyGetAllPostsQuery } from '../../app/services/postsApi'
import { Controller, useForm } from 'react-hook-form'
import { Button, Textarea } from '@nextui-org/react'
import ErrorMessage from '../error-message'
import { FaAddressCard } from 'react-icons/fa'
import { CgAdd } from 'react-icons/cg'

type FormData = {
	post: string
}


const CreatePost = () => {
	const [createPost] = useCreatePostMutation()
	const [triggerGetAllPosts] = useLazyGetAllPostsQuery()
	const {
		handleSubmit,
		control,
		formState: { errors },
		setValue,
		setError
	} = useForm<FormData>()

	async function handleFormSubmit(data: FormData) {
		try {
			await createPost({content: data.post}).unwrap()
			setValue("post","")
			await triggerGetAllPosts().unwrap()
		} catch (error) {
			console.log(error)
		}
		
	}

	const error = errors?.post?.message as string
	return (
		<form className='flex-grow' onSubmit={handleSubmit(handleFormSubmit)}> 
			<Controller
				name='post'
				control={control}
				defaultValue=""
				rules={{
					required: 'Fill this input'
				}}
				render={({ field }) => (
					<Textarea
						{...field}
						labelPlacement='outside'
						placeholder='Tell about smth'
						className='mb-5'
					/>
				)}
			/>

			{errors && <ErrorMessage error={error} />}

			<Button className='flex items-center text-base' color='success' type='submit' endContent={<CgAdd />}>Add Post</Button>
		</form>
	)
}

export default CreatePost