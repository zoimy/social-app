import React, { FC, useState } from 'react'
import Input from '../../components/input'
import { Button, Link } from '@nextui-org/react'
import { useForm } from 'react-hook-form'
import { useRegisterMutation } from '../../app/services/userApi'
import { hasErrorField } from '../../utils/has-error-field'
import ErrorMessage from '../../components/error-message'

type Register = {
	name: string
	email: string
	password: string
}

type Props = {
	setSelected: (value: string) => void
}

const Registration: FC<Props> = ({ setSelected }) => {
	const {
		handleSubmit,
		control,
		formState: { errors }
	} = useForm<Register>({
		mode: "onChange",
		reValidateMode: "onBlur",
		defaultValues: {
			email: "",
			password: "",
			name: "",
		}
	})

	const [register, { isLoading }] = useRegisterMutation()
	const [error, setError] = useState("")

	const onSubmit = async (data: Register) => {
		try {
			await register(data).unwrap()
			setSelected("login")
		} catch (error) {
			if (hasErrorField(error)) {
				setError(error.data.error)
			}
		}
	}
	return (
		<form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
			<Input
				control={control}
				name='name'
				label='name'
				placeholder='Name'
				type='text'
				required="I'ts required"
			/>
			<Input
				control={control}
				name='email'
				label='email'
				placeholder='Email'
				type='email'
				required="I'ts required"
			/>
			<Input
				control={control}
				name='password'
				label='password'
				placeholder='Password'
				type='password'
				required="I'ts required"
			/>
			<ErrorMessage error={error} />
			<p className='text-small text-center cursor-pointer'>
				Already have an account?
				<Link className='ml-2' size='sm' onPress={() => setSelected("login")} >
					Go to login
				</Link>
			</p>
			<div className='flex gap-2 justify-end'>
				<Button fullWidth color='primary' type='submit' isLoading={isLoading}>
					Sign up
				</Button>
			</div>
		</form>
	)
}

export default Registration