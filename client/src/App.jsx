import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ClientDashboard from './pages/ClientDashboard';
import FreelancerDashboard from './pages/FreelancerDashboard';
import Messages from './pages/Messages';
import Payment from './pages/Payment';
import Navbar from './components/Navbar';
import Profile from './pages/Profile';
import useAuthStore from './store/useAuthStore';
import { ThemeProvider } from './context/ThemeContext';

function ProtectedRoute({ children, role }) {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" replace />;
  
  if (role && user.role !== role) {
    if (user.role === 'Client') return <Navigate to="/client-dashboard" replace />;
    if (user.role === 'Freelancer') return <Navigate to="/freelancer-dashboard" replace />;
    return <Navigate to="/login" replace />;
  }
  return (
    <>
      <Navbar />
      <div className="page-content">
        {children}
      </div>
    </>
  );
}

export default function App() {
  const { user } = useAuthStore();

  return (
    <ThemeProvider>
      <div className="glass-bg" />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          
          {/* Dashboards */}
          <Route path="/client-dashboard" element={
            <ProtectedRoute role="Client">
              <ClientDashboard />
            </ProtectedRoute>
          } />
          <Route path="/freelancer-dashboard" element={
            <ProtectedRoute role="Freelancer">
              <FreelancerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/messages" element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          } />
          <Route path="/pay/:projectId" element={
            <ProtectedRoute role="Client">
              <Payment />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          {/* Redirect root based on user role */}
          <Route path="/" element={
            user ? (
              user.role === 'Client' ? <Navigate to="/client-dashboard" replace /> :
              user.role === 'Freelancer' ? <Navigate to="/freelancer-dashboard" replace /> :
              <Navigate to="/login" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          } />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
