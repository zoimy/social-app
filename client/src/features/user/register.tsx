import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import Input from '../../components/input'
import { Button, Link } from '@nextui-org/react'
import { useRegisterMutation } from '../../app/services/userApi'
import ErrorMessage  from '../../components/error-message'
import { hasErrorField } from '../../utils/has-error-field'

type RegisterProps = {
	name: string
	email: string
	password: string
}

type Props = {
	setSelected: (value: string) => void
}

const Register = ({ setSelected }: Props) => {
	const {
		control,
		handleSubmit,
		formState: { errors }
	} = useForm({
		mode: "onChange",
		reValidateMode: "onBlur",
		defaultValues: {
			name: "",
			email: "",
			password: ""
		}
	})

	const [register] = useRegisterMutation()
	const [error, setError] = useState("")

	const onSubmit = async (data: RegisterProps) => {
		try {
			await register(data).unwrap()
			setSelected('login')
		} catch (error) {
			if (hasErrorField(error)) {
				setError(error.data.error)
			}
		}
	}

	return (
		<form className='' onSubmit={handleSubmit(onSubmit)}>
			<div className='flex flex-col gap-5'>
				<Input
					control={control}
					name='name'
					label='Name'
					type='text'
					required='Required field'
				/>
				<Input
					control={control}
					name='email'
					label='Email'
					type='email'
					required='Required field'
				/>
				<Input
					control={control}
					name='password'
					label='Password'
					type='password'
					required='Required field'
				/>
			</div>
			<ErrorMessage error={error} />
			<div className='text-center'>
				<p className=' text-small text-slate-300'>
					You already have an account?
					<Link size='sm' className='cursor-pointer ml-2 mt-5 ' onPress={() => setSelected("login")}>
						Login
					</Link>
				</p>
			</div>
			<div className='flex mt-8'>
				<Button fullWidth color='primary' type='submit' >
					Register
				</Button>
			</div>
		</form>
	)
}

export default Register