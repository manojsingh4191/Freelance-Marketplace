import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Briefcase, DollarSign, MessageSquare, CreditCard, CheckCircle, X, User } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import api from '../utils/api';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.2 } }
};

export default function ClientDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [viewingProject, setViewingProject] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentProposal, setPaymentProposal] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => { fetchMyProjects(); }, []);

  const fetchMyProjects = async () => {
    try {
      const res = await api.get('/projects/me');
      setProjects(res.data);
    } catch (err) { console.error('Failed to fetch projects', err); }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', { title, description, budget: Number(budget) });
      setShowModal(false);
      setTitle(''); setDescription(''); setBudget('');
      fetchMyProjects();
    } catch (err) { console.error('Failed to create project', err); }
  };

  const handleViewProposals = async (project) => {
    setViewingProject(project);
    try {
      const res = await api.get(`/proposals/project/${project._id}`);
      setProposals(res.data);
    } catch (err) { console.error(err); }
  };

  const handleAcceptProposal = async (proposalId) => {
    try {
      await api.put(`/proposals/${proposalId}/accept`);
      handleViewProposals(viewingProject);
      fetchMyProjects();
    } catch (err) { console.error(err); }
  };

  const handleProcessPayment = async () => {
    setIsProcessing(true);
    try {
      await api.post('/payments/pay', {
        projectId: viewingProject._id,
        paymentMethod: 'Credit Card'
      });
      setPaymentSuccess(true);
      setTimeout(() => {
        setShowPaymentModal(false);
        setPaymentSuccess(false);
        setPaymentProposal(null);
        handleViewProposals(viewingProject);
        fetchMyProjects();
      }, 2000);
    } catch (err) {
      console.error(err);
      alert('Payment failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsProcessing(false);
    }
  };

  const statusColors = {
    Open: { bg: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: 'rgba(59,130,246,0.3)' },
    'In Progress': { bg: 'rgba(234,179,8,0.15)', color: '#fbbf24', border: 'rgba(234,179,8,0.3)' },
    Completed: { bg: 'rgba(16,185,129,0.15)', color: '#10b981', border: 'rgba(16,185,129,0.3)' },
  };

  return (
    <div style={{ minHeight: '100vh', padding: '24px', background: 'var(--bg-primary)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}
        >
          <div>
            <h1 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '4px', fontFamily: 'Outfit, sans-serif' }}>
              My Projects
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Manage your job postings and review proposals from top freelancers.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
            onClick={() => setShowModal(true)}
            className="btn-primary btn-glow-pulse"
            style={{ padding: '12px 22px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={16} /> Post New Job
          </motion.button>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants} initial="hidden" animate="visible"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}
        >
          {projects.map((project) => {
            const sc = statusColors[project.status] || statusColors.Open;
            return (
              <motion.div
                key={project._id}
                variants={cardVariants}
                whileHover={{ scale: 1.02, y: -4 }}
                className="card"
                style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, lineHeight: 1.4 }}>
                    {project.title}
                  </h3>
                  <span style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`,
                    borderRadius: '999px', padding: '3px 10px', fontSize: '11px', fontWeight: 700, whiteSpace: 'nowrap', marginLeft: '8px' }}>
                    {project.status}
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0,
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {project.description}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  paddingTop: '12px', borderTop: '1px solid var(--border-color)', marginTop: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <DollarSign size={16} style={{ color: '#10b981' }} />
                    <span style={{ fontSize: '20px', fontWeight: 800, color: '#10b981' }}>{project.budget}</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                    onClick={() => handleViewProposals(project)}
                    style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)',
                      background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', fontSize: '13px',
                      cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <User size={13} /> View Proposals
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
          {projects.length === 0 && (
            <motion.div variants={cardVariants} style={{ gridColumn: '1/-1', textAlign: 'center', padding: '64px 0', color: 'var(--text-muted)' }}>
              <Briefcase size={48} style={{ margin: '0 auto 16px', opacity: 0.3, display: 'block' }} />
              <p style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>No projects yet</p>
              <p style={{ fontSize: '14px' }}>Click "Post New Job" to get started.</p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Proposals Modal */}
      <AnimatePresence>
        {viewingProject && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 200 }}
          >
            <motion.div
              variants={modalVariants} initial="hidden" animate="visible" exit="exit"
              className="card"
              style={{ width: '100%', maxWidth: '680px', padding: '32px', background: 'var(--bg-secondary)',
                maxHeight: '85vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px' }}>
                    Proposals
                  </h2>
                  <p style={{ color: 'var(--accent)', fontSize: '13px', fontWeight: 600, margin: 0 }}>{viewingProject.title}</p>
                </div>
                <button onClick={() => setViewingProject(null)}
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid var(--border-color)',
                    borderRadius: '8px', padding: '6px', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}>
                  <X size={16} />
                </button>
              </div>

              {proposals.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                  <p>No proposals received yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {proposals.map(proposal => (
                    <motion.div key={proposal._id}
                      initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                      className="card"
                      style={{ padding: '20px', gap: '12px', display: 'flex', flexDirection: 'column' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ color: 'white', fontSize: '14px', fontWeight: 700 }}>
                              {(proposal.freelancer?.name || 'F')[0].toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h4 style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)', margin: 0 }}>
                              {proposal.freelancer?.name || 'Unknown'}
                            </h4>
                            <span style={{
                              fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '999px',
                              background: proposal.status === 'Accepted' ? 'rgba(16,185,129,0.15)' : proposal.status === 'Denied' ? 'rgba(239,68,68,0.15)' : 'rgba(234,179,8,0.15)',
                              color: proposal.status === 'Accepted' ? '#10b981' : proposal.status === 'Denied' ? '#f87171' : '#fbbf24',
                              border: `1px solid ${proposal.status === 'Accepted' ? 'rgba(16,185,129,0.3)' : proposal.status === 'Denied' ? 'rgba(239,68,68,0.3)' : 'rgba(234,179,8,0.3)'}`
                            }}>
                              {proposal.status}
                            </span>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                            <DollarSign size={14} style={{ color: '#10b981' }} />
                            <span style={{ fontSize: '20px', fontWeight: 800, color: '#10b981' }}>{proposal.bidAmount}</span>
                          </div>
                        </div>
                      </div>

                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0,
                        fontStyle: 'italic', background: 'rgba(255,255,255,0.04)', padding: '10px 12px',
                        borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        "{proposal.coverLetter}"
                      </p>

                      {proposal.status === 'Pending' && viewingProject.status === 'Open' && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <motion.button
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                            onClick={() => handleAcceptProposal(proposal._id)}
                            className="btn-primary btn-accept"
                            style={{ padding: '8px 18px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                          >
                            <CheckCircle size={14} /> Accept Proposal
                          </motion.button>
                        </div>
                      )}

                      {proposal.status === 'Accepted' && (
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                          <motion.button
                            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                            onClick={() => navigate('/messages')}
                            className="btn-primary"
                            style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                          >
                            <MessageSquare size={13} /> Chat
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                            onClick={() => { setPaymentProposal(proposal); setShowPaymentModal(true); setPaymentSuccess(false); }}
                            className="btn-primary btn-accept"
                            style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                          >
                            <CreditCard size={13} /> Fund Project
                          </motion.button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Project Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 200 }}
          >
            <motion.div
              variants={modalVariants} initial="hidden" animate="visible" exit="exit"
              className="card"
              style={{ width: '100%', maxWidth: '460px', padding: '32px', background: 'var(--bg-secondary)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px' }}>Post a Job</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}>Attract top freelancers</p>
                </div>
                <button onClick={() => setShowModal(false)}
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid var(--border-color)',
                    borderRadius: '8px', padding: '6px', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}>
                  <X size={16} />
                </button>
              </div>
              <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { label: 'Job Title', value: title, setter: setTitle, type: 'text', placeholder: 'e.g. React Developer for E-Commerce' },
                  { label: 'Budget ($)', value: budget, setter: setBudget, type: 'number', placeholder: 'e.g. 500' },
                ].map(field => (
                  <div key={field.label}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)',
                      marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {field.label}
                    </label>
                    <input required type={field.type} value={field.value} onChange={e => field.setter(e.target.value)}
                      placeholder={field.placeholder}
                      style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-card)',
                        border: '1px solid var(--border-color)', borderRadius: '10px', color: 'var(--text-primary)',
                        fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                ))}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)',
                    marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Description
                  </label>
                  <textarea required value={description} onChange={e => setDescription(e.target.value)} rows={4}
                    placeholder="Describe the project scope, requirements, and deliverables..."
                    style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)', borderRadius: '10px', color: 'var(--text-primary)',
                      fontSize: '13px', outline: 'none', resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.6 }} />
                </div>
                <motion.button type="submit"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="btn-primary btn-glow-pulse"
                  style={{ width: '100%', padding: '12px', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '4px' }}>
                  <Plus size={16} /> Publish Job
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showPaymentModal && paymentProposal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 300 }}
          >
            <motion.div
              variants={modalVariants} initial="hidden" animate="visible" exit="exit"
              className="card"
              style={{ width: '100%', maxWidth: '440px', padding: '32px', background: 'var(--bg-secondary)', textAlign: 'center' }}
            >
              {paymentSuccess ? (
                <div style={{ padding: '24px 0' }}>
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16,185,129,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}
                  >
                    <CheckCircle size={40} color="#10b981" />
                  </motion.div>
                  <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>Payment Successful!</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Funds have been secured for this project.</p>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={() => setShowPaymentModal(false)}
                      style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid var(--border-color)',
                        borderRadius: '8px', padding: '6px', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}>
                      <X size={16} />
                    </button>
                  </div>
                  
                  <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'linear-gradient(135deg, #10b981, #059669)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(16,185,129,0.4)' }}>
                    <CreditCard size={32} color="white" />
                  </div>
                  
                  <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px' }}>Checkout</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>Securely fund <strong>{viewingProject?.title}</strong></p>
                  
                  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--text-secondary)' }}>
                      <span>Freelancer</span>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{paymentProposal.freelancer?.name}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--text-secondary)' }}>
                      <span>Project Original Budget</span>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>${viewingProject?.budget}</span>
                    </div>
                    <div style={{ height: '1px', background: 'var(--border-color)' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>Agreed Amount:</span>
                      <span style={{ fontSize: '24px', fontWeight: 900, color: '#10b981' }}>${paymentProposal.bidAmount}</span>
                    </div>
                  </div>
                  
                  <motion.button
                    onClick={handleProcessPayment}
                    disabled={isProcessing}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="btn-primary btn-accept"
                    style={{ width: '100%', padding: '14px', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: isProcessing ? 0.7 : 1 }}
                  >
                    {isProcessing ? 'Processing...' : (
                      <>
                        <CreditCard size={18} /> Confirm Payment
                      </>
                    )}
                  </motion.button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
