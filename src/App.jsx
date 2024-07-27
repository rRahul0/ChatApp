const BASE_URL = import.meta.env.VITE_BACKEND_URL
import { Routes, Route, Navigate } from 'react-router-dom'

import Chat from './pages/Chat'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Signup from './pages/Signup'
import io from 'socket.io-client'
import { useSelector } from 'react-redux'

import OpenRoute from './route/OpenRoute'
import PrivateRoute from './route/PrivateRoute'
import { useEffect } from 'react'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<OpenRoute><Login /></OpenRoute>} />
      <Route path="/signup" element={<OpenRoute><Signup /></OpenRoute>} />

      <Route path="/" element={<PrivateRoute><Chat /></PrivateRoute>} />
      {/* <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} /> */}
      <Route path="*" element={<Navigate to='/login' />} />
    </Routes>
  )
}

export default App