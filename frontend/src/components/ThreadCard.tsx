import { authRootSelector } from '@/config/redux/auth/selector'
import {
	createLike,
	deleteLike,
	initiateLike,
} from '@/config/redux/likes/action'
import { Like } from '@/config/redux/likes/reducer'
import { likesRootSelector } from '@/config/redux/likes/selector'
import { Thread } from '@/types/Thread'
import { CircleUser, Heart, MessageSquare } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

export function ThreadCard({
	thread,
	border = true,
	borderTop = false,
	toReply = true,
	reply = false,
}: {
	thread: Thread
	border?: boolean
	borderTop?: boolean
	toReply?: boolean
	reply?: boolean
}) {
	const dispatch = useDispatch()
	const auth = useSelector(authRootSelector)
	const { likes } = useSelector(likesRootSelector)
	let sinceHour = Math.floor(
		Date.now() / 3600000 - new Date(thread.created_at).getTime() / 3600000
	)
	let sinceDate = 0
	if (sinceHour > 23) {
		sinceDate = Math.floor(sinceHour / 24)
		sinceHour -= sinceDate * 24
	}
	const [isLiked, setIsLiked] = useState(
		likes.find((like: Like) => like.id === thread.id && like.reply === reply)
			?.isLiked || thread.isLiked
	)
	const [likesState, setLikesState] = useState(
		likes.find((like: Like) => like.id === thread.id && like.reply === reply)
			?.count || thread._count.likes
	)

	const likeThread = () => {
		dispatch(
			isLiked ? deleteLike(thread.id, reply) : createLike(thread.id, reply)
		)
		setIsLiked((prev: boolean) => !prev)
		setLikesState((prev: number) => (isLiked ? prev - 1 : prev + 1))
		fetch(
			`${import.meta.env.VITE_BASE_URL}/api/v1/${
				!reply ? 'like' : 'reply/like'
			}`,
			{
				method: isLiked ? 'DELETE' : 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${auth.token}`,
				},
				body: JSON.stringify(
					!reply ? { tweet_id: thread.id } : { reply_id: thread.id }
				),
			}
		)
	}

	useEffect(() => {
		if (thread._count.likes > 0)
			dispatch(
				initiateLike(thread.id, thread._count.likes, thread.isLiked, reply)
			)
	}, [])

	return (
		<div
			className={`flex gap-2 pb-4${border ? ' border-b' : ''}${
				borderTop ? ' border-t pt-4' : ''
			}`}
		>
			{thread.creator.photo_profile ? (
				<img
					src={`${import.meta.env.VITE_BASE_URL}/uploads/${
						thread.creator.photo_profile
					}`}
					alt={thread.creator.full_name}
					className='rounded w-5 h-5'
				/>
			) : (
				<CircleUser />
			)}
			<div className='flex flex-col gap-1'>
				<div className='flex gap-1'>
					<h1>{thread.creator.full_name}</h1>
					<p className='text-gray-500'>
						@{thread.creator.username} • {sinceDate > 0 && `${sinceDate}d`}{' '}
						{sinceHour >= 0 ? sinceHour : 0}h
					</p>
				</div>
				<p>{thread.content}</p>
				<div className='flex gap-2 mt-2'>
					<Heart
						cursor='pointer'
						{...(isLiked && { fill: 'red', className: 'text-red-600' })}
						onClick={likeThread}
					/>
					<p>{likesState}</p>
					{toReply ? (
						<Link className='hover:cursor-pointer' to={`/thread/${thread.id}`}>
							<MessageSquare className='ms-4' />
						</Link>
					) : (
						<MessageSquare className='ms-4' />
					)}
					<p>{thread._count.replies || 0} Replies</p>
				</div>
				{thread.image && (
					<img
						src={
							/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/.test(
								thread.image
							)
								? `data:image/jpeg;base64,${thread.image}`
								: thread.image.startsWith('http')
								? thread.image
								: `${import.meta.env.VITE_BASE_URL}/uploads/${thread.image}`
						}
						className='max-w-100 mt-2 rounded'
					/>
				)}
			</div>
		</div>
	)
}
