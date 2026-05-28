import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Store, Mail, Lock, ArrowRight } from 'lucide-react';

// Array of high-quality warehouse images for the background slider
const backgroundImages = [
  'https://static.vecteezy.com/system/resources/thumbnails/027/170/532/small/generative-ai-large-warehouse-exterior-industry-building-distribution-retail-center-part-of-storage-and-shipping-system-photo.jpg',
  'https://img.magnific.com/free-photo/warehouse-interior-with-forklifts-shelving_23-2152005456.jpg?semt=ais_hybrid&w=740&q=80',
  'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1565891741441-64926e441838?q=80&w=2071&auto=format&fit=crop'
];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // NEW: State to track which image is currently showing
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  // NEW: The timer that changes the image every 3 seconds (3000ms)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    // Cleanup the timer if the user leaves the page
    return () => clearInterval(timer);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/login`, {
        email,
        password,
      });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userName', response.data.name);
      localStorage.setItem('userRole', response.data.role); // 'owner' or 'renter'
      
      toast.success('Welcome back!');
      
      // Route based on role
      if (response.data.role === 'owner') {
        navigate('/dashboard');
      } else {
        navigate('/marketplace');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      
      {/* LEFT SIDE: The Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 bg-white z-10 relative">
        <div className="max-w-md w-full mx-auto">
          
          <div className="flex items-center gap-2 mb-12">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Store className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">WareSaaS</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
          <p className="text-gray-500 mb-8">Enter your credentials to access your account.</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 mt-4"
            >
              {loading ? 'Signing in...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-blue-600 hover:text-blue-500 transition-colors">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: The Rotating Background Slider */}
      <div className="hidden lg:block lg:w-1/2 relative bg-black overflow-hidden">
        
        {/* We map through the images, but only the active one gets opacity-100 */}
        {backgroundImages.map((img, index) => (
          <div
            key={img}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}

        {/* The dark overlay so the white text is always readable */}
        <div className="absolute inset-0 bg-black/50" />

        {/* The Text Content overlay matching your screenshot */}
        <div className="absolute inset-0 flex flex-col justify-end p-16 z-10">
          <h2 className="text-5xl font-bold text-white mb-4 leading-tight">
            Scale your storage operations.
          </h2>
          <p className="text-xl text-gray-300 max-w-lg font-light leading-relaxed">
            Connect directly with verified owners and secure premium industrial real estate with zero hidden fees.
          </p>
        </div>
        
      </div>
    </div>
  );
};

export default Login;