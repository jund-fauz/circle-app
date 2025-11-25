import { Profile } from '@/components/Profile'
import { Sidebar } from '@/components/Sidebar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Outlet } from 'react-router-dom'

export function Home() {
	return (
		<div className='flex'>
			<Sidebar />
			<ScrollArea className='h-screen border-r'>
				<Outlet />
			</ScrollArea>
			<Profile />
		</div>
	)
}
