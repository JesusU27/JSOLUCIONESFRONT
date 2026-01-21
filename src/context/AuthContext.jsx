import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restaurar sesión al cargar
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedTokens = localStorage.getItem('tokens');
    
    if (storedUser && storedTokens) {
      try {
        setUser(JSON.parse(storedUser));
        setTokens(JSON.parse(storedTokens));
      } catch (err) {
        console.error('Error parsing stored auth data:', err);
        localStorage.removeItem('user');
        localStorage.removeItem('tokens');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, tokensData) => {
    setUser(userData);
    setTokens(tokensData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('tokens', JSON.stringify(tokensData));
  };

  const logout = () => {
    setUser(null);
    setTokens(null);
    localStorage.removeItem('user');
    localStorage.removeItem('tokens');
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Cargando...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, tokens, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};
