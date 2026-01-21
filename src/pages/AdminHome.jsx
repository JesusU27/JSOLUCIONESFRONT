import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminSalesList from '../components/AdminSalesList';
import AdminSalesResume from '../components/AdminSalesResume';
import ClientsList from '../components/ClientsList';
import ProductsManagement from '../components/ProductsManagement';
import './Home.css';

const AdminHome = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Panel Administrativo</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </div>
      
      <div className="user-info">
        <h2>¡Bienvenido, {user?.nombre}!</h2>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Tipo de usuario:</strong> <span className="admin-badge">{user?.userType.toUpperCase()}</span></p>
      </div>

      {/* Tabs de navegación */}
      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'sales' ? 'active' : ''}`}
          onClick={() => setActiveTab('sales')}
        >
          📋 Ventas
        </button>
        <button
          className={`tab-btn ${activeTab === 'resume' ? 'active' : ''}`}
          onClick={() => setActiveTab('resume')}
        >
          📈 Resumen
        </button>
        <button
          className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          📦 Productos
        </button>
        <button 
          className={`tab-btn ${activeTab === 'clients' ? 'active' : ''}`}
          onClick={() => setActiveTab('clients')}
        >
          👥 Clientes
        </button>
        <button 
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          👤 Mi Perfil
        </button>
      </div>

      {/* Ventas */}
      {activeTab === 'sales' && <AdminSalesList />}

      {/* Resumen */}
      {activeTab === 'resume' && <AdminSalesResume />}

      {/* Productos */}
      {activeTab === 'products' && <ProductsManagement />}

      {/* Clientes */}
      {activeTab === 'clients' && (
        <ClientsList />
      )}

      {/* Perfil */}
      {activeTab === 'profile' && (
        <div className="admin-section">
          <h2>Opciones de Cuenta</h2>
          <div className="admin-grid">
            <div className="admin-card" onClick={() => navigate('/admin-profile')}>
              <h3>👤 Mi Perfil</h3>
              <p>Ver y editar información personal</p>
            </div>
            <div className="admin-card" onClick={() => navigate('/admin-security')}>
              <h3>🔒 Seguridad</h3>
              <p>Cambiar contraseña</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHome;
