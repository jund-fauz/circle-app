import { authRootSelector } from '@/config/redux/auth/selector'
import {
	addProfile,
	followSomeone,
	unfollowSomeone,
} from '@/config/redux/profile/action'
import { profileRootSelector } from '@/config/redux/profile/selector'
import { CircleUser } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from './ui/button'
import { useLocation } from 'react-router-dom'
import { ProfileEditDialog } from './ProfileEditDialog'

export function Profile() {
	const { pathname } = useLocation()
	const { profile } = useSelector(profileRootSelector)
	const { token } = useSelector(authRootSelector)
	const [suggested, setSuggested] = useState([])
	const dispatch = useDispatch()

	useEffect(() => {
		if (Object.keys(profile).length === 0)
			fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/profile`, {
				headers: { Authorization: `Bearer ${token}` },
			})
				.then((res) => res.json())
				.then((data) => dispatch(addProfile(data.data)))
		fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/profiles`, {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => res.json())
			.then((data) => setSuggested(data.data))
	}, [])

	return (
		<div className='flex flex-col items-center w-full p-8 gap-4'>
			{pathname !== '/profile' && (
				<div className='bg-(--secondary-color) rounded-2xl p-4 flex flex-col gap-2'>
					<h1 className='font-bold'>My Profile</h1>
					<div className='w-92 bg-blue-500 h-16 rounded'></div>
					{profile.photo_profile ? (
						<img
							className='absolute top-31 ms-2 rounded-full border-(--primary-color) border-2 w-10 h-10'
							src={`${import.meta.env.VITE_BASE_URL}/uploads/${
								profile.photo_profile
							}`}
							alt={profile.full_name}
						/>
					) : (
						<CircleUser className='absolute top-31 ms-2 bg-(--primary-color) rounded-full border-(--primary-color) border w-10 h-10' />
					)}
					<ProfileEditDialog />
					{Object.keys(profile).length !== 0 && (
						<div>
							<h1 className='font-bold text-xl'>{profile.full_name}</h1>
							<p className='text-gray-500'>@{profile.username}</p>
							<p>{profile.bio}</p>
							<div className='flex gap-1'>
								<p>{profile._count.followings}</p>
								<p className='text-gray-500'>Following</p>
								<p className='ms-1'>{profile._count.followers}</p>
								<p className='text-gray-500'>Followers</p>
							</div>
						</div>
					)}
				</div>
			)}
			<div className='bg-(--secondary-color) rounded-2xl p-4 flex flex-col gap-2'>
				<h1 className='font-bold'>Suggested for you</h1>
				{suggested &&
					suggested.map((user: any, index) => (
						<div className='flex w-92 items-center justify-between' key={index}>
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
								</div>
							</div>
							{Object.keys(profile).length !== 0 &&
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
		</div>
	)
}
