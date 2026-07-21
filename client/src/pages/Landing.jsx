import { Link } from 'react-router-dom';
import { Wallet, TrendingUp, CreditCard, Target, Shield, Smartphone } from 'lucide-react';

const features = [
  {
    icon: TrendingUp,
    title: 'Control de ingresos y gastos',
    description: 'Registra cada movimiento y visualiza tu balance en tiempo real.'
  },
  {
    icon: CreditCard,
    title: 'Pagos pendientes',
    description: 'Lleva un seguimiento de deudas, cuotas y pagos recurrentes.'
  },
  {
    icon: Target,
    title: 'Presupuesto mensual',
    description: 'Establece tu ingreso fijo y ve cuánto te queda disponible.'
  },
  {
    icon: Shield,
    title: 'Seguro y privado',
    description: 'Tus datos están protegidos con autenticación segura.'
  },
  {
    icon: Smartphone,
    title: 'Responsive',
    description: 'Funciona perfecto en tu celular, tablet o computador.'
  },
  {
    icon: Wallet,
    title: 'Balance estimado',
    description: 'Proyecta tu situación financiera a futuro automáticamente.'
  }
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-green-500 p-2 rounded-lg">
              <Wallet className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold text-gray-800">Monetty</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-800 transition px-3 py-2"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/register"
              className="text-sm font-medium bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
            >
              Crear cuenta
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <Wallet size={16} />
            Gestor de finanzas personales
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Toma el control de{' '}
            <span className="text-green-600">tu dinero</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Monetty te ayuda a entender en qué gastas, cuánto te queda y cómo planificar mejor tus finanzas. Simple, visual y sin complicaciones.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3.5 rounded-xl transition text-lg shadow-lg shadow-green-500/20"
            >
              Empezar gratis
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto border border-gray-300 hover:border-gray-400 text-gray-700 font-medium px-8 py-3.5 rounded-xl transition text-lg"
            >
              Ya tengo cuenta
            </Link>
          </div>

          {/* Preview visual */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-xl p-5 text-left">
                  <p className="text-xs font-medium text-gray-500 uppercase">Balance</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">$ 2.450.000</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-5 text-left">
                  <p className="text-xs font-medium text-gray-500 uppercase">Ingresos</p>
                  <p className="text-2xl font-bold text-emerald-600 mt-1">$ 3.500.000</p>
                </div>
                <div className="bg-red-50 rounded-xl p-5 text-left">
                  <p className="text-xs font-medium text-gray-500 uppercase">Gastos</p>
                  <p className="text-2xl font-bold text-red-600 mt-1">$ 1.050.000</p>
                </div>
              </div>
              <div className="mt-5 bg-gray-100 rounded-full h-4 overflow-hidden">
                <div className="bg-emerald-500 h-4 rounded-full" style={{ width: '30%' }}></div>
              </div>
              <p className="text-xs text-gray-400 mt-2 text-right">30% del presupuesto usado</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Todo lo que necesitas para tus finanzas
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-xl mx-auto">
              Sin complicaciones. Registra, visualiza y planifica en un solo lugar.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition"
              >
                <div className="bg-green-100 p-3 rounded-lg w-fit">
                  <feature.icon className="text-green-600" size={22} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-800">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            ¿Listo para organizar tus finanzas?
          </h2>
          <p className="mt-4 text-lg text-green-100 max-w-xl mx-auto">
            Crea tu cuenta en segundos y empieza a tomar mejores decisiones con tu dinero.
          </p>
          <Link
            to="/register"
            className="inline-block mt-8 bg-white text-green-600 font-semibold px-8 py-3.5 rounded-xl hover:bg-green-50 transition text-lg shadow-lg"
          >
            Crear cuenta gratis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-green-500 p-1.5 rounded-md">
              <Wallet className="text-white" size={16} />
            </div>
            <span className="text-sm font-medium text-gray-400">Monetty</span>
          </div>
          <Link to="/about" className="text-sm text-gray-400 hover:text-green-400 transition">
            Acerca de
          </Link>
          <p className="text-sm text-gray-500">
            © 2026 Monetty. Proyecto educativo FESC.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
