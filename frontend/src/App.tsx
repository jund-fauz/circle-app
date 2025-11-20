import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import { persistor, store } from './config/redux/store'
import { PrivateRoute } from './lib/PrivateRoute'
import { ScrollArea } from './components/ui/scroll-area'
import { Sidebar } from './components/Sidebar'
import { ThreadList } from './pages/ThreadList'
import { ThreadDetail } from './pages/ThreadDetail'

function App() {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<BrowserRouter>
					<div className='flex'>
						<Sidebar />
						<ScrollArea className='h-screen border-r'>
							<Routes>
								<Route path='/login' element={<Login />} />
								<Route path='/register' element={<Register />} />
								<Route
									path='/home'
									element={
										<PrivateRoute>
											<ThreadList />
										</PrivateRoute>
									}
								/>
								<Route
									path='/thread/:threadId'
									element={
										<PrivateRoute>
											<ThreadDetail />
										</PrivateRoute>
									}
								/>
							</Routes>
						</ScrollArea>
						<div></div>
					</div>
				</BrowserRouter>
			</PersistGate>
		</Provider>
	)
}

export default App
