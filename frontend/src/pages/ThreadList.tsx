import { CircleUser, CircleX, ImagePlus } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { ThreadCard } from '../components/ThreadCard'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { authRootSelector } from '@/config/redux/auth/selector'
import { useSelector } from 'react-redux'
import { Thread } from '@/types/Thread'
import { io } from 'socket.io-client'
import { toast } from 'sonner'
import { Toaster } from '../components/ui/sonner'
import { formatISO } from 'date-fns'
import { profileRootSelector } from '@/config/redux/profile/selector'
const socket = io(import.meta.env.VITE_BASE_URL)

export function ThreadList() {
	const { profile } = useSelector(profileRootSelector)
	const top = useRef<HTMLHeadingElement>(null)
	const input = useRef<HTMLInputElement>(null)
	const auth = useSelector(authRootSelector)
	const [threads, setThreads] = useState<Thread[]>([])
	const [post, setPost] = useState('')
	const [image, setImage] = useState<File | null>(null)

	const sendPost = () => {
		socket.emit('send_message', {
			content: post,
			token: auth.token,
			image,
		})
		const formData = new FormData()
		formData.append('content', post)
		if (image) {
			formData.append('image', image)
		}
		fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/thread`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${auth.token}`,
			},
			body: formData,
		})
		setPost('')
		setImage(null)
	}

	useEffect(() => {
		const handleReceiveMessage = (data: Object, token: string) => {
			if (token !== auth.token)
				toast('Ada Thread baru!', {
					action: {
						label: 'Lihat',
						onClick: () => {
							top.current?.scrollIntoView({ behavior: 'smooth' })
						},
					},
				})
			setThreads((prev) => [
				{
					...data,
					_count: {
						likes: 0,
						replies: 0,
					},
					isLiked: false,
					created_at: formatISO(new Date()),
				} as Thread,
				...prev,
			])
		}
		const handleNewReply = (data: Object) => {
			setThreads((prev) =>
				prev.map((thread) =>
					thread.id == (data as any).threadId
						? {
								...thread,
								_count: {
									...thread._count,
									replies: thread._count.replies + 1,
								},
						  }
						: thread
				)
			)
		}
		socket.on('receive_message', handleReceiveMessage)
		socket.on('receive_reply', handleNewReply)
		return () => {
			socket.off('receive_message', handleReceiveMessage)
			socket.off('receive_reply', handleNewReply)
		}
	}, [])

	useEffect(() => {
		fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/thread?limit=100`, {
			headers: { Authorization: `Bearer ${auth.token}` },
		})
			.then((res) => res.json())
			.then((data) => setThreads(data.threads))
	}, [])

	return (
		<div className='ps-4 pe-12 py-4 flex flex-col gap-4'>
			<Toaster position='bottom-center' />
			<h1 className='text-gray-200 font-bold text-2xl text-start' ref={top}>
				Home
			</h1>
			<div className='flex flex-col gap-4'>
				<div className='flex flex-col gap-4'>
					<div className='flex items-center gap-3'>
						{profile.photo_profile ? (
							<img
								src={`${import.meta.env.VITE_BASE_URL}/uploads/${
									profile.photo_profile
								}`}
								alt={profile.full_name}
								className='rounded w-10 h-10'
							/>
						) : (
							<CircleUser />
						)}
						<Input
							placeholder='What is happening?!'
							className='w-106 border-0'
							value={post}
							onChange={(e) => setPost(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter') sendPost()
							}}
						/>
						<ImagePlus
							cursor='pointer'
							onClick={() => input.current?.click()}
						/>
						<input
							type='file'
							accept='image/*'
							className='hidden'
							ref={input}
							onChange={(e) => setImage(e.target.files?.[0] || null)}
						/>
						<Button
							className='bg-green-600 rounded-4xl hover:cursor-pointer hover:bg-green-900'
							disabled={!post}
							onClick={sendPost}
						>
							Post
						</Button>
					</div>
					{image && (
						<div className='relative'>
							<img src={URL.createObjectURL(image)} />
							<CircleX
								className='absolute top-0 right-0'
								cursor='pointer'
								onClick={() => setImage(null)}
							/>
						</div>
					)}
				</div>
				<div className='flex flex-col gap-4'>
					{threads &&
						threads.map((thread, index) => (
							<ThreadCard key={index} thread={thread} />
						))}
				</div>
			</div>
		</div>
	)
}
