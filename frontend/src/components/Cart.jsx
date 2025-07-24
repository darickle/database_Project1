import { useState } from 'react'

const Cart = ({ cart, onRemoveFromCart, onClearCart, onPlaceOrder }) => {
  const [removeQuantities, setRemoveQuantities] = useState({})

  const handleRemoveQuantityChange = (id, value, maxQty) => {
    let qty = Number(value)
    if (isNaN(qty) || qty < 1) qty = 1
    else if (qty > maxQty) qty = maxQty
    setRemoveQuantities(prev => ({ ...prev, [id]: qty }))
  }

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  return (
    <div className="cart-page">
      <h2>Shopping Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Subtotal</th>
                <th>Remove Qty</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.quantity}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      max={item.quantity}
                      value={removeQuantities[item.id] || 1}
                      onChange={e =>
                        handleRemoveQuantityChange(item.id, e.target.value, item.quantity)
                      }
                      style={{ width: '50px' }}
                    />
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => {
                        const qtyToRemove = removeQuantities[item.id] || 1
                        onRemoveFromCart(item.id, qtyToRemove)
                      }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Total: ${totalPrice.toFixed(2)}</h3>
          <div className="cart-actions">
            <button className="order-btn" onClick={onPlaceOrder}>
              Order
            </button>
            <button className="clear-cart-btn" onClick={onClearCart}>
              Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default Cart
