import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  // 1. Check the browser's vault for the VIP pass
  const token = localStorage.getItem('token');

  // 2. If the token is missing, instantly teleport them back to the login screen
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // 3. If the token exists, render whatever component they were trying to visit
  return children;
};

export default PrivateRoute;