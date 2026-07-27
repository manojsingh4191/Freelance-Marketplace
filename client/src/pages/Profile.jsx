import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Settings, Moon, Sun, Layers, User, Lock } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import api from '../utils/api';
import { useTheme } from '../context/ThemeContext';

export default function Profile() {
  const { user } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('history');
  const [payments, setPayments] = useState([]);
  const [profileName, setProfileName] = useState(user?.name || '');

  useEffect(() => {
    if (activeTab === 'history') {
      fetchPayments();
    }
  }, [activeTab]);

  const fetchPayments = async () => {
    try {
      const res = await api.get('/payments/history');
      setPayments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    alert('Profile updated! (Mock)');
  };

  const themes = [
    { key: 'dark', icon: <Moon size={24} />, label: 'Dark Mode' },
    { key: 'glass', icon: <Layers size={24} />, label: 'Glassmorphism' },
    { key: 'light', icon: <Sun size={24} />, label: 'Light Mode' },
  ];

  return (
    <div style={{ minHeight: '100vh', padding: '32px 24px', background: 'var(--bg-primary)' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
        
        {/* Sidebar */}
        <div style={{ width: '250px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '24px', color: 'var(--text-primary)' }}>My Profile</h2>
          
          {[
            { id: 'history', icon: <CreditCard size={18} />, label: 'Payment History' },
            { id: 'settings', icon: <Settings size={18} />, label: 'Account Settings' },
            { id: 'preferences', icon: <Layers size={18} />, label: 'Preferences' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '14px 18px', borderRadius: '12px', textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer',
                background: activeTab === tab.id ? 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(168,85,247,0.15))' : 'transparent',
                color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-secondary)',
                border: activeTab === tab.id ? '1px solid rgba(168,85,247,0.3)' : '1px solid transparent',
                fontWeight: 600, transition: 'all 0.2s ease'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <AnimatePresence mode="wait">
            
            {activeTab === 'history' && (
              <motion.div key="history" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="card" style={{ padding: '40px' }}>
                <h3 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '32px' }}>Transaction History</h3>
                
                {payments.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                    <CreditCard size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                    <p style={{ fontSize: '16px' }}>No completed payments yet.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {payments.map(payment => (
                      <div key={payment._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', transition: 'transform 0.2s ease', cursor: 'default' }}
                           onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                           onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}>
                        <div>
                          <p style={{ fontWeight: 800, fontSize: '16px', color: 'var(--text-primary)', margin: '0 0 6px 0' }}>{payment.project?.title || 'Unknown Project'}</p>
                          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <User size={12} />
                            {user._id === payment.client?._id ? `Paid to: ${payment.freelancer?.name}` : `Received from: ${payment.client?.name}`}
                            <span style={{ opacity: 0.5 }}>•</span>
                            {new Date(payment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontWeight: 800, fontSize: '22px', color: '#10b981', margin: '0 0 6px 0' }}>${payment.amount}</p>
                          <span style={{ fontSize: '11px', background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '4px 10px', borderRadius: '999px', fontWeight: 700 }}>{payment.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div key="settings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="card" style={{ padding: '40px' }}>
                <h3 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '32px' }}>Account Settings</h3>
                
                <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '440px' }}>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '10px' }}>
                      <User size={16} /> Full Name
                    </label>
                    <input type="text" value={profileName} onChange={e => setProfileName(e.target.value)} style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none', fontSize: '15px' }} />
                  </div>
                  
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '10px' }}>
                      <Lock size={16} /> New Password
                    </label>
                    <input type="password" placeholder="Enter new password..." style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none', fontSize: '15px' }} />
                  </div>

                  <button className="btn-primary" style={{ padding: '14px', width: 'fit-content', borderRadius: '12px', fontSize: '15px', marginTop: '8px' }}>Save Changes</button>
                </form>
              </motion.div>
            )}

            {activeTab === 'preferences' && (
              <motion.div key="preferences" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="card" style={{ padding: '40px' }}>
                <h3 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '32px' }}>UI Preferences</h3>
                
                <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontWeight: 600 }}>Select Global Theme</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '20px' }}>
                  {themes.map(t => (
                    <button
                      key={t.key}
                      onClick={() => setTheme(t.key)}
                      style={{
                        padding: '32px 16px', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', cursor: 'pointer',
                        background: theme === t.key ? 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(168,85,247,0.15))' : 'var(--bg-primary)',
                        border: theme === t.key ? '2px solid var(--accent)' : '2px solid var(--border-color)',
                        color: theme === t.key ? 'var(--text-primary)' : 'var(--text-secondary)',
                        transition: 'all 0.2s ease', boxShadow: theme === t.key ? '0 8px 30px rgba(124,58,237,0.2)' : 'none'
                      }}
                    >
                      <div style={{ color: theme === t.key ? 'var(--accent)' : 'currentColor' }}>{t.icon}</div>
                      <span style={{ fontWeight: 700, fontSize: '15px' }}>{t.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
