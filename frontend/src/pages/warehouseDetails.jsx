import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Maximize, ShieldCheck, Calendar, IndianRupee, ArrowLeft, Info } from 'lucide-react';
import toast from 'react-hot-toast';

const WarehouseDetails = () => {
  const { id } = useParams(); // Grabs the warehouse ID from the URL
  const navigate = useNavigate();
  
  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);

  // Booking Form State
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [proposedPrice, setProposedPrice] = useState('');
  const [renterNotes, setRenterNotes] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchSpace = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/spaces/${id}`);
        setSpace(response.data);
      } catch (err) {
        toast.error('Failed to load warehouse details');
        navigate('/marketplace');
      } finally {
        setLoading(false);
      }
    };
    fetchSpace();
  }, [id, navigate]);

  const calculateTotal = () => {
    if (!startDate || !endDate || !space) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return days > 0 ? days * space.basePricePerDay : 0;
  };

  const handleLeaseSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error('You must be logged in to request a space!');
      return navigate('/login');
    }

    const totalPrice = calculateTotal();
    if (totalPrice <= 0) {
      return toast.error('Please select valid dates.');
    }

    const finalOfferPrice = proposedPrice ? Number(proposedPrice) : totalPrice;

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/requests`,
        { spaceId: space._id, startDate, endDate, totalPrice, proposedPrice: finalOfferPrice, renterNotes },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Lease request sent to the owner!');
      navigate('/applications'); // Redirect them to track their application
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit request');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading details...</div>;
  if (!space) return null;

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-blue-600 font-medium transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Marketplace
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-8">
        
        {/* Massive Hero Image */}
        <div className="w-full h-[60vh] bg-gray-200 rounded-2xl overflow-hidden mb-8 shadow-sm relative">
          {space.imageUrl ? (
            <img src={space.imageUrl} alt={space.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">No Image Available</div>
          )}
          <span className={`absolute top-6 left-6 text-white text-sm font-bold px-4 py-2 rounded-full shadow-md ${space.isActive !== false ? 'bg-green-500' : 'bg-gray-800'}`}>
            {space.isActive !== false ? 'Available Now' : 'Currently Leased'}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Warehouse Information */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{space.title}</h1>
              <div className="flex flex-wrap items-center gap-6 text-gray-600">
                <div className="flex items-center"><MapPin className="w-5 h-5 mr-2 text-blue-600" /> {space.location}</div>
                <div className="flex items-center"><Maximize className="w-5 h-5 mr-2 text-blue-600" /> {space.squareFootage.toLocaleString()} sq ft</div>
                <div className="flex items-center"><ShieldCheck className="w-5 h-5 mr-2 text-green-600" /> Verified Owner</div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About this property</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                This premium industrial space in {space.location} offers {space.squareFootage.toLocaleString()} square feet of highly optimized storage capacity. Perfect for logistics, distribution, or manufacturing operations. The property is managed by a verified owner, ensuring a smooth and professional leasing experience.
              </p>
            </div>
          </div>

          {/* Right Column: The Booking Widget */}
          <div>
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xl sticky top-8">
              <div className="mb-6 pb-6 border-b border-gray-100">
                <p className="text-3xl font-bold text-gray-900 flex items-center">
                  <IndianRupee className="w-7 h-7 mr-1" />
                  {space.basePricePerDay.toLocaleString()} <span className="text-lg text-gray-500 font-normal ml-1">/ day</span>
                </p>
              </div>

              {space.isActive !== false ? (
                <form onSubmit={handleLeaseSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Check-in</label>
                      <input type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Check-out</label>
                      <input type="date" required value={endDate} onChange={(e) => setEndDate(e.target.value)} min={startDate || new Date().toISOString().split('T')[0]} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black" />
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600 underline">Base Total</span>
                      <span className="font-medium flex items-center"><IndianRupee className="w-4 h-4" />{calculateTotal().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                      <label className="text-sm font-bold text-gray-900">Your Offer</label>
                      <input type="number" value={proposedPrice} onChange={(e) => setProposedPrice(e.target.value)} placeholder={calculateTotal().toString()} className="w-28 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-black outline-none font-bold text-right" />
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-lg transition-colors mt-2">
                    Request to Book
                  </button>
                  <p className="text-center text-xs text-gray-500 mt-3 flex items-center justify-center">
                    <Info className="w-3 h-3 mr-1" /> You won't be charged yet
                  </p>
                </form>
              ) : (
                <div className="bg-gray-100 p-6 rounded-xl text-center text-gray-600 font-medium">
                  This property is currently unavailable for new leases.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default WarehouseDetails;