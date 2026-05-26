  import { useState } from 'react';
  import { useNavigate, Link } from 'react-router-dom';
  import axios from 'axios';

  const Login = () => {
    // 1. State: The frontend's short-term memory
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // 2. The Navigation Hook
    const navigate = useNavigate();

    // 3. The Submit Function (Talking to the Backend)
    const handleSubmit = async (e) => {
      e.preventDefault(); // Stops the page from refreshing when you hit submit
      setError('');       // Clears any old error messages

      try {
        // Act just like Postman: Send a POST request to our API
        const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/login`, {
          email,
          password,
        });

        // If successful, take the JWT token and save it in the browser's local vault
        localStorage.setItem('token', response.data.token);
        
        // Save the user's name too, just so we can welcome them on the dashboard
        localStorage.setItem('userName', response.data.name);

        localStorage.setItem('userRole', response.data.role);

        // Instantly teleport the user to the dashboard
        if (response.data.role === 'owner') {
          navigate('/dashboard');
        } else {
          navigate('/marketplace');
        }
        
      } catch (err) {
        // If the backend throws a 401 (Wrong password), catch it and show the user
        setError(err.response?.data?.message || 'Something went wrong');
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
            Sign in to Warehouse SaaS
          </h2>
          
          {/* If there is an error, show this red box */}
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md mb-6 text-center border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            <div>
              <input 
                type="email" 
                placeholder="Email Address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            
            <div>
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors duration-200 mt-2 shadow-sm"
            >
              Login
            </button>

          </form>
          <div className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium hover:underline">
          Sign up here
        </Link>
      </div>
        </div>
      </div>
    );
  };

  export default Login;