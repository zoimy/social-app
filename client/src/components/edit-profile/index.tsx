import React, { useContext, useState } from 'react'
import { useUpdateUserMutation } from '../../app/services/userApi'
import { useSelector } from 'react-redux'
import { selectCurrent } from '../../features/user/userSlice'
import { ThemeContext } from '../theme-provider'
import { useParams } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'
import { User } from '../../app/types'
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea } from '@nextui-org/react'
import Input from '../input'
import { MdOutlineEmail } from 'react-icons/md'
import { hasErrorField } from '../../utils/has-error-field'
import ErrorMessage from '../error-message'

type Props = {
	user?: User,
	onClose: () => void,
	isOpen: boolean,
}

const EditProfile = ({
	user,
	onClose = () => null,
	isOpen = false,
}: Props) => {
	const { theme } = useContext(ThemeContext)
	const [updateUser, { isLoading }] = useUpdateUserMutation()
	const [error, setError] = useState('')
	const [selectedFile, setSelectedFile] = useState<File | null>(null)
	console.log(selectedFile);
	
	const { id } = useParams<{ id: string }>()

	const {
		handleSubmit,
		control
	} = useForm<User>({
		mode: 'onChange',
		reValidateMode: 'onBlur',
		defaultValues: {
			name: user?.name,
			email: user?.email,
			bio: user?.bio,
			dateOfBirth: user?.dateOfBirth,
			location: user?.location,
		},
	})

	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files !== null) {
			setSelectedFile(event.target.files[0])
		}
	}

	const onSubmit = async (data: User) => {
		if (id) {
			try {
				const formData = new FormData()
				data.name && formData.append("name", data.name)
				data.email && data.email !== user?.email && formData.append("email", data.email)
				data.bio && formData.append("bio", data.bio)
				data.location && formData.append("location", data.location)
				selectedFile && formData.append("avatar", selectedFile)
				data.dateOfBirth && formData.append("dateOfBirth", new Date(data.dateOfBirth).toISOString())

				await updateUser({ userData: formData, id }).unwrap()
				onClose()
			} catch (error) {
				console.log(error)
				if (hasErrorField(error)) {
					setError(error.data.error)
				}
			}
		}
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			backdrop='blur'
			className={`${theme} text-foreground`}
		>
			<ModalContent>
				{
					(onClose) => (
						<>
							<ModalHeader className='flex flex-col gap-5'>
								Edit Profile
							</ModalHeader>
							<ModalBody>
								<form
									className='flex flex-col gap-5'
									onSubmit={handleSubmit(onSubmit)}
								>
									<Input
										control={control}
										name='name'
										label='Name'
										type='text'
									/>
									<Input
										control={control}
										name='email'
										label='Email'
										type='email'
										endContent={<MdOutlineEmail />}
									/>
									<input
										name='avatarUrl'
										type='file'
										placeholder='Choose a file'
										onChange={handleFileChange}
									/>
									<Controller
										control={control}
										name='bio'
										render={({ field }) => (
											<Textarea
												{...field}
												rows={4}
												placeholder='Your description'
												value={field.value || ""}
											/>
										)}
									/>
									<Input
										control={control}
										name='location'
										label='Location'
										type='text'
									/>
									<Input
										control={control}
										name='dateOfBirth'
										label='Your Birth'
										type='date'
									/>
									<ErrorMessage error={error} />
									<div className='flex gap-2 justify-end'>
										<Button
											fullWidth
											color='primary'
											type='submit'
											isLoading={isLoading}
										>
											Update profile
										</Button>
									</div>
								</form>
							</ModalBody>
							<ModalFooter>
								<Button color='danger' variant='light' onPress={onClose}>
									Close
								</Button>
							</ModalFooter>
						</>
					)}
			</ModalContent>
		</Modal>
	)
}

export default EditProfile