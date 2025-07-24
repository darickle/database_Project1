import { useState } from 'react'
import { loginCustomer } from '../services/api'
import './Login.css'

function Login({ onLogin, onShowRegister }) {
  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const response = await loginCustomer({ emailAddress, password })
      // Store customer data in localStorage
      localStorage.setItem('customer', JSON.stringify(response.customer))
      onLogin(response.customer)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <h1>BookNest</h1>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <label>
          Email:
          <input
            type="email"
            value={emailAddress}
            onChange={e => setEmailAddress(e.target.value)}
            required
            autoComplete="email"
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </label>
        {error && <p className="error-msg">{error}</p>}

        <div style={{ marginTop: '10px' }}>
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
          <button
            type="button"
            onClick={onShowRegister}
            style={{ marginLeft: '10px' }}
            disabled={loading}
          >
            Register
          </button>
        </div>
      </form>
    </div>
  )
}

export default Login
