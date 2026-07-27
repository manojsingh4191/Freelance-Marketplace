import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, DollarSign, User, Send, MessageSquare, X, CheckCircle, Clock, XCircle, Search } from 'lucide-react';
import api from '../utils/api';
import useAuthStore from '../store/useAuthStore';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
  }
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.2 } }
};

function StatusBadge({ status }) {
  const map = {
    Accepted: { cls: 'badge-accepted', icon: <CheckCircle size={12} />, label: 'Accepted' },
    Pending:  { cls: 'badge-pending',  icon: <Clock size={12} />,        label: 'Pending' },
    Denied:   { cls: 'badge-denied',   icon: <XCircle size={12} />,      label: 'Denied' },
    denied:   { cls: 'badge-denied',   icon: <XCircle size={12} />,      label: 'Denied' },
    Rejected: { cls: 'badge-denied',   icon: <XCircle size={12} />,      label: 'Rejected' },
  };
  const cfg = map[status] || map.Pending;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.cls}`}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

export default function FreelancerDashboard() {
  const [projects, setProjects] = useState([]);
  const [myProposals, setMyProposals] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('find');
  const [search, setSearch] = useState('');
  
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOpenProjects();
    fetchMyProposals();
  }, []);

  const fetchOpenProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchMyProposals = async () => {
    try {
      const res = await api.get('/proposals/me');
      setMyProposals(res.data);
    } catch (err) { console.error(err); }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      await api.post('/proposals', {
        project: selectedProject._id,
        coverLetter,
        bidAmount: Number(bidAmount)
      });
      setSubmitSuccess(true);
      fetchMyProposals();
      setTimeout(() => {
        setSelectedProject(null);
        setSubmitSuccess(false);
        setCoverLetter('');
        setBidAmount('');
      }, 2000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit proposal');
    }
  };

  const filteredProjects = projects.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', padding: '24px', background: 'var(--bg-primary)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: '32px' }}
        >
          <h1 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px', fontFamily: 'Outfit, sans-serif' }}>
            Freelancer Hub
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            Welcome back, <strong style={{ color: 'var(--text-primary)' }}>{user?.name}</strong> — discover your next opportunity.
          </p>
        </motion.div>

        {/* Tab Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
          <div className="tab-bar">
            <button className={`tab-btn ${activeTab === 'find' ? 'active' : ''}`} onClick={() => setActiveTab('find')}>
              🔍 Find Work
            </button>
            <button className={`tab-btn ${activeTab === 'mine' ? 'active' : ''}`} onClick={() => setActiveTab('mine')}>
              📋 My Proposals
              {myProposals.length > 0 && (
                <span style={{ marginLeft: '8px', background: 'rgba(168,85,247,0.25)', color: 'var(--accent)', borderRadius: '999px', padding: '0 6px', fontSize: '11px', fontWeight: 700 }}>
                  {myProposals.length}
                </span>
              )}
            </button>
          </div>

          {activeTab === 'find' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={14} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search projects..."
                style={{
                  paddingLeft: '34px', paddingRight: '14px', paddingTop: '8px', paddingBottom: '8px',
                  background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                  borderRadius: '10px', color: 'var(--text-primary)', fontSize: '13px', outline: 'none', width: '200px'
                }}
              />
            </motion.div>
          )}
        </div>

        {/* FIND WORK TAB */}
        <AnimatePresence mode="wait">
          {activeTab === 'find' && (
            <motion.div
              key="find"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}
            >
              {filteredProjects.map((project) => (
                <motion.div
                  key={project._id}
                  variants={cardVariants}
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.99 }}
                  className="card"
                  style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px', cursor: 'default' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, lineHeight: 1.4 }}>
                      {project.title}
                    </h3>
                    <span style={{
                      background: 'rgba(16,185,129,0.15)', color: '#10b981',
                      border: '1px solid rgba(16,185,129,0.3)', borderRadius: '999px',
                      padding: '3px 10px', fontSize: '11px', fontWeight: 700, whiteSpace: 'nowrap', marginLeft: '8px'
                    }}>
                      Open
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '12px' }}>
                    <User size={12} />
                    <span>{project.client?.name || 'Client'}</span>
                  </div>

                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0,
                    display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {project.description}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px',
                    borderTop: '1px solid var(--border-color)', marginTop: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <DollarSign size={16} style={{ color: '#10b981' }} />
                      <span style={{ fontSize: '20px', fontWeight: 800, color: '#10b981' }}>{project.budget}</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedProject(project)}
                      className="btn-primary btn-glow-pulse"
                      style={{ padding: '8px 18px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Send size={13} />
                      Apply
                    </motion.button>
                  </div>
                </motion.div>
              ))}
              {filteredProjects.length === 0 && (
                <motion.div variants={cardVariants} style={{ gridColumn: '1/-1', textAlign: 'center', padding: '64px 0', color: 'var(--text-muted)' }}>
                  <Briefcase size={40} style={{ margin: '0 auto 16px', opacity: 0.4, display: 'block' }} />
                  <p style={{ fontSize: '16px' }}>No projects found. Try a different search.</p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* MY PROPOSALS TAB */}
          {activeTab === 'mine' && (
            <motion.div
              key="mine"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}
            >
              {myProposals.map((proposal) => (
                <motion.div
                  key={proposal._id}
                  variants={cardVariants}
                  whileHover={{ scale: 1.015, y: -3 }}
                  className="card"
                  style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, lineHeight: 1.4 }}>
                      {proposal.project?.title}
                    </h3>
                    <StatusBadge status={proposal.status} />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <DollarSign size={14} style={{ color: '#10b981' }} />
                    <span style={{ fontWeight: 700, fontSize: '18px', color: '#10b981' }}>{proposal.bidAmount}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>your bid</span>
                  </div>

                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0,
                    fontStyle: 'italic', background: 'rgba(255,255,255,0.04)', padding: '10px 12px', borderRadius: '8px',
                    border: '1px solid var(--border-color)', display: '-webkit-box', WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    "{proposal.coverLetter}"
                  </p>

                  {proposal.status === 'Accepted' && (
                    <motion.button
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                      onClick={() => navigate('/messages')}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 600,
                        fontSize: '13px', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                        color: 'white', boxShadow: '0 4px 15px rgba(79,70,229,0.4)'
                      }}
                    >
                      <MessageSquare size={14} /> Go to Chat
                    </motion.button>
                  )}
                </motion.div>
              ))}
              {myProposals.length === 0 && (
                <motion.div variants={cardVariants} style={{ gridColumn: '1/-1', textAlign: 'center', padding: '64px 0', color: 'var(--text-muted)' }}>
                  <Send size={40} style={{ margin: '0 auto 16px', opacity: 0.4, display: 'block' }} />
                  <p style={{ fontSize: '16px' }}>You haven't submitted any proposals yet.</p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Apply Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 200 }}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden" animate="visible" exit="exit"
              className="card"
              style={{ width: '100%', maxWidth: '500px', padding: '32px', background: 'var(--bg-secondary)' }}
            >
              {submitSuccess ? (
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16,185,129,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}
                  >
                    <CheckCircle size={40} color="#10b981" />
                  </motion.div>
                  <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>Proposal Sent!</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Your application is under review.</p>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                    <div>
                      <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px' }}>Apply for Project</h2>
                      <p style={{ color: 'var(--accent)', fontSize: '13px', margin: 0, fontWeight: 600 }}>{selectedProject.title}</p>
                    </div>
                    <button onClick={() => setSelectedProject(null)}
                      style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid var(--border-color)',
                        borderRadius: '8px', padding: '6px', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}>
                      <X size={16} />
                    </button>
                  </div>

                  <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Your Bid ($)
                      </label>
                      <input
                        required type="number" value={bidAmount} onChange={e => setBidAmount(e.target.value)}
                        placeholder={`Budget: $${selectedProject.budget}`}
                        style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                          borderRadius: '10px', color: 'var(--text-primary)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Cover Letter
                      </label>
                      <textarea
                        required value={coverLetter} onChange={e => setCoverLetter(e.target.value)} rows={5}
                        placeholder="Tell the client why you're the perfect fit..."
                        style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                          borderRadius: '10px', color: 'var(--text-primary)', fontSize: '13px', outline: 'none', resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.6 }}
                      />
                    </div>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="btn-primary btn-glow-pulse"
                      style={{ width: '100%', padding: '12px', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '4px' }}
                    >
                      <Send size={15} /> Submit Proposal
                    </motion.button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
