import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { connectSocket } from './socket/socket'
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
import { selectAuthChecked, selectCurrentUser, setChecked, setCredentials } from './features/auth/authSlice'
import OAuthSuccess from './features/auth/oauthSuccess'
import LoadingScreen from './components/LoadingScreen'
import ResetPassword from './components/ResetPassword'
import ForgotPassword from './components/ForgotPassword'
import Settings from './features/users/Settings'
import CreatePlaylist from './features/playlists/CreatePlaylist'
import MyPlaylists from './features/playlists/MyPlaylists'
import PlaylistDetail from './features/playlists/PlaylistDetail'
import EditPlaylist from './features/playlists/EditPlaylist'
import ReportSong from './features/report/ReportSong'
import NotificationList from './features/notifications/NotificationList'
import { initNotificationListener } from './features/notifications/notificationListener'
import { store } from './app/store'
import ReportUser from './features/report/ReportUser'
import FollowersList from './features/users/FollowersList'
import FollowingsList from './features/users/FollowingsList'
import { API_BASE_URL } from './config/constants'

const App = () => {
  useConversationSocket() // 🎯 アプリ起動したら常にsocket待機する！
  useGlobalMessageSocket()
  const dispatch = useDispatch()
  const checked = useSelector(selectAuthChecked)
  const location = useLocation()
  const background = location.state?.background
  const navigate = useNavigate()
  const currentUser = useSelector(selectCurrentUser)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          credentials: 'include'
        })
        const data = await res.json()
        if (data.user) {
          dispatch(setCredentials({ user: data.user }))
        } else {
          dispatch(setChecked(true))
        }
      } catch (err) {
        dispatch(setCredentials({ user: null, accessToken: null })) // 失敗しても checked=true にしたい
        console.error('No user logged in')
        dispatch(setChecked(true)) // ← ログインしてなくてもチェック完了
      }
    };
    fetchUser();
  }, []);  

useEffect(() => {
  if (currentUser) {
    connectSocket()
    initNotificationListener(dispatch)
  }
}, [currentUser, dispatch])


  if (!checked) return <LoadingScreen />

  const isModalPath = location.pathname.startsWith('/songs/modal/')

  const originalDispatch = store.dispatch;
  store.dispatch = (action) => {
    if (typeof action !== 'object' && typeof action !== 'function') {
      console.error('❌ dispatch に非オブジェクトが渡された:', action);
    }
    return originalDispatch(action);
  }



  return (
    <>
      <Routes>
        {/* 認証関連 */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* ログイン情報を保存したいページ */}
        <Route element={<PersistLogin />}>
          <Route element={<AppLayout />}>
            {/* 公開ページ */}
            <Route index element={<Dashboard />} />
            <Route path="/songs" element={<SongList />} />
            <Route path="/songs/modal/:id" element={
              isModalPath ? (
                <Modal>
                  <SongDetail modalMode onClose={() => navigate(-1)} />
                </Modal>
              ) : null
            } />
            <Route path="/songs/mining" element={<MiningPage />} />
            <Route path="/search-results" element={<SearchResults />} />
            <Route path="/users/:id" element={<UserPage />} />

            <Route element={<RequireAuth />}>
              <Route path="/admin-dash" element={<AdminDashboard />} />
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/mypage/:id" element={<EditProfile />} />
              <Route path="/settings" element={<Settings />} />

              <Route path="/upload" element={<UploadSong />} />
              <Route path="/songs/:id/edit" element={<EditSong />} />

              <Route path="/followers-list/:id" element={<FollowersList />} />
              <Route path="/followings-list/:id" element={<FollowingsList />} />
              <Route path="/play-history/:id" element={<PlayHistory />} />
              <Route path="/mining-history" element={<MiningHistory />} />
              <Route path="/messages/:id" element={<MessageLayout />} />
              <Route path="/playlists/create" element={<CreatePlaylist />} />
              <Route path="/playlists/mine" element={<MyPlaylists />} />
              <Route path="/playlists/:id" element={<PlaylistDetail />} />
              <Route path="/playlists/:id/edit" element={<EditPlaylist />} />
              <Route path="/report/song/:songId" element={<ReportSong />} />
              <Route path="/report/user/:userId" element={<ReportUser />} />
              <Route path="/notifications" element={<NotificationList />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App

