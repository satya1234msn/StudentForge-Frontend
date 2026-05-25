import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { LogOut, Compass, LayoutDashboard, PlusCircle } from 'lucide-react';
import Button from './Button';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-800/60 py-4 px-6 md:px-12 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <span className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
          Student<span className="text-gradient-purple-blue">Forge</span>
        </span>
      </Link>

      <div className="flex items-center gap-6">
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="text-slate-300 hover:text-white flex items-center gap-1.5 text-sm font-medium transition-colors">
              <LayoutDashboard size={16} />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <Link to="/discover" className="text-slate-300 hover:text-white flex items-center gap-1.5 text-sm font-medium transition-colors">
              <Compass size={16} />
              <span className="hidden sm:inline">Discover</span>
            </Link>
            <Link to="/projects/create" className="text-slate-300 hover:text-white flex items-center gap-1.5 text-sm font-medium transition-colors">
              <PlusCircle size={16} />
              <span className="hidden sm:inline">Create Project</span>
            </Link>

            <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-full bg-indigo-600/35 border border-indigo-500/40 flex items-center justify-center text-indigo-200 font-bold overflow-hidden shadow-inner">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    user?.name?.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="hidden md:block">
                  <p className="text-xs font-semibold text-slate-200 leading-tight">{user?.name}</p>
                  <p className="text-[10px] text-slate-400 font-medium">Score: {user?.reliabilityScore?.toFixed(1) || '5.0'}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-300 cursor-pointer"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-slate-300 hover:text-white text-sm font-medium transition-colors">
              Sign In
            </Link>
            <Link to="/register">
              <Button variant="primary" className="py-1.5 px-4 text-sm">
                Get Started
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
