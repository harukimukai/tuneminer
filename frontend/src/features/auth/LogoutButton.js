import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useSendLogoutMutation } from './authApiSlice'
import { logOut } from './authSlice'

const LogoutButton = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [sendLogout, { isLoading }] = useSendLogoutMutation()

  const handleLogout = async () => {
    const confirm = window.confirm('Are you sure logging out?')
    if (!confirm) return
    try {
      await sendLogout().unwrap()
      dispatch(logOut())
      navigate('/')
    } catch (err) {
      console.error('ログアウト失敗:', err)
    }
  }

  return (
    <button onClick={handleLogout} disabled={isLoading} className="header-button">
      {isLoading ? 'Logging out...' : 'Logout'}
    </button>
  )
}

export default LogoutButton
