import React, { FC, useState } from 'react'
import { useForm } from 'react-hook-form';
import Input from '../../components/input';
import { Button, Link } from '@nextui-org/react';
import { useLazyCurrentQuery, useLoginMutation } from '../../app/services/userApi';
import { useNavigate } from 'react-router-dom';
import { hasErrorField } from '../../utils/has-error-field';
import ErrorMessage from '../../components/error-message';

type Login = {
	email: string;
	password: string;
}

type Props = {
	setSelected: (value: string) => void
}

const Login: FC<Props> = ({ setSelected }) => {
	const {
		handleSubmit,
		control,
		formState: { errors }
	} = useForm<Login>({
		mode: "onChange",
		reValidateMode: "onBlur",
		defaultValues: {
			email: "",
			password: ""
		}
	})

	const [login, { isLoading }] = useLoginMutation()
	const [error, setError] = useState("")
	const navigate = useNavigate()
	const [triggerCurrentQuery] = useLazyCurrentQuery()

	const onSubmit = async (data: Login) => {
		try {
			if (data.email === "" || data.password === "") {
				setError("Email or password are inccorect")
				return
			}
			await login(data).unwrap()
			await triggerCurrentQuery().unwrap()
			navigate('/')
		} catch (error) {
			if (hasErrorField(error)) {
				setError(error.data.error)
			}else {
				setError("Email or password are inccorect")
			}
		}
	}

	return (
		<form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
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
			<ErrorMessage error={error}/>
			<p className='text-small text-center cursor-pointer'>
				Don't have an account?
				<Link className='ml-2' size='sm' onPress={() => setSelected("sign-up")} >
					Go to resgister
				</Link>
			</p>
			<div className='flex gap-2 justify-end'>
				<Button fullWidth color='primary' type='submit' isLoading={isLoading}>
					Login
				</Button>
			</div>
		</form>
	)
}

export default Login