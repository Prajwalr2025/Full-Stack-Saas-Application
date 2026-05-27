import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, Maximize, ShieldCheck, Store, X, Calendar, IndianRupee } from 'lucide-react';
import toast from 'react-hot-toast';

const Marketplace = () => {
  const [spaces, setSpaces] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // NEW: State for the Leasing Modal
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [renterNotes, setRenterNotes] = useState('');

  const token = localStorage.getItem('token'); // We need the token to submit a request!

  useEffect(() => {
    const fetchPublicSpaces = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/spaces`);
        setSpaces(response.data);
      } catch (err) {
        toast.error('Failed to load marketplace data');
      } finally {
        setLoading(false);
      }
    };
    fetchPublicSpaces();
  }, []);

  const filteredSpaces = spaces.filter(space => 
    space.location.toLowerCase().includes(searchTerm.toLowerCase()) || 
    space.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // NEW: Helper function to calculate total price based on dates
  const calculateTotal = () => {
    if (!startDate || !endDate || !selectedSpace) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    if (days <= 0) return 0;
    return days * selectedSpace.basePricePerDay;
  };

  // NEW: Submit the lease request to the backend
  const handleLeaseSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error('You must be logged in to request a space!');
      return;
    }

    const totalPrice = calculateTotal();
    if (totalPrice <= 0) {
      toast.error('Please select valid start and end dates.');
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/requests`,
        {
          spaceId: selectedSpace._id,
          startDate,
          endDate,
          totalPrice,
          renterNotes
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success('Lease request sent to the owner!');
      
      // Close and reset the modal
      setSelectedSpace(null);
      setStartDate('');
      setEndDate('');
      setRenterNotes('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit request');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12 relative">
      
      {/* Premium Hero Section */}
      <div className="bg-black text-white py-16 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Find the Perfect Warehouse Space</h1>
        <p className="text-blue-200 text-lg max-w-2xl mx-auto mb-8">
          Browse premium industrial real estate. Connect directly with owners. No hidden fees.
        </p>
        
        {/* Search Bar */}
        <div className="max-w-xl mx-auto relative group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors duration-300" />
          </div>
          <input
            type="text"
            placeholder="Search by city, zone, or warehouse name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 backdrop-blur-md focus:outline-none focus:bg-white/20 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-2xl"
          />
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-6xl mx-auto px-6 mt-12">
        {loading ? (
          <div className="text-center text-gray-500 py-20">Loading available properties...</div>
        ) : filteredSpaces.length === 0 ? (
          <div className="text-center text-gray-500 py-20 bg-white rounded-xl border border-gray-200">
            No warehouses found matching "{searchTerm}"
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSpaces.map((space) => (
              <div key={space._id} className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300 flex flex-col">
                
                {/* Dynamic Image Section */}
                <div className="h-48 bg-gray-200 relative overflow-hidden border-b border-gray-100">
                  {space.imageUrl ? (
                    <img 
                      src={space.imageUrl} 
                      alt={space.title} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full">
                      <Store className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                </div>
                
                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{space.title}</h3>
                  </div>
                  
                  <div className="space-y-3 mb-6 flex-1">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                      <span className="text-sm">{space.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Maximize className="w-4 h-4 mr-2 text-blue-600" />
                      <span className="text-sm">{space.squareFootage.toLocaleString()} sq ft</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <ShieldCheck className="w-4 h-4 mr-2 text-green-600" />
                      <span className="text-sm">Verified Owner</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center mt-auto">
                    <div>
                      <p className="text-sm text-gray-500">Starting at</p>
                      <p className="text-xl font-bold text-blue-700">₹{space.basePricePerDay.toLocaleString()}<span className="text-sm font-normal text-gray-500">/day</span></p>
                    </div>
                    {/* NEW: Button opens the modal instead of showing a toast */}
                    <button 
                      onClick={() => setSelectedSpace(space)}
                      className="bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Request
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* NEW: The Lease Request Modal (Only renders if a space is selected) */}
      {selectedSpace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Request Lease</h3>
              <button onClick={() => setSelectedSpace(null)} className="text-gray-400 hover:text-gray-700 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleLeaseSubmit} className="p-6">
              <div className="mb-6 pb-4 border-b border-gray-100">
                <h4 className="font-bold text-gray-800">{selectedSpace.title}</h4>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {selectedSpace.location}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> Start Date
                  </label>
                  <input type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> End Date
                  </label>
                  <input type="date" required value={endDate} onChange={(e) => setEndDate(e.target.value)} min={startDate || new Date().toISOString().split('T')[0]} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Message to Owner (Optional)</label>
                <textarea rows="3" value={renterNotes} onChange={(e) => setRenterNotes(e.target.value)} placeholder="What kind of goods are you storing?" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"></textarea>
              </div>

              {/* Dynamic Price Calculator */}
              <div className="bg-blue-50 p-4 rounded-xl mb-6 flex justify-between items-center border border-blue-100">
                <div>
                  <p className="text-sm font-medium text-blue-900">Total Estimated Cost</p>
                  <p className="text-xs text-blue-700 mt-0.5">Based on ₹{selectedSpace.basePricePerDay}/day</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-700 flex items-center justify-end">
                    <IndianRupee className="w-5 h-5 mr-0.5" />
                    {calculateTotal().toLocaleString()}
                  </p>
                </div>
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors">
                Submit Request
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Marketplace;