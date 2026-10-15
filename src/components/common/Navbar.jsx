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
    <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-200/80 py-3.5 px-6 md:px-12 flex items-center justify-between shadow-xs">
      <Link to="/" className="flex items-center gap-2">
        <span className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1">
          Student<span className="text-gradient-purple-blue">Forge</span>
        </span>
      </Link>

      <div className="flex items-center gap-5">
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="text-slate-600 hover:text-slate-900 flex items-center gap-1.5 text-xs font-semibold transition-colors">
              <LayoutDashboard size={15} />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <Link to="/discover" className="text-slate-600 hover:text-slate-900 flex items-center gap-1.5 text-xs font-semibold transition-colors">
              <Compass size={15} />
              <span className="hidden sm:inline">Discover</span>
            </Link>
            <Link to="/projects/create" className="text-slate-600 hover:text-slate-900 flex items-center gap-1.5 text-xs font-semibold transition-colors">
              <PlusCircle size={15} />
              <span className="hidden sm:inline">Create Project</span>
            </Link>

            <div className="h-5 w-px bg-slate-200 hidden sm:block"></div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-700 font-bold overflow-hidden text-xs">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    user?.name?.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="hidden md:block">
                  <p className="text-xs font-semibold text-slate-800 leading-tight">{user?.name}</p>
                  <p className="text-[10px] text-slate-500 font-medium">Score: {user?.reliabilityScore?.toFixed(1) || '5.0'}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/discover" className="text-slate-600 hover:text-slate-900 flex items-center gap-1.5 text-xs font-semibold transition-colors">
              <Compass size={15} />
              <span className="hidden sm:inline">Explore Projects</span>
            </Link>
            <Link to="/login">
              <Button variant="primary" className="py-2 px-4 text-xs rounded-full">
                Sign In
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
