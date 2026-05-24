import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  // 1. State: Short-term memory for our warehouse data
  const [spaces, setSpaces] = useState([]);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  
  // Grab the user's name from the vault so we can say hello
  const userName = localStorage.getItem('userName') || 'Owner';

  // 2. The Auto-Loader (useEffect)
  useEffect(() => {
    // We define the function that talks to the backend
    const fetchSpaces = async () => {
      try {
        // Grab the VIP pass from the browser vault
        const token = localStorage.getItem('token');
        
        // Act like Postman: Send a GET request AND attach the Authorization Header
        const response = await axios.get('http://localhost:5000/api/spaces', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        // Save the array of warehouses into React's memory
        setSpaces(response.data);
      } catch (err) {
        setError('Failed to load your warehouses. Please try logging in again.');
      }
    };

    // Call the function immediately when the page loads
    fetchSpaces();
  }, []); // The empty array [] means "Only run this ONE TIME when the component first appears on screen."

  // 3. The Logout Function
  const handleLogout = () => {
    localStorage.removeItem('token'); // Shred the VIP pass
    localStorage.removeItem('userName'); 
    navigate('/'); // Kick them back to the login screen
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Welcome back, {userName}</h2>
        <button 
          onClick={handleLogout}
          style={{ padding: '8px 16px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Logout
        </button>
      </div>

      <hr style={{ margin: '20px 0' }} />

      <h3>Your Active Listings</h3>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* 4. The Mapper: Loop through the database array and create a card for each one */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {spaces.length === 0 ? (
          <p>You haven't listed any warehouses yet.</p>
        ) : (
          spaces.map((space) => (
            <div key={space._id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', background: '#f9f9f9' }}>
              <h4 style={{ margin: '0 0 10px 0' }}>{space.title}</h4>
              <p style={{ margin: '5px 0' }}><strong>Location:</strong> {space.location}</p>
              <p style={{ margin: '5px 0' }}><strong>Size:</strong> {space.squareFootage} sq ft</p>
              <p style={{ margin: '5px 0' }}><strong>Price:</strong> ₹{space.basePricePerDay} / day</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;