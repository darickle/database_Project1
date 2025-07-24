import { useState } from 'react'

const SearchBar = ({ onSearch }) => {
  const [title, setTitle] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch({
      title: title.trim(),
      minPrice: minPrice === '' ? null : Number(minPrice),
      maxPrice: maxPrice === '' ? null : Number(maxPrice),
    })
  }

  const handleClear = () => {
    setTitle('')
    setMinPrice('')
    setMaxPrice('')
    onSearch({ title: '', minPrice: null, maxPrice: null })
  }

  return (
    <form onSubmit={handleSubmit} className="search-bar" style={{ gap: '10px', flexWrap: 'wrap' }}>
      <input
        type="text"
        placeholder="Search by book title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ minWidth: '150px' }}
      />
      <input
        type="number"
        placeholder="Min Price"
        value={minPrice}
        min="0"
        step="0.01"
        onChange={(e) => setMinPrice(e.target.value)}
        style={{ width: '100px' }}
      />
      <input
        type="number"
        placeholder="Max Price"
        value={maxPrice}
        min="0"
        step="0.01"
        onChange={(e) => setMaxPrice(e.target.value)}
        style={{ width: '100px' }}
      />
      <button type="submit">Search</button>
      <button type="button" onClick={handleClear} className="clear-btn">
        Clear
      </button>
    </form>
  )
}

export default SearchBar
