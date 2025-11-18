import { authRootSelector } from '@/config/redux/auth/selector'
import { ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

export function PrivateRoute({ children }: { children: ReactNode }) {
    const auth = useSelector(authRootSelector)
    if (!auth.token) return <Navigate to='/login' />
    return children
}
