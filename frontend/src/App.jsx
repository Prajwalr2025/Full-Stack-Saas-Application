import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute'; // <-- 1. Import the bouncer

function App() {
  return (
    <Router>
      <div>
        <Routes>
          {/* Public Route: Anyone can see the login page */}
          <Route path="/" element={<Login />} />
          
          {/* Protected Route: Wrapped in the bouncer */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;