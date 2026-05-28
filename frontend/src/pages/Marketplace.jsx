import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, Maximize, ShieldCheck, Store } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Marketplace = () => {
  const [spaces, setSpaces] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

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
    space.isActive !== false && 
    (space.location.toLowerCase().includes(searchTerm.toLowerCase()) || 
    space.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-12 relative selection:bg-zinc-200 selection:text-black">
      
      {/* Premium Black Hero Section */}
      <div className="bg-gradient-to-b from-black via-zinc-950 to-black text-white py-24 px-6 text-center relative overflow-hidden border-b border-zinc-800">
        
        {/* Subtle silver/white background glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-zinc-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
            Find the Perfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-300 to-white">Warehouse</span> Space
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light">
            Browse premium industrial real estate. Connect directly with owners. No hidden fees.
          </p>
          
          {/* Floating, High-Contrast Search Bar */}
          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors duration-300" />
            </div>
            <input
              type="text"
              placeholder="Search by city, zone, or warehouse name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-4 py-4 bg-white rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-black/10 shadow-xl transition-all duration-300 border-0"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-12">
        {loading ? (
          <div className="text-center text-gray-500 py-20">Loading available properties...</div>
        ) : filteredSpaces.length === 0 ? (
          <div className="text-center text-gray-500 py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
            No warehouses found matching "{searchTerm}"
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSpaces.map((space) => (
              <div key={space._id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group">
                
                <div className="h-48 bg-gray-100 relative overflow-hidden border-b border-gray-100">
                  {space.imageUrl ? (
                    <img src={space.imageUrl} alt={space.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full">
                      <Store className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{space.title}</h3>
                  </div>
                  
                  <div className="space-y-3 mb-6 flex-1">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-zinc-800" />
                      <span className="text-sm">{space.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Maximize className="w-4 h-4 mr-2 text-zinc-800" />
                      <span className="text-sm">{space.squareFootage.toLocaleString()} sq ft</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <ShieldCheck className="w-4 h-4 mr-2 text-zinc-800" />
                      <span className="text-sm">Verified Owner</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center mt-auto">
                    <div>
                      <p className="text-sm text-gray-500">Starting at</p>
                      <p className="text-xl font-bold text-black">₹{space.basePricePerDay.toLocaleString()}<span className="text-sm font-normal text-gray-500">/day</span></p>
                    </div>
                    
                    {/* Sleek Black Button */}
                    <Link 
                      to={`/warehouse/${space._id}`}
                      className="bg-black text-white hover:bg-zinc-800 px-5 py-2.5 rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
                    >
                      View Details
                    </Link>
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