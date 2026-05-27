import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, X, MapPin, Maximize, Store, UploadCloud, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [squareFootage, setSquareFootage] = useState('');
  const [basePricePerDay, setBasePricePerDay] = useState('');
  
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const token = localStorage.getItem('token');
  const userName = localStorage.getItem('userName');

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/spaces/me`, {
          headers: { Authorization: `Bearer ${token}` }
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

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file); 
    setUploading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      setImageUrl(response.data.imageUrl);
      toast.success('Image uploaded successfully!');
    } catch (err) {
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleCreateSpace = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/spaces`,
        {
          title,
          location,
          squareFootage: Number(squareFootage),
          basePricePerDay: Number(basePricePerDay),
          imageUrl 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSpaces([response.data, ...spaces]);
      toast.success('Warehouse listed successfully!');

      setTitle('');
      setLocation('');
      setSquareFootage('');
      setBasePricePerDay('');
      setImageUrl('');
      setShowForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create listing');
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      
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

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8 animate-in slide-in-from-top-4 fade-in duration-200">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Create a New Listing</h2>
          <form onSubmit={handleCreateSpace} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="md:col-span-2 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-100 transition-colors">
              {imageUrl ? (
                <div className="relative w-full h-48 rounded-lg overflow-hidden">
                  <img src={imageUrl} alt="Warehouse preview" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setImageUrl('')} className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <UploadCloud className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <label className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium">
                    {uploading ? 'Uploading to AWS...' : 'Click to upload property image'}
                    <input type="file" className="hidden" onChange={uploadFileHandler} accept="image/*" disabled={uploading} />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP up to 5MB</p>
                </>
              )}
            </div>

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
            <div key={space._id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
              
              <div className="h-48 bg-gray-200 relative">
                {space.imageUrl ? (
                  <img src={space.imageUrl} alt={space.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-400">
                    <ImageIcon className="w-10 h-10" />
                  </div>
                )}
                
                {/* THE UPDATED DYNAMIC BADGE LOGIC */}
                <span className={`absolute top-3 right-3 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm ${space.isActive === false ? 'bg-gray-600' : 'bg-green-500'}`}>
                  {space.isActive === false ? 'Leased' : 'Active'}
                </span>
                {/* ----------------------------------- */}

              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 line-clamp-1 mb-3">{space.title}</h3>
                <div className="space-y-2 mb-4 flex-1">
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 mr-2" /> {space.location}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Maximize className="w-4 h-4 mr-2" /> {space.squareFootage.toLocaleString()} sq ft
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-between items-end mt-auto">
                  <span className="text-xs text-gray-500">Daily Rate</span>
                  <span className="text-lg font-bold text-blue-700">₹{space.basePricePerDay.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Dashboard;