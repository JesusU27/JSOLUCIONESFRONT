import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginService } from '../services/authService';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await loginService(email, password);
      
      login(response.user, response.tokens);
      
      // Redirigir según el tipo de usuario
      if (response.user.userType === 'admin') {
        navigate('/admin-home');
      } else {
        navigate('/user-home');
      }
    } catch (err) {
      console.error('Error de login:', err);
      setError(err.message || 'Error desconocido. Verifica la consola del navegador.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
        <div className="demo-info">
          <p><strong>Credenciales de prueba:</strong></p>
          <p>Admin: admin@gmail.com / admin123</p>
          <p>Usuario: user@gmail.com / user123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
