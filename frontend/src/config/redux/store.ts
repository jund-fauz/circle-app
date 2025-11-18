import {  Store } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer, Persistor } from 'redux-persist'
import { reducer } from './reducer'
import storage from 'redux-persist/lib/storage'

const persistedReducer = persistReducer({ key: 'root', storage }, reducer)
export const store: Store = configureStore({
	reducer: persistedReducer,
})
export const persistor: Persistor = persistStore(store)
