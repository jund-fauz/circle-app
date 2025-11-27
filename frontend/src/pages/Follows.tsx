import { Button } from '@/components/ui/button'
import { authRootSelector } from '@/config/redux/auth/selector'
import { unfollowSomeone, followSomeone } from '@/config/redux/profile/action'
import { profileRootSelector } from '@/config/redux/profile/selector'
import { CircleUser } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export function Follows() {
	const { token } = useSelector(authRootSelector)
	const { profile } = useSelector(profileRootSelector)
	const [selected, setSelected] = useState('followers')
	const [users, setUsers] = useState([])
	const dispatch = useDispatch()

	useEffect(() => {
		fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/follows?type=${selected}`, {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => res.json())
			.then((data) => data.status === 'success' && setUsers(data.data))
	}, [selected])

	return (
		<div className='py-8 px-4 flex flex-col gap-4 w-152'>
			<h1 className='text-gray-200 font-bold text-2xl text-start'>Follows</h1>
			<div className='border-b flex'>
				<Button
					className={`hover:cursor-pointer bg-(--primary-color) flex-1 rounded-none ${
						selected === 'followers' && 'border-b-green-600 border-b-2'
					}`}
					onClick={() => setSelected('followers')}
				>
					Followers
				</Button>
				<Button
					className={`hover:cursor-pointer bg-(--primary-color) flex-1 rounded-none ${
						selected === 'following' && 'border-b-green-600 border-b-2'
					}`}
					onClick={() => setSelected('following')}
				>
					Following
				</Button>
			</div>
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
						{profile.followings.some(
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
										.then((data) => {
											if (data.status === 'success') {
												dispatch(unfollowSomeone(data.data.user_id))
												if (selected === 'following')
													setUsers((prev) =>
														prev.filter(
															(user: any) => user.id !== data.data.user_id
														)
													)
											}
										})
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
						)}
					</div>
				))}
		</div>
	)
}
