import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  BarChart3, 
  Trophy, 
  LogOut,
  ChevronRight,
  Shield
} from 'lucide-react';
import { clsx } from 'clsx';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin-dashboard' },
  { icon: Users, label: 'Users', path: '/admin/users' },
  { icon: Settings, label: 'Spinners', path: '/admin/spinners' },
  { icon: Trophy, label: 'Winners', path: '/admin/winners' },
  { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
];

export const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900 border-r border-white/5 flex flex-col z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-white font-bold tracking-tight">AdminPanel</h1>
          <p className="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em]">Management</p>
        </div>
      </div>

      <nav className="flex-1 px-4 mt-4 space-y-2">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => clsx(
              "flex items-center justify-between px-4 py-3 rounded-xl transition-all group",
              isActive 
                ? "bg-primary text-white shadow-lg shadow-primary/20" 
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            )}
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </div>
            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-medium"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
