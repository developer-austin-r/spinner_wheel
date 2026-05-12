import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginForm } from './components/auth/LoginForm';
import SpinPage from './pages/SpinPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import { SpinnerManagement } from './pages/admin/SpinnerManagement';
import UserManagement from './pages/admin/UserManagement';
import { SpinnerProvider } from './context/SpinnerContext';
import './index.css';

function App() {
  return (
    <SpinnerProvider>
      <Router>
        <div className="min-h-screen bg-white dark:bg-[#0b0c10]">
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/spin-page" element={<SpinPage />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin/spinners" element={<SpinnerManagement />} />
            <Route path="/admin/users" element={<UserManagement />} />
          </Routes>
        </div>
      </Router>
    </SpinnerProvider>
  );
}

export default App;
