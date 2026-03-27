import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wrench, 
  MessageSquare, 
  CalendarCheck, 
  FileText, 
  Settings, 
  LogOut,
  Home,
  Users,
  X
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

interface AdminSidebarProps {
  onClose?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ onClose }) => {
  const location = useLocation();

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = '/';
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Services', path: '/admin/services', icon: Wrench },
    { name: 'Bookings', path: '/admin/bookings', icon: CalendarCheck },
    { name: 'Testimonials', path: '/admin/testimonials', icon: MessageSquare },
    { name: 'Blog Posts', path: '/admin/posts', icon: FileText },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white h-full flex flex-col shadow-2xl">
      <div className="p-6 border-b border-gray-800 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold tracking-tight">Admin<span className="text-blue-500">Panel</span></span>
        </Link>
        {onClose && (
          <button 
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-800 text-gray-400"
          >
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              location.pathname === item.path 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800 space-y-2">
        <Link
          to="/"
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <Home className="h-5 w-5" />
          <span className="font-medium">Back to Site</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};
