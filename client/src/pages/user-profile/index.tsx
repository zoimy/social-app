import React from 'react'
import { useLocation } from 'react-router-dom'
import { BASE_URL } from '../../constants'
import { Card } from '@nextui-org/react'
import { MdEmail } from 'react-icons/md'

const UserProfile = () => {
	const location  = useLocation()
	const {userData} = location.state || {}
	return (
		<div>
      {userData ? (
        <Card className='max-w-[200px] flex flex-col items-center py-2 px-2'>
          <img src={`${BASE_URL}${userData.avatarUrl}`} alt="User avatar" />
          <p className='mt-5 text-default-500 text-sm flex gap-5 items-center'><MdEmail/> {userData.email}</p>
          {/* Здесь можно добавить любую другую информацию */}
        </Card>
      ) : (
        <p>Данные пользователя не найдены.</p>
      )}
		</div>
	)
}

export default UserProfile