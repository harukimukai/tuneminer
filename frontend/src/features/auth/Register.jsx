import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useRegisterMutation } from './authApiSlice'
import '../../css/login.css'

const Register = () => {
  const navigate = useNavigate()
  const [register, { isLoading }] = useRegisterMutation()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [pwd, setPwd] = useState('')
  const [errorMsg, setErrorMsg] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await register({ username, email, pwd: pwd }).unwrap()
      navigate('/login') // 登録後にログインページへ
    } catch (err) {
      console.error('Register error:', err)
      setErrorMsg(err?.data?.message || 'Registration failed')
    }
  }

  return (
    <section className='login-container'>
      <h2 id='login'>Register</h2>
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
          <label htmlFor="email" className='email'>Email:</label><br />
          <input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
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
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <div className="auth-links">
        {/* <button onClick={handleGoogleLogin}>Sign in with Google</button> */}
        <Link to='/'>Home</Link><br />
        <Link to='/login'>Login</Link>
      </div>
    </section>
  )
}

export default Register
