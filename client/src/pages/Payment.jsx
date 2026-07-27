import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function Payment() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate Stripe payment
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      setTimeout(() => {
        navigate('/client-dashboard');
      }, 3000);
    }, 2000);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-indigo-600 p-8 text-center relative overflow-hidden">
           <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
           <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
          <h2 className="text-3xl font-extrabold text-white mb-2 relative z-10">Fund Escrow</h2>
          <p className="text-indigo-200 text-sm relative z-10">Secure checkout powered by Stripe (Mock)</p>
        </div>
        
        {isSuccess ? (
          <div className="p-10 text-center animate-in zoom-in duration-300">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Payment Successful!</h3>
            <p className="text-gray-500 mb-8">Funds have been placed securely in escrow for the freelancer.</p>
            <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
               <div className="bg-green-500 h-full w-full animate-pulse"></div>
            </div>
            <p className="text-xs text-gray-400 mt-4">Redirecting to dashboard...</p>
          </div>
        ) : (
          <div className="p-8">
            <form onSubmit={handlePayment} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Information</label>
                <div className="p-3.5 border border-gray-200 rounded-xl bg-gray-50 flex items-center focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all">
                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                  <input type="text" className="w-full bg-transparent focus:outline-none text-gray-900 placeholder-gray-400" placeholder="4242 4242 4242 4242" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                  <input type="text" className="w-full px-4 py-3.5 border border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-gray-900 placeholder-gray-400" placeholder="MM/YY" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CVC</label>
                  <input type="text" className="w-full px-4 py-3.5 border border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-gray-900 placeholder-gray-400" placeholder="123" required />
                </div>
              </div>
              <div className="pt-6 mt-6">
                <button 
                  type="submit" 
                  disabled={isProcessing}
                  className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 hover:shadow-indigo-600/40 transform hover:-translate-y-0.5 transition-all flex justify-center items-center"
                >
                  {isProcessing ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : 'Pay Now'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
