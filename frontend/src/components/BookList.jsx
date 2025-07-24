import { useState, useEffect } from 'react'

const BookList = ({ books, cart, onAddToCart }) => {
  const [quantities, setQuantities] = useState({})

  // Calculate available stock = book.stock - quantityInCart
  const getAvailableStock = (bookId, bookStock) => {
    const inCart = cart.find(item => item.id === bookId)?.quantity || 0
    return Math.max(bookStock - inCart, 0)
  }

  const handleQuantityChange = (id, value, max) => {
    let qty = Number(value)
    if (isNaN(qty) || qty < 1) qty = 1
    else if (qty > max) qty = max
    setQuantities(prev => ({ ...prev, [id]: qty }))
  }

  const handleAddClick = (book) => {
    const availableStock = getAvailableStock(book.id, book.stock)
    const desiredQty = quantities[book.id] || 1
    const qtyToAdd = Math.min(desiredQty, availableStock)
    if (qtyToAdd > 0) {
      onAddToCart(book, qtyToAdd)
    } else {
      alert(`No more stock available for "${book.title}".`)
    }
  }

  useEffect(() => {
    // Reset quantities if cart or books change, to avoid invalid qty
    setQuantities({})
  }, [cart, books])

  return (
    <div className="book-list">
      <h2>Book Inventory</h2>
      {(!books || books.length === 0) ? (
        <p>No books available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>ISBN</th>
              <th>Price</th>
              <th>Year</th>
              <th>Stock</th>
              <th>Category</th>
              <th>Qty</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map(book => {
              const availableStock = getAvailableStock(book.id, book.stock)
              return (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>{book.author_name}</td>
                  <td>{book.isbn}</td>
                  <td>${book.price}</td>
                  <td>{book.publication_year}</td>
                  <td>{book.stock}</td>
                  <td>{book.category}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      max={availableStock}
                      value={quantities[book.id] || 1}
                      onChange={(e) =>
                        handleQuantityChange(book.id, e.target.value, availableStock)
                      }
                      style={{ width: '50px' }}
                      disabled={availableStock === 0}
                    />
                  </td>
                  <td className="actions">
                    <button
                      onClick={() => handleAddClick(book)}
                      className="submit-btn"
                      disabled={availableStock === 0}
                    >
                      Add to Cart
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default BookList
