import { CREATE_LIKE, DELETE_LIKE, INITIATE_LIKE, REMOVE_LIKE } from './string'

export interface Like {
	count: number
	id: number
	isLiked: boolean
	reply: boolean
	[key: string]: any
}

const likeInitialState: { likes: Like[] } = {
	likes: [],
}

const initialState: { likes: Like[]; action: string } = {
	...likeInitialState,
	action: '',
}

export const likesReducer = (
	state: typeof initialState = initialState,
	action: { type: string; payload: any }
): typeof initialState => {
	const _actions = {
		[INITIATE_LIKE as string]: () => ({
			...state,
			likes: state.likes.some(
				(like: Like) =>
					like.id === action.payload.id &&
					like.reply === action.payload.reply &&
					like.count === action.payload.count
			)
				? state.likes
				: state.likes.some(
						(like: Like) =>
							like.id === action.payload.id &&
							like.reply === action.payload.reply &&
							like.count !== action.payload.count
				  )
				? state.likes.map((like: Like) =>
						like.id === action.payload.id && like.reply === action.payload.reply
							? {
									...like,
									count: action.payload.count,
									isLiked: action.payload.isLiked,
							  }
							: like
				  )
				: [action.payload, ...state.likes],
		}),
		[CREATE_LIKE as string]: () => ({
			...state,
			action: action.type,
			likes: state.likes.map((like: Like) =>
				like.id === action.payload.id && like.reply === action.payload.reply
					? { ...like, isLiked: true, count: like.count + 1 }
					: like
					? like
					: {
							id: action.payload.id,
							count: 1,
							isLiked: true,
							reply: action.payload.reply,
					  }
			),
		}),
		[DELETE_LIKE as string]: () => ({
			...state,
			action: action.type,
			likes: state.likes.map((like: Like) =>
				like.id === action.payload.id && like.reply === action.payload.reply
					? { ...like, isLiked: false, count: like.count - 1 }
					: like
			),
		}),
		[REMOVE_LIKE as string]: () => ({
			...state,
			action: action.type,
			likes: []
		}),
		DEFAULT: () => state,
	}
	return (_actions[action.type] || _actions.DEFAULT)()
}
