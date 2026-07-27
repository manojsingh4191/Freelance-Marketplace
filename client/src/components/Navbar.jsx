import { Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();

  if (!user) return null;

  return (
    <nav className="bg-gray-900 border-b border-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                FreelanceHub
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/messages" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Messages
            </Link>
            <div className="text-sm">
              <span className="text-gray-400">Logged in as: </span>
              <span className="font-medium text-white">{user.name} ({user.role})</span>
            </div>
            <button
              onClick={logout}
              className="px-3 py-1.5 rounded-md text-sm font-medium bg-white/10 hover:bg-white/20 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
