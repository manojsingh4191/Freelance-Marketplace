import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import api from '../utils/api';

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

  useEffect(() => {
    fetchMyProjects();
  }, []);

  const fetchMyProjects = async () => {
    try {
      const res = await api.get('/projects/me');
      setProjects(res.data);
    } catch (err) {
      console.error('Failed to fetch projects', err);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', { title, description, budget: Number(budget) });
      setShowModal(false);
      setTitle('');
      setDescription('');
      setBudget('');
      fetchMyProjects();
    } catch (err) {
      console.error('Failed to create project', err);
    }
  };

  const handleViewProposals = async (project) => {
    setViewingProject(project);
    try {
      const res = await api.get(`/proposals/project/${project._id}`);
      setProposals(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAcceptProposal = async (proposalId) => {
    try {
      await api.put(`/proposals/${proposalId}/accept`);
      handleViewProposals(viewingProject);
      fetchMyProjects();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition-colors font-medium"
          >
            + Post New Job
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{project.title}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{project.description}</p>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-green-600 font-bold">${project.budget}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${project.status === 'Open' ? 'bg-blue-100 text-blue-800' : project.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                    {project.status.toUpperCase()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleViewProposals(project)}
                className="w-full py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold"
              >
                View Proposals
              </button>
            </div>
          ))}
          {projects.length === 0 && (
             <div className="col-span-full text-center py-16 bg-white border border-gray-100 rounded-xl shadow-sm">
              <p className="text-lg font-medium text-gray-900">No projects yet</p>
              <p className="text-gray-500 mt-1">Get started by posting a new job.</p>
            </div>
          )}
        </div>
      </div>

      {/* Proposals Modal */}
      {viewingProject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6 sticky top-0 bg-white pt-2 pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Proposals for {viewingProject.title}</h2>
              </div>
              <button onClick={() => setViewingProject(null)} className="text-gray-400 hover:text-gray-600 bg-gray-100 p-1 rounded-full">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <div className="space-y-4 mt-4">
              {proposals.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No proposals received yet.</p>
              ) : (
                proposals.map(proposal => (
                  <div key={proposal._id} className="border border-gray-200 rounded-xl p-5 hover:border-indigo-300 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-lg text-gray-900">{proposal.freelancer?.name || 'Unknown'}</h4>
                        <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${proposal.status === 'Accepted' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                          {proposal.status}
                        </span>
                      </div>
                      <div className="text-xl font-bold text-green-600">${proposal.bidAmount}</div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 bg-gray-50 p-4 rounded-lg italic border border-gray-100">{proposal.coverLetter}</p>
                    
                    {proposal.status === 'Pending' && viewingProject.status === 'Open' && (
                      <div className="flex justify-end">
                        <button 
                          onClick={() => handleAcceptProposal(proposal._id)}
                          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium shadow-sm transition-colors"
                        >
                          Accept Proposal
                        </button>
                      </div>
                    )}

                    {proposal.status === 'Accepted' && (
                      <div className="flex justify-end space-x-3 mt-4 border-t border-gray-100 pt-4">
                        <button
                          onClick={() => navigate(`/messages`)}
                          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium flex items-center transition-colors shadow-sm"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                          Chat
                        </button>
                        <button
                          onClick={() => navigate(`/pay/${viewingProject._id}`)}
                          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium flex items-center transition-colors shadow-sm"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                          Fund Project
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
             <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Post a Job</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <form onSubmit={handleCreateProject} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows="4" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Budget ($)</label>
                <input required type="number" value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" />
              </div>
              <div className="flex justify-end pt-4">
                <button type="submit" className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold shadow-md transition-all">Publish Job</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
