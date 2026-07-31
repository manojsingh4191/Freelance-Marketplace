import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, LogOut, Layers, User, Menu, X, Moon, Sun } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!user) return null;

  const themes = [
    { key: 'dark', icon: <Moon size={14} />, label: 'Dark' },
    { key: 'glass', icon: <Layers size={14} />, label: 'Glass' },
    { key: 'light', icon: <Sun size={14} />, label: 'Light' },
  ];

  return (
    <>
      <motion.nav
        className="floating-nav"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: 'relative', zIndex: 100 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'linear-gradient(135deg, #7c3aed, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: 'white', fontWeight: 900, fontSize: '14px' }}>F</span>
            </div>
            <span className="gradient-text" style={{ fontWeight: 800, fontSize: '18px', whiteSpace: 'nowrap' }}>FreelanceHub</span>
          </Link>

          {/* Desktop Nav */}
          <div className="desktop-nav-items" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* Theme Switcher */}
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', padding: '4px', border: '1px solid var(--border-color)', gap: '2px' }}>
              {themes.map(t => (
                <button key={t.key} onClick={() => setTheme(t.key)} title={t.label} style={{
                  padding: '6px 12px', borderRadius: '999px', border: 'none',
                  background: theme === t.key ? 'var(--accent)' : 'transparent',
                  color: theme === t.key ? 'white' : 'var(--text-secondary)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px',
                  fontSize: '12px', fontWeight: 700, transition: 'all 0.2s ease',
                  boxShadow: theme === t.key ? '0 2px 8px rgba(124,58,237,0.4)' : 'none'
                }}>
                  {t.icon} {theme === t.key && t.label}
                </button>
              ))}
            </div>

            <Link to="/messages" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap' }}>
              <MessageSquare size={15} /> Messages
            </Link>
            <Link to="/profile" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap' }}>
              <User size={15} /> Profile
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              <div style={{ textAlign: 'right' }}>
                <span style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '13px', display: 'block', whiteSpace: 'nowrap' }}>{user.name}</span>
                <span style={{ background: 'var(--accent)', color: 'white', fontSize: '10px', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>{user.role}</span>
              </div>
              <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, padding: '8px 14px', borderRadius: '999px', background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                <LogOut size={13} /> Logout
              </button>
            </div>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="mobile-menu-btn"
            style={{ display: 'none', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '8px', color: 'var(--text-primary)', cursor: 'pointer', alignItems: 'center', justifyContent: 'center' }}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              style={{ overflow: 'hidden', borderTop: '1px solid var(--border-color)', padding: '0 16px' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '16px', paddingTop: '12px' }}>
                {/* Theme in mobile */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  {themes.map(t => (
                    <button key={t.key} onClick={() => { setTheme(t.key); }} style={{
                      flex: 1, padding: '10px', borderRadius: '10px', border: 'none',
                      background: theme === t.key ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
                      color: theme === t.key ? 'white' : 'var(--text-secondary)',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      gap: '6px', fontSize: '13px', fontWeight: 700,
                    }}>
                      {t.icon} {t.label}
                    </button>
                  ))}
                </div>

                <Link to="/messages" onClick={() => setMenuOpen(false)} style={{ color: 'var(--text-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 600, padding: '12px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)' }}>
                  <MessageSquare size={16} /> Messages
                </Link>
                <Link to="/profile" onClick={() => setMenuOpen(false)} style={{ color: 'var(--text-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 600, padding: '12px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)' }}>
                  <User size={16} /> Profile
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)' }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, color: 'var(--text-primary)', fontSize: '14px' }}>{user.name}</p>
                    <span style={{ background: 'var(--accent)', color: 'white', fontSize: '10px', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>{user.role}</span>
                  </div>
                  <button onClick={() => { logout(); setMenuOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, padding: '10px 16px', borderRadius: '999px', background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer' }}>
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Responsive CSS */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav-items { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .floating-nav { border-radius: 16px !important; margin: 8px !important; top: 8px !important; }
        }
      `}</style>
    </>
  );
}
