import { CircleUser, Heart, MessageSquare } from 'lucide-react'

export function ThreadCard({
	userProfile,
	userFullname,
	userUsername,
	content,
	likes,
	replies,
	isLiked,
    image
}: {
	userProfile: string
	userFullname: string
	userUsername: string
	content: string
	likes: number
	replies: number
	isLiked: boolean
    image: string
}) {
	return (
		<div className='flex border-b gap-2 pb-4'>
			{userProfile ? <img src={userProfile} alt={userFullname} className='rounded' /> : <CircleUser />}
			<div className='flex flex-col gap-1'>
				<div className='flex gap-1'>
					<h1>{userFullname}</h1>
					<p className='text-gray-500'>@{userUsername}</p>
				</div>
				<p className='text-left'>{content}</p>
				<div className='flex gap-2 mt-2'>
					<Heart className={`hover:cursor-pointer ${isLiked && 'text-red-600'}`} {...(isLiked && { fill: 'red' })} />
                    <p>{likes}</p>
                    <MessageSquare className='ms-4 hover:cursor-pointer' />
                    <p>{replies} Replies</p>
                </div>
                {image && <img src={image} />}
			</div>
		</div>
	)
}
