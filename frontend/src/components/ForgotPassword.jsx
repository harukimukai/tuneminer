import { useState } from 'react'
import { API_BASE_URL } from '../config/constants'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      if (res.ok) {
        setMessage(data.message)
      } else {
        setError(data.message || 'Failed to send')
      }
    } catch (err) {
      setError('An error occured')
    }
  }

  return (
    <div className="form-container">
      <h2>Send an email to reset your password</h2>
      <form onSubmit={handleSubmit}>
        <label>Your email address:</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}

export default ForgotPassword
