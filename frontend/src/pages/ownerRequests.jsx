import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, User, Mail, IndianRupee, MessageSquare, CheckCircle, XCircle, Inbox, ArrowRightLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const OwnerRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Tracks the counter-offer prices typed into the input fields
  const [counterPrices, setCounterPrices] = useState({});
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/requests/owner`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(response.data);
    } catch (err) {
      toast.error('Failed to load incoming requests');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus, newPrice = null) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/requests/${id}/status`,
        { status: newStatus, newPrice: Number(newPrice) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success(newStatus === 'Negotiating' ? 'Counter-offer sent!' : `Request ${newStatus.toLowerCase()}!`);
      
      setCounterPrices({ ...counterPrices, [id]: '' });
      fetchRequests(); 
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update request');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'Negotiating': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Incoming Requests</h1>
      <p className="text-gray-500 mb-8">Review, negotiate, and manage lease applications.</p>

      {loading ? (
        <div className="text-gray-500 py-10">Loading requests...</div>
      ) : requests.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Your inbox is empty</h3>
          <p className="text-gray-500 mt-1">When renters apply for your warehouses, they will appear here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {requests.map((req) => {
            // THE STATE MACHINE LOGIC
            const isActive = req.status === 'Pending' || req.status === 'Negotiating';
            const isMyTurn = req.actionRequiredBy === 'owner';

            return (
              <div key={req._id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900">{req.space?.title || 'Deleted Property'}</h3>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getStatusColor(req.status)}`}>
                    {req.status}
                  </span>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Applicant Info</h4>
                    <div className="flex items-center gap-3 text-gray-700">
                      <User className="w-5 h-5 text-gray-400" />
                      <span className="font-medium">{req.renter?.name || 'Unknown User'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span>{req.renter?.email || 'No email provided'}</span>
                    </div>
                    {req.renterNotes && (
                      <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start gap-2 text-blue-800">
                        <MessageSquare className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <p className="text-sm italic">"{req.renterNotes}"</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Lease Details</h4>
                    <div className="flex items-center gap-3 text-gray-700">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span>{new Date(req.startDate).toLocaleDateString()} to {new Date(req.endDate).toLocaleDateString()}</span>
                    </div>
                    
                    {/* The Negotiated Price Block */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mt-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-500">Original Price:</span>
                        <span className="text-sm text-gray-500 line-through flex items-center">
                          <IndianRupee className="w-3 h-3" /> {req.totalPrice?.toLocaleString() || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-900">Current Offer:</span>
                        <span className="text-xl font-bold text-blue-700 flex items-center">
                          <IndianRupee className="w-5 h-5 mr-0.5" /> 
                          {req.negotiatedPrice?.toLocaleString() || req.totalPrice?.toLocaleString() || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* THE PING-PONG UI LOGIC */}
                {isActive && isMyTurn ? (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    
                    {/* The Counter Offer Input */}
                    <div className="flex w-full sm:w-auto">
                      <input 
                        type="number" 
                        placeholder="Counter offer..." 
                        value={counterPrices[req._id] || ''}
                        onChange={(e) => setCounterPrices({...counterPrices, [req._id]: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-32"
                      />
                      <button 
                        onClick={() => handleStatusUpdate(req._id, 'Negotiating', counterPrices[req._id])}
                        disabled={!counterPrices[req._id]}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-r-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-1"
                      >
                        <ArrowRightLeft className="w-4 h-4" /> Counter
                      </button>
                    </div>

                    {/* Accept / Reject Buttons */}
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button 
                        onClick={() => handleStatusUpdate(req._id, 'Rejected')}
                        className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-4 py-2 text-red-700 bg-red-50 hover:bg-red-100 rounded-lg font-medium transition-colors"
                      >
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(req._id, 'Approved')}
                        className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors shadow-sm"
                      >
                        <CheckCircle className="w-4 h-4" /> Accept Offer
                      </button>
                    </div>
                  </div>
                ) : isActive && !isMyTurn ? (
                  <div className="px-6 py-4 bg-yellow-50 border-t border-yellow-100 text-yellow-800 text-center font-medium text-sm">
                    Waiting for renter to review your counter-offer...
                  </div>
                ) : null}

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OwnerRequests;