import {
	ADD_PROFILE,
	DELETE_PROFILE,
	FOLLOW_SOMEONE,
	UNFOLLOW_SOMEONE,
	UPDATE_PROFILE,
} from './string'

export const addProfile = (profile: Object) => ({
	type: ADD_PROFILE,
	payload: profile,
})

export const updateProfile = (profile: Object) => ({
	type: UPDATE_PROFILE,
	payload: profile,
})

export const deleteProfile = () => ({
	type: DELETE_PROFILE,
})

export const followSomeone = (following: number) => ({
	type: FOLLOW_SOMEONE,
	payload: following,
})

export const unfollowSomeone = (following: number) => ({
	type: UNFOLLOW_SOMEONE,
	payload: following,
})
