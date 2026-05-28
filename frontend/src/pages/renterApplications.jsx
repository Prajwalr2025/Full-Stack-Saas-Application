import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, MapPin, Clock, IndianRupee, ArrowRightLeft, CheckCircle, XCircle, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

const RenterApplications = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [counterPrices, setCounterPrices] = useState({});
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/requests/renter`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(response.data);
    } catch (err) {
      toast.error('Failed to load your applications');
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
      
      toast.success(newStatus === 'Negotiating' ? 'Counter-offer sent!' : `Offer ${newStatus.toLowerCase()}!`);
      setCounterPrices({ ...counterPrices, [id]: '' });
      fetchRequests(); 
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update request');
    }
  };

  // NEW: The Razorpay Checkout Integration
  const handlePayment = async (req) => {
    try {
      // 1. Tell the backend to create an official Order ID
      const orderRes = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payments/create-order`,
        { requestId: req._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 2. Configure the Razorpay popup window
      const options = {
        key: 'rzp_test_Suk2hWYVnbXvAQ', // IMPORTANT: Put a real test key here if you want the popup to render!
        amount: orderRes.data.amount,
        currency: orderRes.data.currency,
        name: 'WareSaaS Platform',
        description: `Lease payment for ${req.space?.title}`,
        order_id: orderRes.data.id,
        handler: async function (response) {
          try {
            // 3. When payment succeeds, tell the backend to verify and update the status to "Paid"
            await axios.post(
              `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payments/verify`,
              {
                requestId: req._id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Payment successful! Your lease is secured.');
            fetchRequests(); 
          } catch (err) {
            toast.error('Payment verification failed');
          }
        },
        theme: {
          color: '#2563EB' // Matches our Tailwind blue-600
        }
      };

      // 4. Open the window
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      toast.error('Failed to initialize payment gateway. Check your console.');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Paid': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'Negotiating': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
      <p className="text-gray-500 mb-8">Track and negotiate your warehouse lease requests.</p>

      {loading ? (
        <div className="text-gray-500 py-10">Loading your applications...</div>
      ) : requests.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No applications yet</h3>
          <p className="text-gray-500 mt-1">Head over to the marketplace to find a space.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {requests.map((req) => {
            const isActive = req.status === 'Pending' || req.status === 'Negotiating';
            const isMyTurn = req.actionRequiredBy === 'renter';

            return (
              <div key={req._id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                  
                  <div className="flex items-center gap-6 flex-1">
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {req.space?.imageUrl ? (
                        <img src={req.space.imageUrl} alt="space" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                      )}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold text-gray-900">{req.space?.title || 'Warehouse Deleted'}</h3>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded border ${getStatusColor(req.status)}`}>
                          {req.status}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm flex items-center gap-1 mb-2">
                        <MapPin className="w-4 h-4" /> {req.space?.location}
                      </p>
                      <p className="text-gray-600 text-sm flex items-center gap-1">
                        <Calendar className="w-4 h-4" /> 
                        {new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="text-right bg-gray-50 p-4 rounded-lg border border-gray-100 min-w-[200px]">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-500">Original Price</span>
                      <span className="text-xs text-gray-500 line-through flex items-center">
                        <IndianRupee className="w-3 h-3" />{req.totalPrice?.toLocaleString() || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2 border-t border-gray-200 pt-2">
                      <span className="text-sm font-bold text-gray-900">Final Price</span>
                      <p className="text-xl font-bold text-blue-700 flex items-center justify-end">
                        <IndianRupee className="w-5 h-5 mr-0.5" />
                        {req.negotiatedPrice?.toLocaleString() || req.totalPrice?.toLocaleString() || 0}
                      </p>
                    </div>
                  </div>
                </div>

                {/* THE ACTION BAR */}
                {isActive && isMyTurn ? (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="flex w-full sm:w-auto">
                      <input 
                        type="number" 
                        placeholder="Counter offer..." 
                        value={counterPrices[req._id] || ''}
                        onChange={(e) => setCounterPrices({...counterPrices, [req._id]: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-32 text-sm"
                      />
                      <button 
                        onClick={() => handleStatusUpdate(req._id, 'Negotiating', counterPrices[req._id])}
                        disabled={!counterPrices[req._id]}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-r-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-1"
                      >
                        <ArrowRightLeft className="w-4 h-4" /> Counter
                      </button>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button 
                        onClick={() => handleStatusUpdate(req._id, 'Rejected')}
                        className="flex-1 sm:flex-none flex justify-center items-center gap-1 px-4 py-2 text-red-700 bg-red-50 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors"
                      >
                        <XCircle className="w-4 h-4" /> Withdraw
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(req._id, 'Approved')}
                        className="flex-1 sm:flex-none flex justify-center items-center gap-1 px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors shadow-sm"
                      >
                        <CheckCircle className="w-4 h-4" /> Accept Offer
                      </button>
                    </div>
                  </div>
                ) : isActive && !isMyTurn ? (
                  <div className="px-6 py-4 bg-blue-50 border-t border-blue-100 text-blue-800 text-center font-medium text-sm">
                    Waiting for the owner to review your request...
                  </div>
                ) : null}

                {/* THE PAYMENT BUTTON (Only shows if Approved!) */}
                {req.status === 'Approved' && (
                  <div className="px-6 py-4 bg-green-50 border-t border-green-100 flex justify-between items-center">
                    <p className="text-green-800 font-medium text-sm flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" /> Application Approved! Complete payment to secure your lease.
                    </p>
                    <button 
                      onClick={() => handlePayment(req)}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold transition-colors shadow-md"
                    >
                      <CreditCard className="w-5 h-5" /> Pay Now
                    </button>
                  </div>
                )}
                
                {req.status === 'Paid' && (
                  <div className="px-6 py-4 bg-purple-50 border-t border-purple-100 flex items-center justify-center">
                    <p className="text-purple-800 font-bold flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" /> Lease Secured & Paid
                    </p>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RenterApplications;