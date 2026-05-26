import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Store, LayoutDashboard, LogOut, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';


const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    toast.success('Successfully logged out!');
    navigate('/marketplace');
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm hidden md:flex">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-xl font-bold text-blue-700 flex items-center gap-2">
            <Store className="w-6 h-6" />
            WareSaaS
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {/* Public Marketplace Link */}
          <Link 
            to="/marketplace" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === '/marketplace' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Store className="w-5 h-5" />
            Marketplace
          </Link>

          {/* Protected Dashboard Link (Only shows if logged in AND is an owner) */}
       {token && userRole === 'owner' && (
         <Link 
           to="/dashboard" 
           className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === '/dashboard' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
         >
           <LayoutDashboard className="w-5 h-5" />
           Owner Dashboard
         </Link>
       )}
        </nav>

        {/* Auth Buttons (Bottom of Sidebar) */}
        <div className="p-4 border-t border-gray-100">
          {token ? (
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          ) : (
            <Link 
              to="/login"
              className="flex items-center gap-3 w-full px-4 py-3 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors font-medium"
            >
              <LogIn className="w-5 h-5" />
              Login
            </Link>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {/* This 'children' prop is where our Pages will get injected */}
        {children}
      </main>

    </div>
  );
};

export default Layout;