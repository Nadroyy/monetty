import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Calendar, DollarSign, ArrowLeft, Edit2, Check, X, Shield } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/format';

const Profile = () => {
  const { user, updateMonthlyIncome, logout } = useAuth();
  const navigate = useNavigate();
  const [editingIncome, setEditingIncome] = useState(false);
  const [income, setIncome] = useState(user?.monthly_income || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSaveIncome = async () => {
    if (!income || parseFloat(income) < 0) {
      setError('Ingresa un monto válido');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await updateMonthlyIncome(parseFloat(income));
      setEditingIncome(false);
      setSuccess('Ingreso mensual actualizado correctamente');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition">
            <ArrowLeft size={20} />
            <span className="font-medium">Volver al Dashboard</span>
          </Link>
          <h1 className="text-xl font-bold text-gray-800">Mi Perfil</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mensajes */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Info del usuario */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Banner */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-32 relative">
            <div className="absolute -bottom-12 left-8">
              <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                <span className="text-3xl font-bold text-green-600">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-16 px-8 pb-8">
            <h2 className="text-2xl font-bold text-gray-800">{user?.name}</h2>
            <p className="text-gray-500 mt-1">Usuario de Monetty</p>

            {/* Datos */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Mail className="text-blue-600" size={20} />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Correo electrónico</p>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5">{user?.email}</p>
                </div>
              </div>

              {/* Nombre */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <User className="text-purple-600" size={20} />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Nombre completo</p>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5">{user?.name}</p>
                </div>
              </div>

              {/* Fecha de registro */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Calendar className="text-orange-600" size={20} />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Miembro desde</p>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5">
                    {user?.created_at ? formatDate(user.created_at.split('T')[0]) : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Ingreso mensual */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="text-green-600" size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase">Ingreso mensual fijo</p>
                  {editingIncome ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="number"
                        value={income}
                        onChange={(e) => setIncome(e.target.value)}
                        className="w-32 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 outline-none"
                        min="0"
                        autoFocus
                      />
                      <button
                        onClick={handleSaveIncome}
                        disabled={loading}
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                        aria-label="Guardar"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => { setEditingIncome(false); setError(''); }}
                        className="p-1 text-gray-400 hover:bg-gray-100 rounded"
                        aria-label="Cancelar"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-sm font-semibold text-gray-800">
                        {user?.monthly_income ? formatCurrency(user.monthly_income) : 'No configurado'}
                      </p>
                      <button
                        onClick={() => setEditingIncome(true)}
                        className="p-1 text-gray-400 hover:text-blue-500 rounded"
                        aria-label="Editar ingreso"
                      >
                        <Edit2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seguridad */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="text-gray-600" size={22} />
            <h3 className="text-lg font-bold text-gray-800">Seguridad</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="text-sm font-medium text-gray-700">Autenticación</p>
                <p className="text-xs text-gray-500 mt-0.5">Token JWT con expiración de 7 días</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Activo</span>
            </div>

            <button
              onClick={handleLogout}
              className="w-full sm:w-auto px-6 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 font-medium rounded-lg transition"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
