import React from 'react';
import { Bell, Search, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <header className="h-16 border-b border-white/5 bg-gray-900/50 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between">
      <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-xl border border-white/5 w-96">
        <Search className="w-4 h-4 text-gray-500" />
        <input 
          type="text" 
          placeholder="Search analytics, users, or spinners..." 
          className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-gray-600"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-gray-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full border-2 border-gray-900" />
        </button>
        
        <div className="h-8 w-px bg-white/10" />

        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">{user?.name || 'Admin User'}</p>
            <p className="text-[10px] text-gray-500 uppercase font-black">{user?.role?.roleName || 'Admin'}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent p-[2px]">
            <div className="w-full h-full rounded-[10px] bg-gray-900 flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
