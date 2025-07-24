import React, { useState, useEffect } from 'react';
import { getCustomerOrders } from '../services/api';

export default function OrderHistory({ customerId }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [customerId]);

  const fetchOrders = async () => {
    if (!customerId) return;
    
    try {
      setLoading(true);
      const orderData = await getCustomerOrders(customerId);
      setOrders(orderData);
      setError('');
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load order history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading order history...</div>;
  }

  if (error) {
    return <div style={{color: 'red'}}>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Your Order History</h2>
      {orders.length === 0 ? (
        <p>No past orders found.</p>
      ) : (
        orders.map(order => (
          <div key={order.orderId} style={{ border: '1px solid #ccc', marginBottom: 10, padding: 10 }}>
            <div><strong>Order #{order.orderId}</strong> - {new Date(order.orderDate).toLocaleDateString()}</div>
            <div>Total: ${order.totalAmount.toFixed(2)}</div>
            <ul>
              {order.items.map(item => (
                <li key={item.itemId}>
                  {item.title} by {item.author_name} x {item.quantity} (${item.unitPrice.toFixed(2)} each = ${item.totalPrice.toFixed(2)})
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
