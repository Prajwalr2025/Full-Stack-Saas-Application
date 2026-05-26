import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, X, MapPin, Maximize, Store } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State to control whether the form is open or closed
  const [showForm, setShowForm] = useState(false);

  // Form input states
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [squareFootage, setSquareFootage] = useState('');
  const [basePricePerDay, setBasePricePerDay] = useState('');

  const token = localStorage.getItem('token');
  const userName = localStorage.getItem('userName');

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/spaces/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setSpaces(response.data);
      } catch (err) {
        toast.error('Failed to load your dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchSpaces();
  }, [token]);

  // The function that talks to your secure POST route
  const handleCreateSpace = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/spaces`,
        {
          title,
          location,
          squareFootage: Number(squareFootage),
          basePricePerDay: Number(basePricePerDay)
        },
        {
          headers: {
            Authorization: `Bearer ${token}` // Showing the VIP pass to the backend
          }
        }
      );

      // Instantly add the new space to the top of our list
      setSpaces([response.data, ...spaces]);
      toast.success('Warehouse listed successfully!');

      // Reset the form and close it
      setTitle('');
      setLocation('');
      setSquareFootage('');
      setBasePricePerDay('');
      setShowForm(false);
      
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create listing');
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {userName}</h1>
          <p className="text-gray-500 mt-1">Manage your warehouse listings and revenue.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
        >
          {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {showForm ? 'Cancel Listing' : 'Add New Space'}
        </button>
      </div>

      {/* Conditionally Rendered Creation Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8 animate-in slide-in-from-top-4 fade-in duration-200">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Create a New Listing</h2>
          <form onSubmit={handleCreateSpace} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Title</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Peenya Industrial Hub - Zone A" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location / City</label>
              <input type="text" required value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Bengaluru, Karnataka" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Square Footage (sq ft)</label>
              <input type="number" required value={squareFootage} onChange={(e) => setSquareFootage(e.target.value)} placeholder="e.g. 5000" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Base Price Per Day (₹)</label>
              <input type="number" required value={basePricePerDay} onChange={(e) => setBasePricePerDay(e.target.value)} placeholder="e.g. 2500" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>

            <div className="md:col-span-2 pt-2">
              <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors">
                Publish Listing
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid of Owner's Properties */}
      {loading ? (
        <div className="text-gray-500 py-10">Loading your properties...</div>
      ) : spaces.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <Store className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No properties listed</h3>
          <p className="text-gray-500 mt-1">Click the button above to add your first warehouse.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spaces.map((space) => (
            <div key={space._id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{space.title}</h3>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded border border-green-200">Active</span>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600 text-sm">
                  <MapPin className="w-4 h-4 mr-2" /> {space.location}
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <Maximize className="w-4 h-4 mr-2" /> {space.squareFootage.toLocaleString()} sq ft
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                <span className="text-xs text-gray-500">Daily Rate</span>
                <span className="text-lg font-bold text-blue-700">₹{space.basePricePerDay.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Dashboard;