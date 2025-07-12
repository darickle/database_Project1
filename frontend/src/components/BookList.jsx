import { deleteBook } from '../services/api'

const BookList = ({ books, setEditingBook, refreshBooks }) => {
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      await deleteBook(id)
      refreshBooks()
    }
  }

  return (
    <div className="book-list">
      <h2>Book Inventory</h2>
      {books.length === 0 ? (
        <p>No books found</p>
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map(book => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author_name}</td>
                <td>{book.isbn}</td>
                <td>${book.price}</td>
                <td>{book.publication_year}</td>
                <td>{book.stock}</td>
                <td>{book.category}</td>
                <td className="actions">
                  <button 
                    onClick={() => setEditingBook(book)}
                    className="edit-btn"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(book.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default BookList