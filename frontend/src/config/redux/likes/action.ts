import { CREATE_LIKE, DELETE_LIKE, INITIATE_LIKE, REMOVE_LIKE } from './string'

export const initiateLike = (id: number, count: number, isLiked: boolean, reply: boolean) => ({
    type: INITIATE_LIKE,
    payload: { id, count, isLiked, reply },
})

export const createLike = (id: number, reply: boolean) => ({
	type: CREATE_LIKE,
	payload: { id, reply },
})

export const deleteLike = (id: number, reply: boolean) => ({
	type: DELETE_LIKE,
	payload: { id, reply },
})

export const removeLike = () => ({
	type: REMOVE_LIKE
})