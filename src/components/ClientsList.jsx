import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './ClientsList.css';

const ClientsList = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [paginationInfo, setPaginationInfo] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchClients(1);
  }, [pageSize]);

  const fetchClients = async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const data = await api.get(`/clientes/?page=${page}&page_size=${pageSize}`);
      setClients(data.results);
      setPaginationInfo({
        count: data.count,
        next: data.next,
        previous: data.previous,
        currentPage: page,
      });
      setCurrentPage(page);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (paginationInfo?.next) {
      fetchClients(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (paginationInfo?.previous && currentPage > 1) {
      fetchClients(currentPage - 1);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading && clients.length === 0) {
    return (
      <div className="clients-container">
        <div className="loading">Cargando clientes...</div>
      </div>
    );
  }

  return (
    <div className="clients-container">
      <h2>Gestión de Clientes</h2>

      {error && <div className="error-message">{error}</div>}

      {/* Controles */}
      <div className="clients-controls">
        <div className="page-size-selector">
          <label>Clientes por página:</label>
          <select value={pageSize} onChange={(e) => setPageSize(parseInt(e.target.value))}>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

      {/* Tabla de clientes */}
      {clients.length > 0 ? (
        <div className="clients-list">
          {clients.map((client) => (
            <div
              key={client.id}
              className="client-card"
            >
              <div
                className="client-header"
                onClick={() =>
                  setExpandedId(expandedId === client.id ? null : client.id)
                }
              >
                <div className="client-main-info">
                  <div className="client-name">
                    {client.first_name} {client.last_name}
                  </div>
                  <div className="client-email">{client.email}</div>
                </div>
                <div className="client-stats">
                  <div className="stat">
                    <span className="stat-label">Compras:</span>
                    <span className="stat-value">{client.total_compras}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">ID:</span>
                    <span className="stat-value">#{client.id}</span>
                  </div>
                </div>
                <div className="expand-icon">
                  {expandedId === client.id ? '▼' : '▶'}
                </div>
              </div>

              {expandedId === client.id && (
                <div className="client-details">
                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="detail-label">Usuario:</span>
                      <span className="detail-value">{client.username}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">{client.email}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Nombre:</span>
                      <span className="detail-value">{client.first_name}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Apellido:</span>
                      <span className="detail-value">{client.last_name}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Documento:</span>
                      <span className="detail-value">{client.documento || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Teléfono:</span>
                      <span className="detail-value">{client.telefono || 'N/A'}</span>
                    </div>
                    <div className="detail-item full-width">
                      <span className="detail-label">Dirección:</span>
                      <span className="detail-value">{client.direccion || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Fecha de Registro:</span>
                      <span className="detail-value">{formatDate(client.created_at)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Total de Compras:</span>
                      <span className="detail-value">{client.total_compras}</span>
                    </div>
                  </div>

                  <div className="client-actions">
                    <button className="action-btn edit-btn">✎ Editar</button>
                    <button className="action-btn delete-btn">🗑️ Eliminar</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="no-clients">No hay clientes para mostrar</div>
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
            {' '}({paginationInfo.count} clientes totales)
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

export default ClientsList;
