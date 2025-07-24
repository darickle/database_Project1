// OrderHistory.jsx
import React from 'react';

const fakeOrders = [
  {
    orderId: 1,
    date: '2025-07-20',
    total: 59.99,
    items: [
      { bookId: 101, title: 'Book A', quantity: 1, price: 19.99 },
      { bookId: 102, title: 'Book B', quantity: 2, price: 20.00 },
    ],
  },
  {
    orderId: 2,
    date: '2025-06-15',
    total: 29.99,
    items: [
      { bookId: 103, title: 'Book C', quantity: 1, price: 29.99 },
    ],
  },
];

export default function OrderHistory() {
  return (
    <div>
      <h2>Your Order History</h2>
      {fakeOrders.length === 0 ? (
        <p>No past orders found.</p>
      ) : (
        fakeOrders.map(order => (
          <div key={order.orderId} style={{ border: '1px solid #ccc', marginBottom: 10, padding: 10 }}>
            <div><strong>Order #{order.orderId}</strong> - {new Date(order.date).toLocaleDateString()}</div>
            <div>Total: ${order.total.toFixed(2)}</div>
            <ul>
              {order.items.map(item => (
                <li key={item.bookId}>
                  {item.title} x {item.quantity} (${item.price.toFixed(2)} each)
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
