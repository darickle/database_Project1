import { useState, useEffect } from 'react'
import { createBook, updateBook } from '../services/api'

const BookForm = ({ editingBook, setEditingBook, refreshBooks }) => {
  const [formData, setFormData] = useState({
    title: '',
    isbn: '',
    author_name: '',
    price: '',
    publication_year: '',
    stock: '',
    category: ''
  })

  useEffect(() => {
    if (editingBook) {
      setFormData(editingBook)
    }
  }, [editingBook])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingBook) {
        await updateBook(editingBook.id, formData)
      } else {
        await createBook(formData)
      }
      setFormData({
        title: '',
        isbn: '',
        author_name: '',
        price: '',
        publication_year: '',
        stock: '',
        category: ''
      })
      setEditingBook(null)
      refreshBooks()
    } catch (error) {
      console.error('Error saving book:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="book-form">
      <h2>{editingBook ? 'Edit Book' : 'Add New Book'}</h2>
      
      <div className="form-group">
        <label>Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>ISBN</label>
        <input
          type="text"
          name="isbn"
          value={formData.isbn}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Author</label>
        <input
          type="text"
          name="author_name"
          value={formData.author_name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Price</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          step="0.01"
          required
        />
      </div>

      <div className="form-group">
        <label>Publication Year</label>
        <input
          type="number"
          name="publication_year"
          value={formData.publication_year}
          onChange={handleChange}
          min="1900"
          max={new Date().getFullYear()}
          required
        />
      </div>

      <div className="form-group">
        <label>Stock</label>
        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          min="0"
          required
        />
      </div>

      <div className="form-group">
        <label>Category</label>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="e.g., Fiction, Science, History"
        />
      </div>

      <button type="submit" className="submit-btn">
        {editingBook ? 'Update Book' : 'Add Book'}
      </button>

      {editingBook && (
        <button 
          type="button" 
          className="cancel-btn"
          onClick={() => setEditingBook(null)}
        >
          Cancel
        </button>
      )}
    </form>
  )
}

export default BookForm