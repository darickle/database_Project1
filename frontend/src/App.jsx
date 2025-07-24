import { useState } from 'react'
import Login from './components/Login'
import Register from './components/Register'
import MainApp from './MainApp'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true'
  })

  const [showRegister, setShowRegister] = useState(false)

  const handleLogin = () => {
    setIsLoggedIn(true)
    localStorage.setItem('isLoggedIn', 'true')
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    localStorage.removeItem('isLoggedIn')
  }

  const handleShowRegister = () => {
    setShowRegister(true)
  }

  const handleRegisterSuccess = () => {
    setShowRegister(false)
  }

  const handleCancelRegister = () => {
    setShowRegister(false)
  }

  if (isLoggedIn) {
    return <MainApp onLogout={handleLogout} />
  }

  if (showRegister) {
    return (
      <Register
        onRegisterSuccess={handleRegisterSuccess}
        onCancel={handleCancelRegister}
      />
    )
  }

  return <Login onLogin={handleLogin} onShowRegister={handleShowRegister} />
}

export default App
