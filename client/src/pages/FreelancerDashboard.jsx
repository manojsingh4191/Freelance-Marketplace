import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import useAuthStore from '../store/useAuthStore';

export default function FreelancerDashboard() {
  const [projects, setProjects] = useState([]);
  const [myProposals, setMyProposals] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('find'); // 'find' or 'mine'
  
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
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMyProposals = async () => {
    try {
      const res = await api.get('/proposals/me');
      setMyProposals(res.data);
    } catch (err) {
      console.error(err);
    }
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
      fetchMyProposals(); // refresh my proposals
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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Freelancer Dashboard</h1>
          <div className="flex bg-gray-200 rounded-lg p-1">
            <button 
              onClick={() => setActiveTab('find')} 
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'find' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Find Work
            </button>
            <button 
              onClick={() => setActiveTab('mine')} 
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'mine' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
            >
              My Proposals
            </button>
          </div>
        </div>

        {activeTab === 'find' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {projects.map((project) => (
              <div key={project._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-md transition-shadow">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                  <div className="flex items-center mt-1 mb-3 space-x-2 text-sm text-gray-500">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                      {project.client?.name || 'Unknown Client'}
                    </span>
                  </div>
                  <p className="text-gray-600 line-clamp-2 leading-relaxed">{project.description}</p>
                </div>
                <div className="flex flex-col items-start md:items-end w-full md:w-auto shrink-0 bg-gray-50 md:bg-transparent p-4 md:p-0 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Fixed Price Budget</div>
                  <div className="text-2xl font-bold text-green-600 mb-4">${project.budget}</div>
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="px-6 py-2.5 bg-purple-600 text-white rounded-lg shadow-sm hover:bg-purple-700 transition-colors font-medium w-full"
                  >
                    Submit Proposal
                  </button>
                </div>
              </div>
            ))}
            {projects.length === 0 && <div className="text-center py-12 text-gray-500">No jobs available right now.</div>}
          </div>
        )}

        {activeTab === 'mine' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
            {myProposals.map((proposal) => (
              <div key={proposal._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{proposal.project?.title}</h3>
                  <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-4">
                    <span className="text-gray-500 text-sm">Your bid: <span className="font-bold text-green-600">${proposal.bidAmount}</span></span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${(proposal.status === 'Denied' || proposal.status === 'denied') ? 'bg-red-100 text-red-700 font-bold' : proposal.status === 'Accepted' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {proposal.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-6 bg-gray-50 p-3 rounded-md italic">{proposal.coverLetter}</p>
                </div>
                
                {proposal.status === 'Accepted' && (
                  <button
                    onClick={() => navigate(`/messages`)}
                    className="w-full py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-semibold flex justify-center items-center shadow-md transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                    Go to Chat
                  </button>
                )}
              </div>
            ))}
            {myProposals.length === 0 && <div className="col-span-full text-center py-12 text-gray-500">You haven't submitted any proposals yet.</div>}
          </div>
        )}
      </div>

      {/* Apply Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            {submitSuccess ? (
              <div className="text-center py-10 animate-in zoom-in">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                  <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Proposal Submitted!</h3>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Submit Proposal</h2>
                  <button onClick={() => setSelectedProject(null)} className="text-gray-400 hover:text-gray-600 bg-gray-100 p-1 rounded-full">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </div>
                <form onSubmit={handleApply} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Bid Amount ($)</label>
                    <input required type="number" value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter</label>
                    <textarea required value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} rows="6" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"></textarea>
                  </div>
                  <div className="flex justify-end pt-4">
                    <button type="submit" className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-bold shadow-md transition-all">Submit Application</button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
