import { Card, CardBody, Tab, Tabs } from '@nextui-org/react'
import React, { useState } from 'react'
import Login from '../../features/user/login'
import Register from '../../features/user/register'

const Auth = () => {
	const [selected, setSelected] = useState("login")
	return (
		<div className='flex justify-center items-center h-screen'>
			<div className='flex flex-col'>
				<Card className='max-w-full w-[350px] h-[450px]'>
					<CardBody className='overflow-hidden'>
						<Tabs
							color='primary'
							aria-label="Tabs colors"
							radius="full"
							className='mx-auto'
							fullWidth
							size='md'
							selectedKey={selected}
							onSelectionChange={(key) => setSelected(key as string)}
						>
							<Tab key="login" title="Login" >
								<Login setSelected={setSelected} />
							</Tab>
							<Tab key="register" title="Registration" >
								<Register setSelected={setSelected} />
							</Tab>
						</Tabs>
					</CardBody>
				</Card>
			</div>
		</div>
	)
}

export default Auth