import { ADD_PROFILE, DELETE_PROFILE, UPDATE_PROFILE } from "./string";

const profileInitialState = {
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
			profile: { ...state.profile, ...action.payload }
		}),
		[DELETE_PROFILE as string]: () => ({
			...state,
			action: action.type,
			profile: {},
		}),
		DEFAULT: () => state,
	}
	return (_actions[action.type] || _actions.DEFAULT)()
}
