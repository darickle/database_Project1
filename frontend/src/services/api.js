const API_BASE_URL = 'http://localhost:3000'

// Book endpoints
export const getBooks = async () => {
  const response = await fetch(`${API_BASE_URL}/books`)
  if (!response.ok) {
    throw new Error('Failed to fetch books')
  }
  return response.json()
}

export const searchBooks = async (params) => {
  const { title, minPrice, maxPrice } = params
  const searchParams = new URLSearchParams()
  
  if (title) searchParams.append('q', title)
  if (minPrice !== null && minPrice !== undefined) searchParams.append('minPrice', minPrice)
  if (maxPrice !== null && maxPrice !== undefined) searchParams.append('maxPrice', maxPrice)
  
  const response = await fetch(`${API_BASE_URL}/books/search?${searchParams}`)
  if (!response.ok) {
    throw new Error('Search failed')
  }
  return response.json()
}

// Customer endpoints
export const registerCustomer = async (customerData) => {
  const response = await fetch(`${API_BASE_URL}/customers/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(customerData),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Registration failed')
  }
  return response.json()
}

export const loginCustomer = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/customers/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Login failed')
  }
  return response.json()
}

export const getCustomerProfile = async (customerId) => {
  const response = await fetch(`${API_BASE_URL}/customers/${customerId}`)
  if (!response.ok) {
    throw new Error('Failed to fetch customer profile')
  }
  return response.json()
}

// Order endpoints
export const createOrder = async (orderData) => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create order')
  }
  return response.json()
}

export const getCustomerOrders = async (customerId) => {
  const response = await fetch(`${API_BASE_URL}/orders/customer/${customerId}`)
  if (!response.ok) {
    throw new Error('Failed to fetch order history')
  }
  return response.json()
}

export const getOrderDetails = async (orderId) => {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}`)
  if (!response.ok) {
    throw new Error('Failed to fetch order details')
  }
  return response.json()
}

// Legacy functions (no longer supported by backend)
export const createBook = async (bookData) => {
  throw new Error('Creating books is not supported. Books must be added manually via SQL.')
}

export const updateBook = async (id, bookData) => {
  throw new Error('Updating books is not supported. Books must be modified manually via SQL.')
}

export const deleteBook = async (id) => {
  throw new Error('Deleting books is not supported. Books must be removed manually via SQL.')
}