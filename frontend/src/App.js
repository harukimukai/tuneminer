import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { connectSocket } from './features/messages/socketSlice'
import './index.css'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import Login from './features/auth/Login'
import PersistLogin from './features/auth/PersistLogin'
import RequireAuth from './features/auth/RequireAuth'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home' // 任意
import Register from './features/auth/Register'
import UploadSong from './features/songs/UploadSong'
import MyPage from './features/users/MyPage'
import EditSong from './features/songs/EditSong'
import UserPage from './features/users/UserPage'
import EditProfile from './features/users/EditProfile'
import SearchResults from './features/songs/SearchResults'
import AppLayout from './Layout/AppLayout'
import PlayHistory from './features/users/PlayHistory'
import MiningPage from './features/mining/MiningPage'
import MiningHistory from './features/mining/MiningHistory'
import MessageLayout from './features/messages/MessageLayout'
import useConversationSocket from './features/messages/useConversationSocket'
import useGlobalMessageSocket from './features/messages/useGlobalMessageSocket'
import AdminDashboard from './pages/AdminDashboard'
import SongList from './components/SongList'
import Modal from './components/Modal'
import SongDetail from './components/SongDetail'
import { setCredentials } from './features/auth/authSlice'

const App = () => {
  useConversationSocket() // 🎯 アプリ起動したら常にsocket待機する！
  useGlobalMessageSocket()
  const dispatch = useDispatch()
  const location = useLocation()
  const background = location.state?.background
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:3500/auth/me', {
          credentials: 'include'
        })
        const data = await res.json()
        dispatch(setCredentials({ user: data.user})) // Reduxに保存
      } catch (err) {
        console.error('No user logged in')
      }
    };
    fetchUser();
  }, []);  

  useEffect(() => {
    dispatch(connectSocket())
  }, [dispatch])

  const isModalPath = location.pathname.startsWith('/songs/modal/')

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />             {/* 任意 */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth />}>
              <Route element={<AppLayout />}>
                <Route path="/dash" element={<Dashboard />} />
                <Route path="/admin-dash" element={<AdminDashboard />} />
                <Route path="/mypage" element={<MyPage />} />
                <Route path="/mypage/:id" element={<EditProfile />} />
                <Route path="/users/:id" element={<UserPage />} />
                <Route path="/upload" element={<UploadSong />} />
                <Route path='/songs' element={<SongList />} />
                <Route path="/songs/modal/:id" 
                  element={
                    isModalPath ? (
                      <Modal>
                        <SongDetail modalMode onClose={() => navigate(-1)} />
                      </Modal>
                    ) : null
                  } 
                />
                <Route path="/songs/:id/edit" element={<EditSong />} />
                <Route path="/search-results" element={<SearchResults />} />
                <Route path="/play-history/:id" element={<PlayHistory />} />
                <Route path="/songs/mining" element={<MiningPage />} />
                <Route path="/mining-history" element={<MiningHistory />} />
                <Route path="/messages/:id" element={<MessageLayout />} />
              </Route>
            </Route>
          </Route>

      </Routes>
    </>
  )
}

export default App

