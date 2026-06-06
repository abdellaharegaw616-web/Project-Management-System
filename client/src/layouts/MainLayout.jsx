import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  User,
  Calendar,
  MessageSquare,
  Video,
  FileText,
  Clock,
  Target,
  BarChart3,
  DollarSign,
  Zap,
  Briefcase,
  Users2
} from 'lucide-react';
import NotificationBell from '../components/common/NotificationBell';
import TopNavigation from '../components/layout/TopNavigation';
import DarkModeToggle from '../components/common/DarkModeToggle';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/projects', icon: FolderKanban },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Team', href: '/team', icon: Users },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Meetings', href: '/meetings', icon: Video },
  { name: 'Documents', href: '/documents', icon: FileText },
  { name: 'Time Tracking', href: '/time-tracking', icon: Clock },
  { name: 'Goals', href: '/goals', icon: Target },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Finance', href: '/finance', icon: DollarSign },
  { name: 'Automations', href: '/automations', icon: Zap },
  { name: 'Portfolio', href: '/portfolio', icon: Briefcase },
  { name: 'Resource Planning', href: '/resource-planning', icon: Users2 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Close sidebar on ESC key
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    if (sidebarOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    } else {
      document.body.style.overflow = 'unset'; // Restore scroll
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

  // Close sidebar on route change (mobile)
  React.useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Top Navigation - Hidden on mobile */}
      <div className="hidden lg:block">
        <TopNavigation />
      </div>

      {/* Mobile sidebar */}
      {console.log('Sidebar state:', sidebarOpen)}
      <div className={`fixed inset-0 z-[9999] lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-slate-950 shadow-xl flex flex-col z-[10000]">
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                P
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-slate-100">Project Management System</h1>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)} 
              className="btn-icon text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* User info */}
          <div className="px-4 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="avatar">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-slate-100">{user?.name}</p>
                <p className="text-sm text-gray-500 dark:text-slate-400 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
          
          {/* Navigation - Scrollable */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                  location.pathname === item.href
                    ? 'bg-blue-50 text-blue-600 dark:bg-slate-800 dark:text-blue-300'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>
          
          {/* Logout button */}
          <div className="border-t border-gray-200 p-4 bg-gray-50 dark:bg-slate-900 dark:border-slate-700 space-y-3">
            <DarkModeToggle />
            <button
              onClick={handleLogout}
              className={`flex items-center gap-3 p-3 rounded-lg text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-800 w-full`}
            >
              <LogOut className="h-5 w-5" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-slate-950 border-r border-gray-200 dark:border-slate-700 flex flex-col hidden lg:flex z-40">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-200 dark:border-slate-700">
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            P
          </div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Project Management System</h1>
        </div>

        {/* User info */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="avatar">
                {user?.name?.charAt(0) || 'U'}
              </div>
            <div>
              <p className="font-medium text-gray-900">{user?.name}</p>
              <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                location.pathname === item.href
                  ? 'bg-blue-50 text-blue-600 dark:bg-slate-800 dark:text-blue-300'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Logout button */}
        <div className="border-t border-gray-200 p-4 bg-gray-50 dark:bg-slate-900 dark:border-slate-700 space-y-3">
          <DarkModeToggle />
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 p-3 rounded-lg text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-800 w-full`}
          >
            <LogOut className="h-5 w-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile menu button */}
        <div className="lg:hidden sticky top-0 z-10 bg-white dark:bg-slate-900 dark:border-b dark:border-slate-700">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => {
                console.log('Hamburger clicked, setting sidebar to true');
                setSidebarOpen(true);
              }}
              className="btn-icon text-gray-500"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                P
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-slate-100">Project Management System</span>
            </div>
            <button
              onClick={() => {
                console.log('User profile clicked, setting sidebar to true');
                setSidebarOpen(true);
              }}
              className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium hover:bg-blue-700 transition-colors relative"
            >
              {user?.name?.charAt(0) || 'U'}
              <Menu className="absolute -bottom-1 -right-1 h-4 w-4 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 rounded-full p-0.5 shadow-sm" />
            </button>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
          <Outlet />
        </main>

        {/* Mobile bottom navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 z-20">
          <div className="flex items-center overflow-x-auto scrollbar-hide">
            <div className="flex">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex flex-col items-center gap-1 px-4 py-2 min-w-[70px] transition-colors flex-shrink-0 ${
                    location.pathname === item.href
                      ? 'text-blue-600'
                      : 'text-gray-500 dark:text-slate-400'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-xs whitespace-nowrap">{item.name}</span>
                </Link>
              ))}
            </div>

            <div className="flex items-center px-2">
              <DarkModeToggle className="px-2 py-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
