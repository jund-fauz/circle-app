import { CREATE_TOKEN, DELETE_TOKEN } from "./string"

const tokenInitialState = {
    token: ''
}

const initialState = {
    ...tokenInitialState,
    action: ''
}

export const authReducer = (state: any = initialState, action: {type: string, payload: string}) : any => {
    const _actions = {
        [CREATE_TOKEN as string]: () => ({ ...state, action: action.type, token: action.payload }),
        [DELETE_TOKEN as string]: () => ({ ...state, action: action.type, token: '' }),
        DEFAULT: () => state
    }
    return (_actions[action.type] || _actions.DEFAULT)()
}