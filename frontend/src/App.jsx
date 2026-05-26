import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      {/* 1. Initialize the Toaster so notifications work globally */}
      <Toaster position="top-right" />
      
      {/* 2. Wrap everything in our new Sidebar Layout */}
      <Layout>
        <Routes>
          {/* Automatically redirect the root URL to the marketplace */}
          <Route path="/" element={<Navigate to="/marketplace" replace />} />
          
          <Route path="/login" element={<Login />} />
          
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          
          {/* We will build this page in the next step! */}
          <Route path="/marketplace" element={<div>Marketplace coming soon...</div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;