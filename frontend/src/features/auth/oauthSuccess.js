import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setCredentials } from './authSlice'
import { API_BASE_URL } from '../../config/constants'

const OAuthSuccess = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const accessToken = urlParams.get('accessToken')

    if (accessToken) {
      // ユーザー情報取得（/auth/me 相当）
      fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
        .then(res => res.json())
        .then(data => {
          dispatch(setCredentials({
            accessToken,
            user: data.user
          }))
          navigate('/')
        })
        .catch(err => {
          console.error('OAuth token error:', err)
          navigate('/login')
        })
    } else {
      navigate('/login')
    }
  }, [dispatch, navigate])

  return <p>Logging in via Google...</p>
}

export default OAuthSuccess