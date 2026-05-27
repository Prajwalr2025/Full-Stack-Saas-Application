import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/login`, {
        email,
        password,
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userName', response.data.name);
      localStorage.setItem('userRole', response.data.role); 
      
      toast.success('Successfully logged in!');
      
      if (response.data.role === 'owner') {
        navigate('/dashboard');
      } else {
        navigate('/marketplace');
      }
      
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex font-sans">
      
      {/* Left Side: The Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 px-8">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-10 border border-gray-100">
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-500 mb-8">
            Sign in to your Warehouse SaaS account.
          </p>
          
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md mb-6 text-center border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input 
                type="email" 
                placeholder="you@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-800 hover:underline">Forgot password?</a>
              </div>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-lg transition-colors duration-200 mt-4 shadow-sm"
            >
              Sign In
            </button>

          </form>

          <div className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-800 font-bold hover:underline">
              Create an account
            </Link>
          </div>

        </div>
      </div>

      {/* Right Side: The Premium Image */}
      <div className="hidden md:block w-1/2 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2000&auto=format&fit=crop" 
          alt="Premium Logistics Warehouse" 
          className="w-full h-full object-cover opacity-90"
        />
        
        {/* Optional Overlay Text */}
        <div className="absolute bottom-16 left-16 z-20 text-white max-w-lg">
          <h3 className="text-3xl font-bold mb-3">Scale your storage operations.</h3>
          <p className="text-gray-300 text-lg leading-relaxed">
            Connect directly with verified owners and secure premium industrial real estate with zero hidden fees.
          </p>
        </div>
      </div>

    </div>
  );
};

export default Login;