import React from 'react'
import { Input as NextInput } from '@nextui-org/react'
import { Control, useController } from 'react-hook-form'

type InputProps = {
	name: string
	label: string
	placeholder?: string
	type?: string
	control: Control<any>
	required?: string
	endContent?: JSX.Element
}

const Input = ({
	name,
	label,
	placeholder,
	type,
	control,
	required,
	endContent,
}: InputProps) => {

	const {
		field,
		fieldState: { invalid },
		formState: { errors }
	} = useController({
		name,
		control,
		rules: { required }
	})

	return (
		<NextInput
			id={name}
			label={label}
			placeholder={placeholder}
			type={type}
			value={field.value}
			name={field.name}
			isInvalid={invalid}
			onChange={field.onChange}
			onBlur={field.onBlur}
			errorMessage={`${errors[name]?.message ?? ""}`}
			endContent={endContent}
		/>
	)
}

export default Input