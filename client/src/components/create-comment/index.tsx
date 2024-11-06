import React from 'react'
import { useCreateCommentMutation } from '../../app/services/commentsApi'
import { useLazyGetPostByIdQuery } from '../../app/services/postsApi'
import { Controller, useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { Button, Textarea, useSelect } from '@nextui-org/react'
import ErrorMessage from '../error-message'
import { CgAdd } from 'react-icons/cg'
import { selectCurrent } from '../../features/user/userSlice'
import { useSelector } from 'react-redux'

const CreateComment = () => {
	const { id } = useParams<{ id: string }>()
	const [createComment] = useCreateCommentMutation()
		
	const [triggerGetPostById] = useLazyGetPostByIdQuery()
	const {
		handleSubmit,
		control,
		formState: { errors },
		setValue
	} = useForm()

	async function handleFormSubmit(data: any) {
		try {
			if (id) { 
				await createComment({ content: data.comment, postId: id}).unwrap() // Pass user._id
				await triggerGetPostById(id).unwrap()
				setValue("comment", "")
		} else {
				console.error("User is not logged in or missing user ID.");
		}
		} catch (error) {
			console.log(error)
		}

	}

	const error = errors?.comment?.message as string
	return (
		<form className='flex-grow' onSubmit={handleSubmit(handleFormSubmit)}>
			<Controller
				name="comment"
				control={control}
				defaultValue=""
				rules={{
					required: "Поле обязательно",
				}}
				render={({ field }) => (
					<Textarea
						{...field}
						labelPlacement="outside"
						placeholder="Напишите свой ответ"
						className="mb-5"
					/>
				)}
			/>
			{errors && <ErrorMessage error={error} />}

			<Button className='flex items-center text-base' color='success' type='submit' endContent={<CgAdd />}>Reply on</Button>
		</form>
	)
}

export default CreateComment