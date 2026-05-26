import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, Maximize, ShieldCheck, Store } from 'lucide-react';
import toast from 'react-hot-toast';

const Marketplace = () => {
  const [spaces, setSpaces] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicSpaces = async () => {
      try {
        // Notice: NO Authorization header here! This is a public request.
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

  // Filter the spaces based on what the user types in the search bar
  const filteredSpaces = spaces.filter(space => 
    space.location.toLowerCase().includes(searchTerm.toLowerCase()) || 
    space.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      
      {/* Premium Hero Section */}
      <div className="bg-black text-white py-16 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Find the Perfect Warehouse Space</h1>
        <p className="text-blue-200 text-lg max-w-2xl mx-auto mb-8">
          Browse premium industrial real estate. Connect directly with owners. No hidden fees.
        </p>
        
        {/* Search Bar */}
        <div className="max-w-xl mx-auto relative group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            {/* The icon will turn blue when the user clicks the search bar! */}
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
      </div> {/* <--- THIS IS THE MISSING CLOSING TAG THAT FIXED THE ERROR */}

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
                
                {/* Image Placeholder */}
                <div className="h-48 bg-gray-200 flex items-center justify-center border-b border-gray-100">
                  <Store className="w-12 h-12 text-gray-400" />
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
                    <button 
                      onClick={() => toast.success('Lease Request feature coming soon!')}
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

    </div>
  );
};

export default Marketplace;