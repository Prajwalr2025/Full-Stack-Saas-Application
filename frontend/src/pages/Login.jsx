import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
      const response = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password,
      });

      // If successful, take the JWT token and save it in the browser's local vault
      localStorage.setItem('token', response.data.token);
      
      // Save the user's name too, just so we can welcome them on the dashboard
      localStorage.setItem('userName', response.data.name);

      // Instantly teleport the user to the dashboard
      navigate('/dashboard');
      
    } catch (err) {
      // If the backend throws a 401 (Wrong password), catch it and show the user
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h2>Sign in to Warehouse SaaS</h2>
      
      {/* If there is an error, show this red box */}
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <input 
          type="email" 
          placeholder="Email Address" 
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Update memory as they type
          required
          style={{ padding: '10px' }}
        />
        
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Update memory as they type
          required
          style={{ padding: '10px' }}
        />
        
        <button type="submit" style={{ padding: '10px', background: 'blue', color: 'white', border: 'none', cursor: 'pointer' }}>
          Login
        </button>

      </form>
    </div>
  );
};

export default Login;