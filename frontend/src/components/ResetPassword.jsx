import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useResetPasswordMutation } from '../features/auth/authApiSlice'

const ResetPassword = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [resetPassword] = useResetPasswordMutation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!password || !confirmPassword) {
      setError('Type your new password');
      return;
    }

    if (password !== confirmPassword) {
      setError('Password unmatch');
      return;
    }

      try {
      await resetPassword({ token, password }).unwrap()
      alert("Your password has changed")
      navigate('/login')
    } catch (err) {
      if (err?.status === 400) {
        setError('This link is invalid or expired');
      } else {
        setError('Server error occured');
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Reset Password</h2>
      <input
        type="password"
        placeholder="Enter new password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ color: 'grey'}}
      />
      <input
        type="password"
        placeholder="Enter once more"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
        style={{ color: 'grey'}}
      />
      <button type="submit">Reset</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>{message}</p>
    </form>
  )
}

export default ResetPassword
