import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import Input from '../../components/input'
import { Button, Link } from '@nextui-org/react'
import { useLazyCurrentQuery, useLoginMutation } from '../../app/services/userApi'
import { Navigate, useNavigate } from 'react-router-dom'
import { hasErrorField } from '../../utils/has-error-field'
import ErrorMessage from '../../components/error-message'

type LoginProps = {
	email: string
	password: string
}

type Props = {
	setSelected: (value: string) => void
}

const Login = ({ setSelected }: Props) => {
	const {
		control,
		handleSubmit,
		formState: { errors, isValid }
	} = useForm({
		mode: "onChange",
		reValidateMode: "onBlur",
		defaultValues: {
			email: "",
			password: ""
		}
	})

	const [login, { isLoading }] = useLoginMutation()
	const [error, setError] = useState("")
	const [triggerCurrentQuery] = useLazyCurrentQuery()
	const navigate = useNavigate()

	const handleSubmitlogin = async (data: LoginProps) => {
		try {
			await login(data).unwrap()
			await triggerCurrentQuery().unwrap()
			navigate('/')
		} catch (error) {
			if (hasErrorField(error)) {
				setError(error.data.error)
			}
		}
	}

	return (
		<form className='' onSubmit={handleSubmit(handleSubmitlogin)}>
			<div className='flex flex-col gap-5'>
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
					Don't have an account yet?
					<Link size='sm' className='cursor-pointer ml-2 mt-5 ' onPress={() => setSelected("register")}>
						Register
					</Link>
				</p>
			</div>
			<div className='flex mt-8'>
				<Button fullWidth color='primary' type='submit' isLoading={isLoading} disabled={!isValid}>
					Login
				</Button>
			</div>
		</form>
	)
}

export default Login