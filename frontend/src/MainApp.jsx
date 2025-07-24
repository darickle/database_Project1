import { useState, useEffect } from 'react'
import './App.css'
import BookList from './components/BookList'
import SearchBar from './components/SearchBar'
import Cart from './components/Cart'
import OrderHistory from './components/OrderHistory'
import { getBooks, searchBooks, createOrder } from './services/api'

function MainApp({ customer, onLogout }) {
  const [books, setBooks] = useState([])
  const [cart, setCart] = useState([])
  const [activeTab, setActiveTab] = useState('books')

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    try {
      const data = await getBooks()
      setBooks(data)
    } catch (error) {
      console.error('Error fetching books:', error)
    }
  }

  const handleSearch = async ({ title, minPrice, maxPrice }) => {
    try {
      const filtered = await searchBooks({ title, minPrice, maxPrice })
      setBooks(filtered)
    } catch (error) {
      console.error('Error searching books:', error)
      // Fallback to client-side filtering if search fails
      const allBooks = await getBooks()
      const filtered = allBooks.filter(book => {
        const matchesTitle = title === '' || book.title.toLowerCase().includes(title.toLowerCase())
        const matchesMinPrice = minPrice === null || book.price >= minPrice
        const matchesMaxPrice = maxPrice === null || book.price <= maxPrice
        return matchesTitle && matchesMinPrice && matchesMaxPrice
      })
      setBooks(filtered)
    }
  }

  const handleAddToCart = (book, quantity) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === book.id)
      if (existing) {
        return prev.map(item =>
          item.id === book.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        return [...prev, { ...book, quantity }]
      }
    })
  }

  const handleRemoveFromCart = (id, quantity) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.id === id) {
            const newQty = item.quantity - quantity
            return newQty > 0 ? { ...item, quantity: newQty } : null
          }
          return item
        })
        .filter(Boolean)
    })
  }

  const handleClearCart = () => {
    setCart([])
  }

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty.')
      return
    }

    try {
      const orderData = {
        customerId: customer.customerId,
        items: cart.map(item => ({
          bookId: item.id,
          quantity: item.quantity
        }))
      }

      await createOrder(orderData)
      alert('Order placed successfully!')
      handleClearCart()
      fetchBooks() // Refresh the catalog with updated stock
    } catch (error) {
      console.error('Order error:', error)
      alert(`Failed to place order: ${error.message}`)
    }
  }

  return (
    <div className="app-container">
      <h1>BookNest</h1>
      <div className="user-info">
        Welcome, {customer.firstName} {customer.lastName}!
      </div>

      <div className="tabs">
        <button
          className={activeTab === 'books' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('books')}
        >
          Catalog
        </button>
        <button
          className={activeTab === 'cart' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('cart')}
        >
          Cart ({cart.reduce((acc, item) => acc + item.quantity, 0)})
        </button>
        <button
          className={activeTab === 'orderHistory' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('orderHistory')}
        >
          Order History
        </button>
      </div>

      {activeTab === 'books' && (
        <div className="content-container">
          <div className="list-section">
            <SearchBar onSearch={handleSearch} />
            <BookList books={books} cart={cart} onAddToCart={handleAddToCart} />
          </div>
        </div>
      )}

      {activeTab === 'cart' && (
        <Cart
          cart={cart}
          onRemoveFromCart={handleRemoveFromCart}
          onClearCart={handleClearCart}
          onPlaceOrder={handlePlaceOrder}
        />
      )}

      {activeTab === 'orderHistory' && (
        <OrderHistory customerId={customer.customerId} />
      )}

      <button className="logout-btn" onClick={onLogout}>
        Logout
      </button>
    </div>
  )
}

export default MainApp