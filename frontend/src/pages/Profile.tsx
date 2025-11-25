import { ProfileEditDialog } from '@/components/ProfileEditDialog'
import { ThreadCard } from '@/components/ThreadCard'
import { Button } from '@/components/ui/button'
import { authRootSelector } from '@/config/redux/auth/selector'
import { profileRootSelector } from '@/config/redux/profile/selector'
import { Thread } from '@/types/Thread'
import { CircleUser, MoveLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

export function Profile() {
	const { profile } = useSelector(profileRootSelector)
	const { token } = useSelector(authRootSelector)
	const [selected, setSelected] = useState('posts')
	const [threads, setThreads] = useState<Thread[]>([])
	const [images, setImages] = useState([])
	const navigate = useNavigate()

	useEffect(() => {
		if (selected === 'posts')
			fetch('http://localhost:3000/api/v1/thread?limit=100&byUser=true', {
				headers: { Authorization: `Bearer ${token}` },
			})
				.then((res) => res.json())
				.then((data) => setThreads(data.threads))
		else
			fetch('http://localhost:3000/api/v1/thread/pictures', {
				headers: { Authorization: `Bearer ${token}` },
			})
				.then((res) => res.json())
				.then((data) => setImages(data.data))
	}, [selected])

	return (
		<div className='p-8 flex flex-col gap-4'>
			<div className='flex gap-2 text-gray-200 items-center'>
				<MoveLeft cursor='pointer' onClick={() => navigate('/home')} />
				<h1 className='font-bold text-2xl'>{profile.full_name}</h1>
			</div>
			<div className='w-138 bg-blue-500 h-36 rounded'></div>
			<div className='-mt-12 flex justify-between'>
				{profile.photo_profile ? (
					<img
						className='ms-4 rounded-full border-(--primary-color) border-2 w-15 h-15'
						src={`http://localhost:3000/uploads/${profile.photo_profile}`}
						alt={profile.full_name}
					/>
				) : (
					<CircleUser className='ms-4 bg-(--primary-color) rounded-full border-(--primary-color) border w-15 h-15' />
				)}
				<ProfileEditDialog />
			</div>
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
			<div className='border-b flex'>
				<Button
					className={`hover:cursor-pointer bg-(--primary-color) flex-1 rounded-none ${
						selected === 'posts' && 'border-b-green-600 border-b-2'
					}`}
					onClick={() => setSelected('posts')}
				>
					All Posts
				</Button>
				<Button
					className={`hover:cursor-pointer bg-(--primary-color) flex-1 rounded-none ${
						selected === 'media' && 'border-b-green-600 border-b-2'
					}`}
					onClick={() => setSelected('media')}
				>
					Media
				</Button>
			</div>
			{selected === 'posts'
				? threads &&
				  threads.map((thread, index) => (
						<ThreadCard key={index} thread={thread} />
				  ))
				: images && (
						<div className='grid grid-cols-3 gap-1'>
							{images.map((image: any, index) => (
								<Link to={`/thread/${image.id}`}>
									<img
										className='aspect-square rounded hover:cursor-pointer'
										src={
											image.image.startsWith('http')
												? image.image
												: `http://localhost:3000/uploads/${image.image}`
										}
										key={index}
									/>
								</Link>
							))}
						</div>
				  )}
		</div>
	)
}
