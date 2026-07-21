import { LogOut, Wallet, User, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

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

        <nav className="flex items-center gap-2">
          <Link
            to="/profile"
            className="flex items-center gap-1.5 text-gray-600 hover:text-green-600 transition px-3 py-2 rounded-lg hover:bg-green-50"
            aria-label="Mi perfil"
          >
            <User size={18} />
            <span className="hidden sm:inline text-sm font-medium">Perfil</span>
          </Link>
          <Link
            to="/about"
            className="flex items-center gap-1.5 text-gray-600 hover:text-green-600 transition px-3 py-2 rounded-lg hover:bg-green-50"
            aria-label="Acerca de"
          >
            <Info size={18} />
            <span className="hidden sm:inline text-sm font-medium">Acerca de</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-gray-600 hover:text-red-500 transition px-3 py-2 rounded-lg hover:bg-red-50 font-medium"
            aria-label="Cerrar sesión"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline text-sm">Salir</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
