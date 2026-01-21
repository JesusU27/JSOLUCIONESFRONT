import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Login from './components/Login';
import AdminHome from './pages/AdminHome';
import UserHome from './pages/UserHome';
import ProfilePage from './pages/ProfilePage';
import SecurityPage from './pages/SecurityPage';
import MyPurchasesPage from './pages/MyPurchasesPage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="/admin-home"
              element={
                <ProtectedRoute requiredUserType="admin">
                  <AdminHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-home"
              element={
                <ProtectedRoute requiredUserType="user">
                  <UserHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute requiredUserType="user">
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/security"
              element={
                <ProtectedRoute requiredUserType="user">
                  <SecurityPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/purchases"
              element={
                <ProtectedRoute requiredUserType="user">
                  <MyPurchasesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-profile"
              element={
                <ProtectedRoute requiredUserType="admin">
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-security"
              element={
                <ProtectedRoute requiredUserType="admin">
                  <SecurityPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
