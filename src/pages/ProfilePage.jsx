import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientService } from '../services/clientService';
import { useAuth } from '../context/AuthContext';
import './ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    first_name: '',
    last_name: '',
    documento: '',
    telefono: '',
    direccion: '',
  });

  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await clientService.getProfile();
      setFormData({
        email: data.email || '',
        username: data.username || '',
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        documento: data.documento || '',
        telefono: data.telefono || '',
        direccion: data.direccion || '',
      });
      setOriginalData({
        email: data.email || '',
        username: data.username || '',
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        documento: data.documento || '',
        telefono: data.telefono || '',
        direccion: data.direccion || '',
      });
    } catch (err) {
      setError(err.message);
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await clientService.updateProfile(formData);
      setOriginalData({ ...formData });
      setSuccess('Perfil actualizado correctamente');
      setEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
      console.error('Error updating profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({ ...originalData });
    setEditing(false);
    setError('');
  };

  const handleGoBack = () => {
    // Si es admin, vuelve a admin-home, si no a user-home
    const route = user?.userType === 'admin' ? '/admin-home' : '/user-home';
    navigate(route);
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Cargando perfil...</div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <button className="back-btn" onClick={handleGoBack}>
          ← Volver
        </button>
        <h1>Mi Perfil</h1>
        <button className="logout-btn" onClick={() => {logout(); navigate('/')}}>
          Cerrar Sesión
        </button>
      </div>

      <div className="profile-container">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="profile-card">
          <div className="card-header">
            <h2>Información Personal</h2>
            {!editing && (
              <button className="edit-btn" onClick={() => setEditing(true)}>
                ✎ Editar
              </button>
            )}
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!editing}
                className={!editing ? 'disabled' : ''}
              />
            </div>

            <div className="form-group">
              <label>Usuario</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled={!editing}
                className={!editing ? 'disabled' : ''}
              />
            </div>

            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                disabled={!editing}
                className={!editing ? 'disabled' : ''}
              />
            </div>

            <div className="form-group">
              <label>Apellido</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                disabled={!editing}
                className={!editing ? 'disabled' : ''}
              />
            </div>

            <div className="form-group">
              <label>Documento</label>
              <input
                type="text"
                name="documento"
                value={formData.documento}
                onChange={handleChange}
                disabled={!editing}
                className={!editing ? 'disabled' : ''}
              />
            </div>

            <div className="form-group">
              <label>Teléfono</label>
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                disabled={!editing}
                className={!editing ? 'disabled' : ''}
              />
            </div>

            <div className="form-group full-width">
              <label>Dirección</label>
              <textarea
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                disabled={!editing}
                className={!editing ? 'disabled' : ''}
                rows="3"
              />
            </div>
          </div>

          {editing && (
            <div className="button-group">
              <button
                className="save-btn"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Guardando...' : '✓ Guardar'}
              </button>
              <button
                className="cancel-btn"
                onClick={handleCancel}
                disabled={saving}
              >
                ✕ Cancelar
              </button>
            </div>
          )}
        </div>

        <div className="profile-links">
          <button
            className="link-btn"
            onClick={() => navigate('/security')}
          >
            🔒 Cambiar Contraseña
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
