import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import { persistor, store } from './config/redux/store'
import { Home } from './pages/Home'
import { PrivateRoute } from './lib/PrivateRoute'

function App() {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<BrowserRouter>
					<Routes>
						<Route path='/login' element={<Login />} />
						<Route path='/register' element={<Register />} />
						<Route
							path='/home'
							element={
								<PrivateRoute>
									<Home />
								</PrivateRoute>
							}
						/>
					</Routes>
				</BrowserRouter>
			</PersistGate>
		</Provider>
	)
}

export default App
