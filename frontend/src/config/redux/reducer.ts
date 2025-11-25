import { combineReducers } from "redux"
import { authReducer } from "./auth/reducer"
import { likesReducer } from "./likes/reducer"
import { profileReducer } from "./profile/reducer"

export const reducer = combineReducers({
    auth: authReducer,
    likes: likesReducer,
    profile: profileReducer
})