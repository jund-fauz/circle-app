import { deleteToken } from '@/config/redux/auth/action'
import { authRootSelector } from '@/config/redux/auth/selector'
import { ReactNode } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

export function PrivateRoute({ children }: { children: ReactNode }) {
	const dispatch = useDispatch()
	const auth = useSelector(authRootSelector)
	if (!auth.token) return <Navigate to='/login' />
	const payloadBase64 = auth.token.split('.')[1]
	const decodedPayload = JSON.parse(atob(payloadBase64))
	if (Date.now() >= decodedPayload.exp * 1000) {
		dispatch(deleteToken())
		return <Navigate to='/login' />
	}
	return children
}
