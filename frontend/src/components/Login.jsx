import { useState } from 'react'
import './Login.css'

function Login({ onLogin, onShowRegister }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    if (username === 'user' && password === 'pass') {
      setError('')
      onLogin()
    } else {
      setError('Invalid username or password')
    }
  }

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            autoComplete="username"
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
          <button type="submit">Log In</button>
          <button
            type="button"
            onClick={onShowRegister}
            style={{ marginLeft: '10px' }}
          >
            Register
          </button>
        </div>
      </form>
    </div>
  )
}

export default Login
