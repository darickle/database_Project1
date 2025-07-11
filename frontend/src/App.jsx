import { useState, useEffect } from 'react'
import './App.css'
import BookList from './components/BookList'
import BookForm from './components/BookForm'
import SearchBar from './components/SearchBar'
import { getBooks, searchBooks } from './services/api'

function App() {
  const [books, setBooks] = useState([])
  const [editingBook, setEditingBook] = useState(null)

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    const data = await getBooks()
    setBooks(data)
  }

  const handleSearch = async (searchTerm) => {
    if (searchTerm.trim() === '') {
      fetchBooks()
    } else {
      const results = await searchBooks(searchTerm)
      setBooks(results)
    }
  }

  return (
    <div className="app-container">
      <h1>Bookstore Inventory Management</h1>
      <div className="content-container">
        <div className="form-section">
          <BookForm 
            editingBook={editingBook}
            setEditingBook={setEditingBook}
            refreshBooks={fetchBooks}
          />
        </div>
        <div className="list-section">
          <SearchBar onSearch={handleSearch} />
          <BookList 
            books={books}
            setEditingBook={setEditingBook}
            refreshBooks={fetchBooks}
          />
        </div>
      </div>
    </div>
  )
}

export default App