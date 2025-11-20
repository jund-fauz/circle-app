import { Thread } from '@/types/Thread'
import { CircleUser, Heart, MessageSquare } from 'lucide-react'
import { Link } from 'react-router-dom'

export function ThreadCard({
	thread,
	border = true,
	borderTop = false,
	toReply = true,
}: {
	thread: Thread
	border?: boolean
	borderTop?: boolean
	toReply?: boolean
}) {
	let sinceHour = Math.floor(
		Date.now() / 3600000 - new Date(thread.created_at).getTime() / 3600000
	)
	let sinceDate = 0
	if (sinceHour > 23) {
		sinceDate = Math.floor(sinceHour / 24)
		sinceHour -= sinceDate * 24
	}
	return (
		<div
			className={`flex gap-2 pb-4${border ? ' border-b' : ''}${
				borderTop ? ' border-t pt-4' : ''
			}`}
		>
			{thread.creator.photo_profile ? (
				<img
					src={thread.creator.photo_profile}
					alt={thread.creator.full_name}
					className='rounded'
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
						className={thread.isLiked ? 'text-red-600' : ''}
						cursor='pointer'
						{...(thread.isLiked && { fill: 'red' })}
					/>
					<p>{thread._count.likes}</p>
					{toReply ? (
						<Link className='hover:cursor-pointer' to={`/thread/${thread.id}`}>
							<MessageSquare className='ms-4' />
						</Link>
					) : (
						<MessageSquare className='ms-4' />
					)}
					<p>
						{thread._count.replies || 0}{' '}
						Replies
					</p>
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
								: `http://localhost:3000/uploads/${thread.image}`
						}
						className='max-w-100 mt-2 rounded'
					/>
				)}
			</div>
		</div>
	)
}
