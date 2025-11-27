import { ThreadCard } from '@/components/ThreadCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Toaster } from '@/components/ui/sonner'
import { authRootSelector } from '@/config/redux/auth/selector'
import { Thread } from '@/types/Thread'
import { formatISO } from 'date-fns'
import { CircleUser, ImagePlus, CircleX, MoveLeft } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import { toast } from 'sonner'
const socket = io(import.meta.env.VITE_BASE_URL)

export function ThreadDetail() {
	const top = useRef<HTMLHeadingElement>(null)
	const { threadId } = useParams()
	const [thread, setThread] = useState<Thread>({} as Thread)
	const [replies, setReplies] = useState<Thread[]>([])
	const auth = useSelector(authRootSelector)
	const [post, setPost] = useState('')
	const [image, setImage] = useState<File | null>(null)
	const input = useRef<HTMLInputElement>(null)

	const sendPost = () => {
		socket.emit('send_reply', {
			content: post,
			token: auth.token,
			image,
			threadId,
		})
		const formData = new FormData()
		formData.append('content', post)
		if (image) {
			formData.append('image', image)
		}
		fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/reply/${threadId}`, {
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
			if ((data as any).threadId != threadId) return
			if (token !== auth.token)
				toast('Ada Reply baru!', {
					action: {
						label: 'Lihat',
						onClick: () => {
							top.current?.scrollIntoView({ behavior: 'smooth' })
						},
					},
				})
			setReplies((prev) => [
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
			setThread((prev) => ({
				...prev,
				_count: { ...prev._count, replies: prev._count.replies + 1 },
			}))
		}
		socket.on('receive_reply', handleReceiveMessage)
		return () => {
			socket.off('receive_reply', handleReceiveMessage)
		}
	}, [])

	useEffect(() => {
		fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/thread/${threadId}`, {
			headers: {
				Authorization: `Bearer ${auth.token}`,
			},
		})
			.then((res) => res.json())
			.then((data) => setThread(data.data))
		fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/reply/${threadId}/`, {
			headers: {
				Authorization: `Bearer ${auth.token}`,
			},
		})
			.then((res) => res.json())
			.then((data) => setReplies(data.data.replies))
	}, [])

	return (
		<div className='ps-4 pe-10 py-8 flex flex-col gap-4'>
			<Toaster position='bottom-center' />
			<div className='flex gap-2 text-gray-200 items-center'>
				<MoveLeft cursor='pointer' onClick={() => window.history.back()} />
				<h1 className='font-bold text-2xl' ref={top}>
					Status
				</h1>
			</div>
			{Object.keys(thread).length > 0 && (
				<ThreadCard thread={thread} border={false} toReply={false} />
			)}
			<div className='flex flex-col gap-4'>
				<div className='flex items-center gap-3'>
					<CircleUser />
					<Input
						placeholder='Type your reply!'
						className='w-100 border-0'
						value={post}
						onChange={(e) => setPost(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter') sendPost()
						}}
					/>
					<ImagePlus cursor='pointer' onClick={() => input.current?.click()} />
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
						Reply
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
				{replies.length > 0 &&
					replies.map((reply, index) => (
						<ThreadCard
							key={index}
							thread={reply}
							borderTop={index === 0}
							toReply={false}
							reply={true}
						/>
					))}
			</div>
		</div>
	)
}
