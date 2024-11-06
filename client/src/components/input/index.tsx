import React, { FC } from 'react'
import { Input as NextInput } from '@nextui-org/react'
import { Control, useController } from 'react-hook-form';

type Props = {
	name: string;
	label: string;
	placeholder: string;
	type?: string;
	control: Control<any>;
	required?: string;
	endContent?: JSX.Element
}

const Input: FC<Props> = (
	{
		name,
		label,
		placeholder,
		type,
		control,
		required = '',
		endContent,
	}
) => {
	const {
		field,
		fieldState: { invalid },
		formState: { errors }
	} = useController({
		name, control, rules: { required }
	})
	return (
		<NextInput
			id={name}
			label={label}
			placeholder={placeholder}
			type={type}
			value={field.value}
			onChange={field.onChange}
			name={field.name}
			isInvalid={invalid}
			onBlur={field.onBlur}
			errorMessage={`${errors[0]?.message ?? ""}`}
			endContent={endContent}
		/>
	)
}

export default Input