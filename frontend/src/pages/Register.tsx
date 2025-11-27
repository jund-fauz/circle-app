import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createToken } from '@/config/redux/auth/action'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

export function Register() {
	const [fullName, setFullName] = useState('')
	const [userName, setUserName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const navigate = useNavigate()
	const dispatch = useDispatch()

	return (
		<div className='flex flex-col items-center gap-2'>
			<img src='/logo.png' alt='Logo' />
			<h1 className='font-bold text-2xl'>Create account Circle</h1>
			<form
				className='flex flex-col gap-3'
				onSubmit={(e) => {
					e.preventDefault()
					fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/auth/register`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							username: userName,
							name: fullName,
							email,
							password,
						}),
					})
						.then((res) => res.json())
						.then((data) => {
							if (data.status == 'error') setError(data.message)
							else {
								dispatch(createToken(data.data.token))
								navigate('/home')
							}
						})
						.catch((error) => setError(error))
				}}
			>
				<Input
					className='border-gray-700'
					placeholder='Full Name'
					required
					type='text'
					value={fullName}
					onChange={(e) => setFullName(e.target.value)}
				/>
				<Input
					className='border-gray-700'
					placeholder='Username'
					required
					type='text'
					value={userName}
					onChange={(e) => setUserName(e.target.value)}
				/>
				<Input
					className='border-gray-700'
					placeholder='Email'
					required
					type='email'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<Input
					className='border-gray-700'
					placeholder='Password'
					required
					type='password'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				{error && <p className='text-red-500'>{error}</p>}
				<Button className='hover:cursor-pointer bg-green-600 hover:bg-green-900'>
					Create
				</Button>
			</form>
			<p>
				Already have account?{' '}
				<Link to='/login' className='text-green-700'>
					Login
				</Link>
			</p>
		</div>
	)
}
