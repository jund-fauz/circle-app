import { Button } from '@/components/ui/button'
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from '@/components/ui/input-group'
import { authRootSelector } from '@/config/redux/auth/selector'
import { unfollowSomeone, followSomeone } from '@/config/redux/profile/action'
import { profileRootSelector } from '@/config/redux/profile/selector'
import { useDebounce } from '@/lib/debounce'
import { CircleUser, CircleX, UserRoundSearch } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export function Search() {
	const { token } = useSelector(authRootSelector)
	const { profile } = useSelector(profileRootSelector)
	const [input, setInput] = useState('')
	const debouncedInput = useDebounce(input, 700)
	const [users, setUsers] = useState([])
	const dispatch = useDispatch()

	useEffect(() => {
		if (debouncedInput)
			fetch(
				`${
					import.meta.env.VITE_BASE_URL
				}/api/v1/search?keyword=${debouncedInput}`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			)
				.then((res) => res.json())
				.then((data) => setUsers(data.data.users))
	}, [debouncedInput])

	return (
		<div className='py-8 px-4 flex flex-col gap-4'>
			<InputGroup className='w-xl border-none rounded-3xl bg-(--secondary-color) mb-2'>
				<InputGroupInput
					type='text'
					placeholder='Search...'
					value={input}
					onChange={(e) => setInput(e.target.value)}
				/>
				<InputGroupAddon>
					<UserRoundSearch />
				</InputGroupAddon>
				{input && (
					<InputGroupAddon align='inline-end'>
						<CircleX
							className='hover:cursor-pointer'
							onClick={() => setInput('')}
						/>
					</InputGroupAddon>
				)}
			</InputGroup>
			{users &&
				users.map((user: any, index) => (
					<div className='flex items-center justify-between' key={index}>
						<div className='flex gap-2 items-center'>
							{user.photo_profile ? (
								<img
									className='rounded-full w-8 h-8'
									src={`${import.meta.env.VITE_BASE_URL}/uploads/${
										user.photo_profile
									}`}
									alt={user.full_name}
								/>
							) : (
								<CircleUser className='rounded-full w-8 h-8' />
							)}
							<div>
								<h1 className='font-bold'>{user.full_name}</h1>
								<p className='text-gray-500'>@{user.username}</p>
								<p>{user.bio}</p>
							</div>
						</div>
						{user.id !== profile.id &&
							(profile.followings.some(
								(following: any) => following.follower_id === user.id
							) ? (
								<Button
									className='w-fit bg-(--secondary-color) border rounded-4xl hover:cursor-pointer brightness-75'
									onClick={() =>
										fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/follows`, {
											headers: {
												Authorization: `Bearer ${token}`,
												'Content-Type': 'application/json',
											},
											method: 'DELETE',
											body: JSON.stringify({
												followed_user_id: user.id,
											}),
										})
											.then((res) => res.json())
											.then(
												(data) =>
													data.status === 'success' &&
													dispatch(unfollowSomeone(data.data.user_id))
											)
									}
								>
									Following
								</Button>
							) : (
								<Button
									className='w-fit bg-(--secondary-color) border rounded-4xl hover:cursor-pointer'
									onClick={() =>
										fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/follows`, {
											headers: {
												Authorization: `Bearer ${token}`,
												'Content-Type': 'application/json',
											},
											method: 'POST',
											body: JSON.stringify({
												followed_user_id: user.id,
											}),
										})
											.then((res) => res.json())
											.then(
												(data) =>
													data.status === 'success' &&
													dispatch(followSomeone(data.data.user_id))
											)
									}
								>
									Follow
								</Button>
							))}
					</div>
				))}
		</div>
	)
}
