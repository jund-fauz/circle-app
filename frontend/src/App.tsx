import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import { persistor, store } from './config/redux/store'
import { PrivateRoute } from './lib/PrivateRoute'
import { ThreadList } from './pages/ThreadList'
import { ThreadDetail } from './pages/ThreadDetail'
import { Home } from './pages/Home'
import { Follows } from './pages/Follows'
import { Profile } from './pages/Profile'
import { Search } from './pages/Search'

function App() {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<BrowserRouter>
					<Routes>
						<Route path='/login' element={<Login />} />
						<Route path='/register' element={<Register />} />
						<Route
							path='/'
							element={
								<PrivateRoute>
									<Home />
								</PrivateRoute>
							}
						>
							<Route path='home' element={<ThreadList />} />
							<Route path='search' element={<Search />} />
							<Route path='profile' element={<Profile />} />
							<Route path='follows' element={<Follows />} />
							<Route path='thread/:threadId' element={<ThreadDetail />} />
						</Route>
					</Routes>
				</BrowserRouter>
			</PersistGate>
		</Provider>
	)
}

export default App
