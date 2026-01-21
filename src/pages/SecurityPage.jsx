import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientService } from '../services/clientService';
import { useAuth } from '../context/AuthContext';
import './SecurityPage.css';

const SecurityPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [formData, setFormData] = useState({
    password_actual: '',
    password_nueva: '',
    password_nueva2: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTogglePassword = (field) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validaciones
    if (!formData.password_actual.trim()) {
      setError('La contraseña actual es requerida');
      return;
    }

    if (!formData.password_nueva.trim()) {
      setError('La nueva contraseña es requerida');
      return;
    }

    if (formData.password_nueva.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (formData.password_nueva !== formData.password_nueva2) {
      setError('Las contraseñas nuevas no coinciden');
      return;
    }

    if (formData.password_actual === formData.password_nueva) {
      setError('La nueva contraseña debe ser diferente a la actual');
      return;
    }

    setLoading(true);
    try {
      await clientService.changePassword(
        formData.password_actual,
        formData.password_nueva,
        formData.password_nueva2
      );
      setSuccess('Contraseña cambio correctamente');
      setFormData({
        password_actual: '',
        password_nueva: '',
        password_nueva2: '',
      });
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError(err.message);
      console.error('Error changing password:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    // Si es admin, vuelve a admin-home, si no a user-home
    const route = user?.userType === 'admin' ? '/admin-home' : '/user-home';
    navigate(route);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="security-page">
      <div className="security-header">
        <button className="back-btn" onClick={handleGoBack}>
          ← Volver
        </button>
        <h1>Seguridad</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </div>

      <div className="security-container">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="security-card">
          <div className="card-header">
            <h2>🔒 Cambiar Contraseña</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="password_actual">Contraseña Actual</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword.current ? 'text' : 'password'}
                  id="password_actual"
                  name="password_actual"
                  value={formData.password_actual}
                  onChange={handleChange}
                  placeholder="Ingresa tu contraseña actual"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => handleTogglePassword('current')}
                  disabled={loading}
                >
                  {showPassword.current ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password_nueva">Nueva Contraseña</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword.new ? 'text' : 'password'}
                  id="password_nueva"
                  name="password_nueva"
                  value={formData.password_nueva}
                  onChange={handleChange}
                  placeholder="Ingresa tu nueva contraseña"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => handleTogglePassword('new')}
                  disabled={loading}
                >
                  {showPassword.new ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              <small className="password-hint">Mínimo 6 caracteres</small>
            </div>

            <div className="form-group">
              <label htmlFor="password_nueva2">Confirmar Nueva Contraseña</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword.confirm ? 'text' : 'password'}
                  id="password_nueva2"
                  name="password_nueva2"
                  value={formData.password_nueva2}
                  onChange={handleChange}
                  placeholder="Confirma tu nueva contraseña"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => handleTogglePassword('confirm')}
                  disabled={loading}
                >
                  {showPassword.confirm ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div className="button-group">
              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
              >
                {loading ? 'Cambiando...' : '✓ Cambiar Contraseña'}
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={handleGoBack}
                disabled={loading}
              >
                ✕ Cancelar
              </button>
            </div>
          </form>

          <div className="security-tips">
            <h3>🛡️ Recomendaciones de Seguridad</h3>
            <ul>
              <li>Usa contraseñas fuertes con letras, números y caracteres especiales</li>
              <li>No compartas tu contraseña con nadie</li>
              <li>Cambia tu contraseña regularmente</li>
              <li>Nunca uses contraseñas que hayas utilizado antes</li>
            </ul>
          </div>
        </div>

        <div className="profile-links">
          <button
            className="link-btn"
            onClick={() => {
              const route = user?.userType === 'admin' ? '/admin-profile' : '/profile';
              navigate(route);
            }}
          >
            👤 Mi Perfil
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecurityPage;
