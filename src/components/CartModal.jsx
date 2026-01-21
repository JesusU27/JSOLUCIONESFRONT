import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { salesService } from '../services/salesService';
import './CartModal.css';

const CartModal = ({ isOpen, onClose, onSuccess }) => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [observaciones, setObservaciones] = useState('');

  if (!isOpen) return null;

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      setError('El carrito está vacío');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const detalles = cartItems.map((item) => ({
        producto: item.id,
        cantidad: item.cantidad,
      }));

      await salesService.createSale(detalles, observaciones);
      clearCart();
      setObservaciones('');
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message);
      console.error('Error creating sale:', err);
    } finally {
      setLoading(false);
    }
  };

  const total = getTotalPrice();

  return (
    <div className="cart-modal-overlay">
      <div className="cart-modal">
        <div className="cart-modal-header">
          <h2>🛒 Carrito de Compras</h2>
          <button className="close-btn" onClick={onClose} disabled={loading}>
            ✕
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <p>Tu carrito está vacío</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="item-info">
                    <h4>{item.nombre}</h4>
                    <p className="item-price">${parseFloat(item.precio).toFixed(2)}</p>
                  </div>
                  <div className="item-quantity">
                    <button
                      onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                      disabled={loading}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={item.cantidad}
                      onChange={(e) =>
                        updateQuantity(item.id, parseInt(e.target.value) || 1)
                      }
                      disabled={loading}
                      min="1"
                    />
                    <button
                      onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                      disabled={loading}
                    >
                      +
                    </button>
                  </div>
                  <div className="item-subtotal">
                    ${(parseFloat(item.precio) * item.cantidad).toFixed(2)}
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                    disabled={loading}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-notes">
              <label htmlFor="observaciones">Observaciones (opcional)</label>
              <textarea
                id="observaciones"
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder="Agregar notas sobre tu compra..."
                disabled={loading}
                rows="3"
              />
            </div>

            <div className="cart-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="cart-actions">
              <button
                className="checkout-btn"
                onClick={handleCheckout}
                disabled={loading || cartItems.length === 0}
              >
                {loading ? '⏳ Procesando...' : '✓ Comprar Ahora'}
              </button>
              <button
                className="continue-btn"
                onClick={onClose}
                disabled={loading}
              >
                Continuar Comprando
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartModal;
