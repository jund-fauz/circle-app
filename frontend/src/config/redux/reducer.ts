import { combineReducers } from "redux"
import { authReducer } from "./auth/reducer"

export const reducer = combineReducers({
    auth: authReducer
})