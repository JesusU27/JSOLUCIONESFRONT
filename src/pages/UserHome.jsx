import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ProductList from '../components/ProductList';
import CartModal from '../components/CartModal';
import './Home.css';

const UserHome = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const [showCart, setShowCart] = useState(false);
  const productListRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCartSuccess = () => {
    // Recargar los productos después de una compra exitosa
    productListRef.current?.reloadProducts();
    // Mostrar mensaje de éxito
    alert('¡Compra realizada exitosamente!');
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Mi Tienda</h1>
        <div className="header-actions">
          <button
            className="cart-btn"
            onClick={() => setShowCart(true)}
          >
            🛒 Carrito
            {getTotalItems() > 0 && (
              <span className="cart-badge">{getTotalItems()}</span>
            )}
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </div>
      
      <div className="user-info">
        <h2>¡Hola, {user?.nombre}!</h2>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Tipo de usuario:</strong> <span className="user-badge">{user?.userType.toUpperCase()}</span></p>
      </div>

      {/* Componente de lista de productos */}
      <ProductList ref={productListRef} onAddToCart={() => setShowCart(true)} />

      <div className="user-section">
        <h2>Opciones</h2>
        <div className="user-grid">
          <div className="user-card" onClick={() => navigate('/purchases')}>
            <h3>📦 Mis Compras</h3>
            <p>Ver historial de compras y pedidos</p>
          </div>
          <div className="user-card" onClick={() => navigate('/profile')}>
            <h3>👤 Mi Perfil</h3>
            <p>Ver y editar información personal</p>
          </div>
          <div className="user-card" onClick={() => navigate('/security')}>
            <h3>🔒 Seguridad</h3>
            <p>Cambiar contraseña</p>
          </div>
        </div>
      </div>

      <CartModal 
        isOpen={showCart} 
        onClose={() => setShowCart(false)}
        onSuccess={handleCartSuccess}
      />
    </div>
  );
};

export default UserHome;
