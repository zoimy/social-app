import { Button, Card } from '@nextui-org/react'
import React from 'react'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'

const GoBack = () => {
const navigate = useNavigate()

	const handleClick = () => {
    navigate(-1)
  }

	return (
		<Button variant='ghost' className='flex items-center gap-2 mb-5' onClick={handleClick}>
			<IoMdArrowRoundBack />
			Back
		</Button>
	)
}

export default GoBack