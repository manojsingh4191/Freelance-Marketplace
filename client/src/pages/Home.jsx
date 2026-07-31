import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, ShieldCheck, CreditCard, ChevronRight, Moon, Sun, Layers, Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const themes = [
    { key: 'dark', icon: <Moon size={14} />, label: 'Dark' },
    { key: 'glass', icon: <Layers size={14} />, label: 'Glass' },
    { key: 'light', icon: <Sun size={14} />, label: 'Light' },
  ];

  return (
    <div className="page-content" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 10 }}>
      {/* Public Navbar */}
      <div style={{ position: 'fixed', top: '16px', left: 0, width: '100%', display: 'flex', justifyContent: 'center', zIndex: 1000, pointerEvents: 'none', padding: '0 16px', boxSizing: 'border-box' }}>
        <div style={{ width: '100%', maxWidth: '1200px', pointerEvents: 'auto' }}>
          <nav style={{ background: 'var(--bg-card)', backdropFilter: 'blur(12px)', border: '1px solid var(--border-color)', borderRadius: '16px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px' }}>
              {/* Logo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'linear-gradient(135deg, #7c3aed, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: 'white', fontWeight: 900, fontSize: '14px' }}>F</span>
                </div>
                <span className="gradient-text" style={{ fontWeight: 800, fontSize: '18px', whiteSpace: 'nowrap' }}>FreelanceHub</span>
              </div>

              {/* Desktop Right */}
              <div className="home-desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', padding: '4px', border: '1px solid var(--border-color)', gap: '2px' }}>
                  {themes.map(t => (
                    <button key={t.key} onClick={() => setTheme(t.key)} title={t.label} style={{
                      padding: '7px 14px', borderRadius: '999px', border: 'none',
                      background: theme === t.key ? 'var(--accent)' : 'transparent',
                      color: theme === t.key ? 'white' : 'var(--text-secondary)',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                      fontSize: '12px', fontWeight: 700, transition: 'all 0.25s ease',
                    }}>
                      {t.icon} {theme === t.key && t.label}
                    </button>
                  ))}
                </div>
                <Link to="/login" style={{ color: 'var(--text-primary)', fontWeight: 700, textDecoration: 'none', fontSize: '14px', whiteSpace: 'nowrap' }}>Log In</Link>
                <Link to="/register" className="btn-primary" style={{ padding: '10px 22px', borderRadius: '999px', textDecoration: 'none', fontSize: '14px', fontWeight: 700, whiteSpace: 'nowrap' }}>Get Started</Link>
              </div>

              {/* Mobile Hamburger */}
              <button onClick={() => setMenuOpen(!menuOpen)} className="home-mobile-btn" style={{ display: 'none', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '8px', color: 'var(--text-primary)', cursor: 'pointer', alignItems: 'center', justifyContent: 'center' }}>
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
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '12px', paddingBottom: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {themes.map(t => (
                        <button key={t.key} onClick={() => setTheme(t.key)} style={{
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
                    <Link to="/login" onClick={() => setMenuOpen(false)} style={{ color: 'var(--text-primary)', fontWeight: 700, textDecoration: 'none', fontSize: '15px', padding: '12px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', display: 'block', textAlign: 'center' }}>Log In</Link>
                    <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary" style={{ padding: '12px 16px', borderRadius: '10px', textDecoration: 'none', fontSize: '15px', fontWeight: 700, display: 'block', textAlign: 'center' }}>Get Started →</Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '160px', paddingBottom: '80px', textAlign: 'center', paddingLeft: '24px', paddingRight: '24px', minHeight: '80vh', position: 'relative', zIndex: 20 }}>
        <motion.div initial={{ opacity: 1, y: 0 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
          <div style={{ display: 'inline-block', padding: '6px 16px', background: 'rgba(124,58,237,0.1)', color: 'var(--accent)', borderRadius: '999px', fontSize: '13px', fontWeight: 800, marginBottom: '24px', border: '1px solid rgba(124,58,237,0.2)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            The Future of Freelancing
          </div>
          <h1 className="gradient-text" style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '24px', maxWidth: '1000px', margin: '0 auto 24px', fontFamily: 'Outfit, sans-serif' }}>
            Hire Top Freelancers <br /> or Find Your Next Big Gig
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)', color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto 48px', lineHeight: 1.6, fontWeight: 500 }}>
            The premium marketplace for independent professionals and ambitious clients. Connect, collaborate, and succeed with cutting-edge tools.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-primary btn-glow-pulse" style={{ padding: '16px 36px', fontSize: '16px', borderRadius: '999px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
                Get Started <ChevronRight size={18} />
              </motion.button>
            </Link>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ padding: '16px 36px', fontSize: '16px', borderRadius: '999px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 700, backdropFilter: 'blur(10px)' }}>
                Explore Work
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Features Section */}
        <div style={{ width: '100%', maxWidth: '1200px', marginTop: '140px' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '64px', fontFamily: 'Outfit, sans-serif' }}>Why Choose FreelanceHub?</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {[
              { icon: <MessageSquare size={36} />, title: 'Real-time Chat', desc: 'Communicate instantly with clients and freelancers through our integrated, self-destructing secure messaging system.' },
              { icon: <ShieldCheck size={36} />, title: 'Automated Bidding', desc: 'Our smart proposal system handles negotiations and automatically denies competing bids when a contract is signed.' },
              { icon: <CreditCard size={36} />, title: 'Live Payment Tracking', desc: 'Track project milestones and process payments securely with our dedicated financial dashboard.' }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 1, y: 0 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10px' }}
                transition={{ duration: 0.4, delay: 0, ease: 'easeOut' }}
                className="card"
                style={{ padding: '40px 28px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', position: 'relative', overflow: 'hidden', transition: 'transform 0.3s ease' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-8px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'var(--accent)', filter: 'blur(80px)', opacity: 0.15, borderRadius: '50%' }} />
                <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(168,85,247,0.15))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', marginBottom: '28px', border: '1px solid rgba(168,85,247,0.3)' }}>
                  {feature.icon}
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px', margin: '0 0 12px' }}>{feature.title}</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0, fontSize: '14px', fontWeight: 500 }}>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '40px 24px', textAlign: 'center', background: 'var(--bg-card)' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0, fontWeight: 600 }}>© {new Date().getFullYear()} FreelanceHub. Premium MERN Marketplace.</p>
      </footer>

      {/* Responsive CSS */}
      <style>{`
        @media (max-width: 768px) {
          .home-desktop-nav { display: none !important; }
          .home-mobile-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
