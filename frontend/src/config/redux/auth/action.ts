import { CREATE_TOKEN, DELETE_TOKEN } from './string'

export const createToken = (token: string) => ({
	type: CREATE_TOKEN,
	payload: { token },
})

export const deleteToken = () => ({ type: DELETE_TOKEN })
