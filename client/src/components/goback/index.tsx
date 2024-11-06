import React from 'react'
import { BsBackpack } from 'react-icons/bs'
import { FaBackspace, FaRegArrowAltCircleLeft } from 'react-icons/fa'
import { FaBackwardStep } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'

const GoBack = () => {
	const navigate = useNavigate()

	const handleBack = () => {
		navigate(-1)
	}

	return (
		<div onClick={handleBack} className='text-white inline-flex gap-2 items-center mb-10 border-1 rounded-md px-2 py-1 cursor-pointer'>
			<FaRegArrowAltCircleLeft/>
			<p>Go back</p>
		</div>
	)
}

export default GoBack