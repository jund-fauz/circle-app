import {
	ADD_PROFILE,
	DELETE_PROFILE,
	FOLLOW_SOMEONE,
	UNFOLLOW_SOMEONE,
	UPDATE_PROFILE,
} from './string'

export type Profile = {
	id: number
	username: string
	full_name: string
	bio: string
	_count: {
		followers: number
		followings: number
	}
	followings: Array<{
		follower_id: number
	}>
}

const profileInitialState: { profile: Profile | any } = {
	profile: {},
}

const initialState = {
	...profileInitialState,
	action: '',
}

export const profileReducer = (
	state: typeof initialState = initialState,
	action: { type: string; payload: any }
): typeof initialState => {
	const _actions = {
		[ADD_PROFILE as string]: () => ({
			...state,
			action: action.type,
			profile: action.payload,
		}),
		[UPDATE_PROFILE as string]: () => ({
			...state,
			action: action.type,
			profile: { ...state.profile, ...action.payload },
		}),
		[DELETE_PROFILE as string]: () => ({
			...state,
			action: action.type,
			profile: {},
		}),
		[FOLLOW_SOMEONE as string]: () => ({
			...state,
			action: action.type,
			profile: {
				...state.profile,
				_count: {
					...state.profile._count,
					followings: state.profile._count.followings + 1,
				},
				followings: [
					...state.profile.followings,
					{
						follower_id: action.payload,
					},
				],
			},
		}),
		[UNFOLLOW_SOMEONE as string]: () => ({
			...state,
			action: action.type,
			profile: {
				...state.profile,
				_count: {
					...state.profile._count,
					followings: state.profile._count.followings - 1,
				},
				followings: state.profile.followings.filter(
					(follower: any) => follower.follower_id !== action.payload
				),
			},
		}),
		DEFAULT: () => state,
	}
	return (_actions[action.type] || _actions.DEFAULT)()
}
