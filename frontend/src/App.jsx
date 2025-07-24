import { useState } from 'react'
import Login from './components/Login'
import Register from './components/Register'
import MainApp from './MainApp'

function App() {
  const [customer, setCustomer] = useState(() => {
    const savedCustomer = localStorage.getItem('customer')
    return savedCustomer ? JSON.parse(savedCustomer) : null
  })

  const [showRegister, setShowRegister] = useState(false)

  const handleLogin = (customerData) => {
    setCustomer(customerData)
    localStorage.setItem('customer', JSON.stringify(customerData))
    localStorage.setItem('isLoggedIn', 'true')
  }

  const handleLogout = () => {
    setCustomer(null)
    localStorage.removeItem('customer')
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

  if (customer) {
    return <MainApp customer={customer} onLogout={handleLogout} />
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
