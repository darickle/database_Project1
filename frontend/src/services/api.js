const API_URL = 'http://localhost:3000/books'

export const getBooks = async () => {
  const response = await fetch(API_URL)
  if (!response.ok) {
    throw new Error('Failed to fetch books')
  }
  return response.json()
}

export const searchBooks = async (title) => {
  const response = await fetch(`${API_URL}/search/${title}`)
  if (!response.ok) {
    throw new Error('Search failed')
  }
  return response.json()
}

export const createBook = async (bookData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookData),
  })
  if (!response.ok) {
    throw new Error('Failed to create book')
  }
  return response.json()
}

export const updateBook = async (id, bookData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookData),
  })
  if (!response.ok) {
    throw new Error('Failed to update book')
  }
  return response.json()
}

export const deleteBook = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error('Failed to delete book')
  }
  return response.json()
}