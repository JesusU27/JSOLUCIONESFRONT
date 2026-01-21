import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { salesService } from '../services/salesService';
import { useAuth } from '../context/AuthContext';
import './MyPurchasesPage.css';

const MyPurchasesPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await salesService.getMyPurchases();
      setPurchases(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching purchases:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleGoBack = () => {
    // Si es admin, vuelve a admin-home, si no a user-home
    const route = user?.userType === 'admin' ? '/admin-home' : '/user-home';
    navigate(route);
  };

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'PENDIENTE':
        return '#f39c12';
      case 'COMPLETADA':
        return '#27ae60';
      case 'CANCELADA':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="purchases-page">
        <div className="purchases-header">
          <button className="back-btn" onClick={handleGoBack}>
            ← Volver
          </button>
          <h1>Mis Compras</h1>
          <button className="logout-btn" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
        <div className="purchases-container">
          <div className="loading">Cargando compras...</div>
        </div>
      </div>
    );handleGoBack
  }

  return (
    <div className="purchases-page">
      <div className="purchases-header">
        <button className="back-btn" onClick={() => navigate('/user-home')}>
          ← Volver
        </button>
        <h1>📦 Mis Compras</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </div>

      <div className="purchases-container">
        {error && <div className="error-message">{error}</div>}

        {purchases.length === 0 ? (
          <div className="no-purchases">
            <p>Aún no tienes compras</p>
            <button onClick={() => navigate('/user-home')} className="shop-btn">
              Ir a comprar
            </button>
          </div>
        ) : (
          <div className="purchases-list">
            {purchases.map((purchase) => (
              <div
                key={purchase.id}
                className="purchase-card"
              >
                <div
                  className="purchase-header"
                  onClick={() =>
                    setExpandedId(expandedId === purchase.id ? null : purchase.id)
                  }
                >
                  <div className="purchase-info">
                    <div className="purchase-id">
                      Pedido #{purchase.id}
                    </div>
                    <div className="purchase-date">
                      {formatDate(purchase.fecha_venta)}
                    </div>
                  </div>
                  <div className="purchase-meta">
                    <div
                      className="purchase-status"
                      style={{ borderColor: getStatusColor(purchase.estado) }}
                    >
                      <span style={{ color: getStatusColor(purchase.estado) }}>
                        {purchase.estado}
                      </span>
                    </div>
                    <div className="purchase-total">
                      ${parseFloat(purchase.total).toFixed(2)}
                    </div>
                  </div>
                  <div className="expand-icon">
                    {expandedId === purchase.id ? '▼' : '▶'}
                  </div>
                </div>

                {expandedId === purchase.id && (
                  <div className="purchase-details">
                    <h4>Detalles del Pedido</h4>
                    <div className="details-items">
                      {purchase.detalles.map((detalle, index) => (
                        <div key={index} className="detail-item">
                          <div className="detail-product">
                            <h5>{detalle.producto_nombre}</h5>
                            <p>{detalle.producto_descripcion}</p>
                          </div>
                          <div className="detail-quantity">
                            Cantidad: <strong>{detalle.cantidad}</strong>
                          </div>
                          <div className="detail-price">
                            ${parseFloat(detalle.precio_unitario).toFixed(2)}
                          </div>
                          <div className="detail-subtotal">
                            ${parseFloat(detalle.subtotal).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {purchase.observaciones && (
                      <div className="purchase-notes">
                        <h4>Observaciones</h4>
                        <p>{purchase.observaciones}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPurchasesPage;
