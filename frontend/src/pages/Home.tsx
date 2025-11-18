import { ThreadCard } from '@/components/ThreadCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { authRootSelector } from '@/config/redux/auth/selector'
import {
	CircleUser,
	Heart,
	HomeIcon,
	ImagePlus,
	Search,
	User,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

export type Thread = {
	id: number
	content: string
	image: string
	number_of_replies: number
	created_at: string
	creator: {
		id: number
		username: string
		photo_profile: string
		full_name: string
	}
	_count: {
		likes: number
		replies: number
	}
	isLiked: boolean
}

export function Home() {
	const auth = useSelector(authRootSelector)
	const [threads, setThreads] = useState<Thread[]>([])

	useEffect(() => {
		fetch('http://localhost:3000/api/v1/thread?limit=30', {
			headers: { Authorization: `Bearer ${auth.token}` },
		})
			.then((res) => res.json())
			.then((data) => setThreads(data.threads))
	}, [])

	return (
		<div className='flex'>
			<div className='flex flex-col gap-4 border-r pe-4'>
				<img src='/logo.png' alt='Logo' />
				<Link className='flex gap-2' to='/home'>
					<HomeIcon /> Home
				</Link>
				<Link className='flex gap-2' to='/search'>
					<Search /> Search
				</Link>
				<Link className='flex gap-2' to='/follows'>
					<Heart /> Follows
				</Link>
				<Link className='flex gap-2' to='/profile'>
					<User /> Profile
				</Link>
				<Button className='bg-green-600 rounded-4xl w-52 hover:cursor-pointer hover:bg-green-900'>
					Create Post
				</Button>
			</div>
			<div className='ps-4 pe-12 flex flex-col gap-4 border-r'>
				<h1 className='text-gray-200 font-bold text-2xl text-start'>Home</h1>
				<div className='flex items-center gap-3'>
					<CircleUser className='hover:cursor-pointer' />
					<Input placeholder='What is happening?!' className='w-100 border-0' />
					<ImagePlus className='hover:cursor-pointer' />
					<Button
						className='bg-green-600 rounded-4xl hover:cursor-pointer hover:bg-green-900'
						disabled
					>
						Post
					</Button>
				</div>
				{threads &&
					threads.map((thread, index) => (
                        <ThreadCard
                            key={index}
							content={thread.content}
                            isLiked={thread.isLiked}
                            image={thread.image}
							likes={thread._count.likes}
							replies={thread._count.replies}
							userFullname={thread.creator.full_name}
							userProfile={thread.creator.photo_profile}
							userUsername={thread.creator.username}
						/>
					))}
			</div>
			<div></div>
		</div>
	)
}
