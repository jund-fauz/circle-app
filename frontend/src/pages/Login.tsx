import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createToken } from '@/config/redux/auth/action'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

export function Login() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const navigate = useNavigate()
	const dispatch = useDispatch()

	return (
		<div className='flex flex-col items-center gap-4'>
			<img src='/logo.png' alt='Logo' />
			<h1 className='font-bold text-2xl'>Login to Circle</h1>
			<form
				className='flex flex-col gap-2'
				onSubmit={(e) => {
					e.preventDefault()
					fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/auth/login`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							identifier: email,
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
					placeholder='Email / Username'
					required
					type='text'
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
				<Link className='text-right text-xs' to='/'>
					Forgot Password?
				</Link>
				<Button className='hover:cursor-pointer bg-green-600 hover:bg-green-900 rounded-4xl'>
					Login
				</Button>
			</form>
			<p>
				Don't have an account yet?{' '}
				<Link to='/register' className='text-green-700'>
					Create account
				</Link>
			</p>
		</div>
	)
}
