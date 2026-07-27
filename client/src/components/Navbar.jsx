import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, LogOut, Layers, User } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { theme } = useTheme();

  if (!user) return null;

  return (
    <motion.nav
      className="floating-nav"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center justify-between px-5 py-2.5">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 no-underline">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
            <span className="text-white font-black text-sm">F</span>
          </div>
          <span className="font-bold text-lg gradient-text">FreelanceHub</span>
        </Link>

        {/* Right section */}
        <div className="flex items-center gap-4">
          
          {/* Messages */}
          <Link to="/messages" style={{ color: 'var(--text-secondary)' }}
            className="flex items-center gap-1.5 text-sm font-medium transition-all hover:opacity-80 no-underline">
            <MessageSquare size={15} />
            <span>Messages</span>
          </Link>
          
          {/* Profile */}
          <Link to="/profile" style={{ color: 'var(--text-secondary)' }}
            className="flex items-center gap-1.5 text-sm font-medium transition-all hover:opacity-80 no-underline ml-2">
            <User size={15} />
            <span>Profile</span>
          </Link>

          {/* User info */}
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{user.name}</span>
            <span className="ml-1 text-xs px-2 py-0.5 rounded-full"
              style={{ background: 'var(--accent)', color: 'white', fontSize: '10px' }}>
              {user.role}
            </span>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full transition-all"
            style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            <LogOut size={13} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
