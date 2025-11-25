import { ADD_PROFILE, DELETE_PROFILE, UPDATE_PROFILE } from "./string"

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
