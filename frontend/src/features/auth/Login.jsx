import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useLoginMutation } from './authApiSlice'
import { useDispatch } from 'react-redux'
import { setCredentials } from './authSlice'
import usePersist from '../../hooks/usePersist'
import '../../css/login.css'
import { API_BASE_URL } from '../../config/constants'

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [persist, setPersist] = usePersist()

  const [username, setUsername] = useState('')
  const [pwd, setPwd] = useState('')

  const [login, { isLoading }] = useLoginMutation()
  const [errorMsg, setErrorMsg] = useState(null)

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/google`
  };  

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const userData = await login({ username, pwd }).unwrap()

      dispatch(setCredentials(userData)) // accessToken を保存

      setUsername('')
      setPwd('')
      setPersist(true)
      navigate('/') // ← ログイン後に遷移したいページへ
    } catch (err) {
      console.error('Login failed:', err)
      setErrorMsg(err?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="login-container">
      <h2 id='login'>Login</h2>
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
      <form onSubmit={handleSubmit} className='login-form'>
        <div>
          <label htmlFor="username" className='username'>Username:</label><br />
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password:</label><br />
          <input
            id="pwd"
            type="pwd"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            autoComplete="current-pwd"
            required
          />
        </div>

        <div>
          <button>
            <Link to='/forgot-password'>
              <p style={{ fontSize: '12px'}}>Forgot your password?</p>
            </Link>
          </button>
        </div>

        <button type="submit" disabled={isLoading} id='login-button'>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <div className="auth-links">
        <button onClick={handleGoogleLogin}>Sign in with Google</button><br />
        <Link to='/register'>Register</Link><br />
        <Link to='/'>Home</Link>
      </div>
    </div>
  )
}

export default Login
