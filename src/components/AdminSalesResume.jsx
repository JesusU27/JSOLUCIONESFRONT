import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './AdminSalesResume.css';

const AdminSalesResume = () => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedDetails, setExpandedDetails] = useState(false);

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.get('/ventas/cliente/resumen/');
      console.log(data);
      setResume(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching resume:', err);
    } finally {
      setLoading(false);
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="admin-resume-container">
        <div className="loading">Cargando resumen...</div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="admin-resume-container">
        <div className="no-data">No hay datos disponibles</div>
      </div>
    );
  }

  return (
    <div className="admin-resume-container">
      <h2>📈 Resumen de Ventas</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="resume-card">
        <div className="resume-header">
          <div className="header-left">
            <h3>Resumen de Ventas</h3>
            <p className="date">{resume.ultima_venta ? formatDate(resume.ultima_venta) : 'Sin ventas'}</p>
          </div>
        </div>

        <div className="resume-stats">
          <div className="stat-box">
            <div className="stat-label">Total de Ventas</div>
            <div className="stat-value">{resume.total_ventas || 0}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Monto Total</div>
            <div className="stat-value">${parseFloat(resume.monto_total || 0).toFixed(2)}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Promedio por Venta</div>
            <div className="stat-value">${parseFloat(resume.promedio_venta || 0).toFixed(2)}</div>
          </div>
        </div>

        {resume.observaciones && (
          <div className="observations-section">
            <h4>Observaciones</h4>
            <p>{resume.observaciones}</p>
          </div>
        )}

        <div className="resume-footer">
          <button className="action-btn" onClick={fetchResume}>
            🔄 Actualizar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSalesResume;
