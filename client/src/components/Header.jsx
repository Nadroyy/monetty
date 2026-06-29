import { LogOut, Wallet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = ({ user }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-green-500 p-2 rounded-lg">
            <Wallet className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Monetty</h1>
            <p className="text-sm text-gray-500">Hola, {user?.name}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition font-medium"
          aria-label="Cerrar sesión"
        >
          <LogOut size={20} />
          <span className="hidden sm:inline">Cerrar sesión</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
