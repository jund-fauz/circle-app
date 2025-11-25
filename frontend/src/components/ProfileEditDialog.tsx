import { updateProfile } from '@/config/redux/profile/action'
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogTitle,
	DialogClose,
} from './ui/dialog'
import { Label } from './ui/label'
import { CircleUser, ImagePlus } from 'lucide-react'
import { Button } from './ui/button'
import { DialogHeader, DialogFooter } from './ui/dialog'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { profileRootSelector } from '@/config/redux/profile/selector'
import { authRootSelector } from '@/config/redux/auth/selector'

export function ProfileEditDialog() {
	const { profile } = useSelector(profileRootSelector)
	const { token } = useSelector(authRootSelector)
	const dispatch = useDispatch()
	const input = useRef<HTMLInputElement>(null)
	const [image, setImage] = useState<File | null>(null)
	const [fullName, setFullName] = useState(profile.full_name)
	const [userName, setUserName] = useState(profile.username)
	const [bio, setBio] = useState(profile.bio)
	const [open, setOpen] = useState(false)

	return (
		<Dialog
			onOpenChange={(state) => {
				if (state) {
					setFullName(profile.full_name)
					setUserName(profile.username)
					setBio(profile.bio)
				}
				setOpen(state)
			}}
			open={open}
		>
			<DialogTrigger asChild>
				<Button className='w-fit self-end bg-(--secondary-color) border rounded-4xl hover:cursor-pointer'>
					Edit Profile
				</Button>
			</DialogTrigger>
			<DialogContent className='bg-(--primary-color)'>
				<DialogHeader>
					<DialogTitle>Edit Profile</DialogTitle>
				</DialogHeader>
				<div className='w-115 bg-blue-500 h-36 rounded'></div>
				{profile.photo_profile || image ? (
					<img
						className='absolute top-40 left-10 rounded-full border-(--primary-color) border-2 w-20 h-20'
						src={
							image
								? URL.createObjectURL(image)
								: `http://localhost:3000/uploads/${profile.photo_profile}`
						}
						alt={profile.full_name}
					/>
				) : (
					<CircleUser className='absolute top-40 left-10 bg-(--primary-color) rounded-full border-(--primary-color) border w-20 h-20' />
				)}
				<div
					className='absolute top-45 left-15 bg-(--primary-color) border-8 rounded-full border-(--primary-color) hover:cursor-pointer'
					onClick={() => input.current?.click()}
				>
					<ImagePlus />
				</div>
				<form
					className='mt-8 flex flex-col gap-2'
					onSubmit={(e) => {
						e.preventDefault()
						const formData = new FormData()
						if (userName !== profile.user_name)
							formData.append('username', userName)
						if (fullName !== profile.full_name)
							formData.append('full_name', fullName)
						if (bio !== profile.bio) formData.append('bio', bio)
						if (image) formData.append('image', image)
						if (!formData.entries().next().done)
							fetch('http://localhost:3000/api/v1/profile', {
								method: 'PUT',
								headers: { Authorization: `Bearer ${token}` },
								body: formData,
							})
								.then((res) => res.json())
								.then((data) => dispatch(updateProfile(data.data)))
						setOpen(false)
					}}
				>
					<input
						type='file'
						accept='image/*'
						className='hidden'
						ref={input}
						onChange={(e) => setImage(e.target.files?.[0] || null)}
					/>
					<div className='flex flex-col gap-2'>
						<Label htmlFor='name'>Name</Label>
						<Input
							id='name'
							placeholder='Full Name'
							value={fullName}
							onChange={(e) => setFullName(e.target.value)}
						/>
					</div>
					<div className='flex flex-col gap-2'>
						<Label htmlFor='username'>Username</Label>
						<Input
							id='username'
							placeholder='Username'
							value={`@${userName}`}
							onChange={(e) => setUserName(e.target.value.substring(1))}
						/>
					</div>
					<div className='flex flex-col gap-2'>
						<Label htmlFor='bio'>Bio</Label>
						<Textarea
							id='bio'
							placeholder='Bio'
							value={bio}
							onChange={(e) => setBio(e.target.value)}
						/>
					</div>
					<DialogFooter className='mt-1'>
						<DialogClose asChild>
							<Button className='hover:cursor-pointer' variant='secondary'>
								Close
							</Button>
						</DialogClose>
						<Button className='hover:cursor-pointer' type='submit'>
							Submit
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
