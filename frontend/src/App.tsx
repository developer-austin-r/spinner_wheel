import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginForm } from './components/auth/LoginForm';
import SpinPage from './pages/SpinPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import { SpinnerManagement } from './pages/admin/SpinnerManagement';
import UserManagement from './pages/admin/UserManagement';
import { SpinnerProvider } from './context/SpinnerContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <SpinnerProvider>
        <Router>
          <div className="min-h-screen bg-white dark:bg-[#0b0c10]">
            <Routes>
              <Route path="/" element={<LoginForm />} />
              <Route path="/spin-page" element={
                <ProtectedRoute allowedRoles={['user']}>
                  <SpinPage />
                </ProtectedRoute>
              } />
              <Route path="/admin-dashboard" element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/spinners" element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <SpinnerManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <UserManagement />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </Router>
      </SpinnerProvider>
    </AuthProvider>
  );
}

export default App;
