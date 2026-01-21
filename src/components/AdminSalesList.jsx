import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './AdminSalesList.css';

const AdminSalesList = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [paginationInfo, setPaginationInfo] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchSales(1);
  }, [pageSize]);

  const fetchSales = async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const data = await api.get(`/ventas/admin/?page=${page}&page_size=${pageSize}`);
      setSales(data.results);
      setPaginationInfo({
        count: data.count,
        next: data.next,
        previous: data.previous,
        currentPage: page,
      });
      setCurrentPage(page);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching sales:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (paginationInfo?.next) {
      fetchSales(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (paginationInfo?.previous && currentPage > 1) {
      fetchSales(currentPage - 1);
    }
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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading && sales.length === 0) {
    return (
      <div className="admin-sales-container">
        <div className="loading">Cargando ventas...</div>
      </div>
    );
  }

  return (
    <div className="admin-sales-container">
      <h2>📊 Gestión de Ventas</h2>

      {error && <div className="error-message">{error}</div>}

      {/* Controles */}
      <div className="sales-controls">
        <div className="page-size-selector">
          <label>Ventas por página:</label>
          <select value={pageSize} onChange={(e) => setPageSize(parseInt(e.target.value))}>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

      {/* Lista de ventas */}
      {sales.length > 0 ? (
        <div className="sales-list">
          {sales.map((sale) => (
            <div
              key={sale.id}
              className="sale-card"
            >
              <div
                className="sale-header"
                onClick={() =>
                  setExpandedId(expandedId === sale.id ? null : sale.id)
                }
              >
                <div className="sale-main-info">
                  <div className="sale-id">Venta #{sale.id}</div>
                  <div className="sale-client">{sale.cliente_nombre}</div>
                  <div className="sale-date">{formatDate(sale.fecha_venta)}</div>
                </div>
                <div className="sale-stats">
                  <div className="stat">
                    <span className="stat-label">Total:</span>
                    <span className="stat-value">${parseFloat(sale.total).toFixed(2)}</span>
                  </div>
                  <div
                    className="sale-status"
                    style={{ borderColor: getStatusColor(sale.estado) }}
                  >
                    <span style={{ color: getStatusColor(sale.estado) }}>
                      {sale.estado}
                    </span>
                  </div>
                </div>
                <div className="expand-icon">
                  {expandedId === sale.id ? '▼' : '▶'}
                </div>
              </div>

              {expandedId === sale.id && (
                <div className="sale-details">
                  <div className="details-section">
                    <h4>Información de la Venta</h4>
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="info-label">ID Venta:</span>
                        <span className="info-value">{sale.id}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Cliente:</span>
                        <span className="info-value">{sale.cliente_nombre}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Fecha:</span>
                        <span className="info-value">{formatDate(sale.fecha_venta)}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Estado:</span>
                        <span className="info-value" style={{ color: getStatusColor(sale.estado) }}>
                          {sale.estado}
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Total:</span>
                        <span className="info-value">${parseFloat(sale.total).toFixed(2)}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Cantidad:</span>
                        <span className="info-value">{sale.cantidad_total}</span>
                      </div>
                    </div>
                  </div>

                  <div className="details-section">
                    <h4>Detalles de Productos</h4>
                    <div className="products-list">
                      {sale.detalles.map((detalle, index) => (
                        <div key={index} className="product-detail">
                          <div className="product-info">
                            <h5>{detalle.producto_nombre}</h5>
                            <p>{detalle.producto_descripcion}</p>
                          </div>
                          <div className="product-prices">
                            <div className="price-item">
                              <span>Cantidad:</span>
                              <strong>{detalle.cantidad}</strong>
                            </div>
                            <div className="price-item">
                              <span>Precio:</span>
                              <strong>${parseFloat(detalle.precio_unitario).toFixed(2)}</strong>
                            </div>
                            <div className="price-item subtotal">
                              <span>Subtotal:</span>
                              <strong>${parseFloat(detalle.subtotal).toFixed(2)}</strong>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="no-sales">No hay ventas para mostrar</div>
      )}

      {/* Paginación */}
      {paginationInfo && (
        <div className="pagination-controls">
          <button
            onClick={handlePreviousPage}
            disabled={!paginationInfo.previous}
            className="pagination-btn"
          >
            ← Anterior
          </button>
          <span className="pagination-info">
            Página {paginationInfo.currentPage} de{' '}
            {Math.ceil(paginationInfo.count / pageSize)}
            {' '}({paginationInfo.count} ventas totales)
          </span>
          <button
            onClick={handleNextPage}
            disabled={!paginationInfo.next}
            className="pagination-btn"
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminSalesList;
