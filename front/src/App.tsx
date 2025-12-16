
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import Users from './pages/Users';
import Inventory from './pages/Inventory';
import Sales from './pages/Sales';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={
            <ProtectedRoute allowedRoles={['Admin', 'Cajero', 'Inventario']}>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />

            <Route path="pos" element={
              <ProtectedRoute allowedRoles={['Admin', 'Cajero']}>
                <POS />
              </ProtectedRoute>
            } />

            <Route path="ventas" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <Sales />
              </ProtectedRoute>
            } />

            <Route path="inventario" element={
              <ProtectedRoute allowedRoles={['Admin', 'Cajero', 'Inventario']}>
                <Inventory />
              </ProtectedRoute>
            } />

            <Route path="usuarios" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <Users />
              </ProtectedRoute>
            } />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
