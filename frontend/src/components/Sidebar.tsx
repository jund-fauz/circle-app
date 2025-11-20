import {
	CircleUser,
	CircleX,
	Heart,
	HomeIcon,
	ImagePlus,
	LogOut,
	Search,
	User,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { deleteToken } from '@/config/redux/auth/action'
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Input } from './ui/input'
import { useRef, useState } from 'react'
import { authRootSelector } from '@/config/redux/auth/selector'
import { io } from 'socket.io-client'
const socket = io('http://localhost:3000')

export function Sidebar() {
	const dispatch = useDispatch()
	const auth = useSelector(authRootSelector)
	const [post, setPost] = useState('')
	const [image, setImage] = useState<File | null>(null)
	const input = useRef<HTMLInputElement>(null)
	const [open, setOpen] = useState(false)

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
		fetch('http://localhost:3000/api/v1/thread', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${auth.token}`,
			},
			body: formData,
		})
		setPost('')
		setImage(null)
		setOpen(false)
	}

	return (
		<div className='flex flex-col border-r pe-4 pb-4 justify-between h-screen'>
			<div className='flex flex-col gap-4'>
				<img src='/logo.png' alt='Logo' />
				<Link className='flex gap-2' to='/home'>
					<HomeIcon fill='white' /> Home
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
				<AlertDialog open={open} onOpenChange={setOpen}>
					<AlertDialogTrigger asChild>
						<Button className='bg-green-600 rounded-4xl w-52 hover:cursor-pointer hover:bg-green-900'>
							Create Post
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent className='bg-(--primary-color)'>
						<div className='flex items-center gap-3 relative'>
							<CircleUser />
							<Input
								placeholder='What is happening?!'
								className='w-100 border-0'
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
								style={{ display: 'none' }}
								ref={input}
								onChange={(e) => setImage(e.target.files?.[0] || null)}
							/>
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
						<Button
							className='bg-green-600 rounded-4xl hover:cursor-pointer hover:bg-green-900'
							disabled={!post}
							onClick={sendPost}
						>
							Post
						</Button>
						<CircleX
							className='absolute top-0 right-0'
							cursor='pointer'
							onClick={() => setOpen(false)}
						/>
					</AlertDialogContent>
				</AlertDialog>
			</div>
			<Button
				variant='ghost'
				className='hover:cursor-pointer'
				onClick={() => dispatch(deleteToken())}
			>
				<LogOut /> Logout
			</Button>
		</div>
	)
}
