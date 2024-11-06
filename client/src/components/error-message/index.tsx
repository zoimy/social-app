import React from 'react'

const ErrorMessage = ({error}: {error: string}) => {
	return error ? <p className='text-sm text-red-600 mb-2 mt-5'>{error}</p> : null
}

export default ErrorMessage