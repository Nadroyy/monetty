import { Link } from 'react-router-dom';
import { Wallet, Code2, Database, Globe, Shield, Users, ArrowLeft, Github } from 'lucide-react';

const techStack = [
  {
    category: 'Frontend',
    icon: Globe,
    color: 'bg-blue-100 text-blue-600',
    items: ['React 18', 'Vite 5', 'Tailwind CSS 3', 'React Router DOM 6', 'Axios', 'Lucide React']
  },
  {
    category: 'Backend',
    icon: Code2,
    color: 'bg-green-100 text-green-600',
    items: ['Node.js', 'Express 4', 'Sequelize (ORM)', 'JWT (autenticación)', 'express-validator', 'bcryptjs']
  },
  {
    category: 'Base de Datos',
    icon: Database,
    color: 'bg-purple-100 text-purple-600',
    items: ['PostgreSQL 17', 'Migraciones Sequelize', 'Relaciones 1:N', 'Índices B-tree', 'Tipos ENUM']
  },
  {
    category: 'Seguridad',
    icon: Shield,
    color: 'bg-orange-100 text-orange-600',
    items: ['JWT con expiración', 'Bcrypt (hash de contraseñas)', 'Validación de inputs', 'CORS configurado', 'Rutas protegidas']
  }
];

const teamMembers = [
  { name: 'Equipo Monetty', role: 'Desarrollo Full Stack', institution: 'FESC' }
];

const About = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition">
            <ArrowLeft size={20} />
            <span className="font-medium">Volver</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="bg-green-500 p-1.5 rounded-lg">
              <Wallet className="text-white" size={18} />
            </div>
            <span className="font-bold text-gray-800">Monetty</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero */}
        <section className="text-center mb-14">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-2xl mb-6 shadow-lg shadow-green-500/20">
            <Wallet className="text-white" size={36} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Acerca de Monetty</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Monetty es un gestor de finanzas personales desarrollado como proyecto académico 
            para la materia de Desarrollo Web Full Stack en la FESC. Permite registrar ingresos, 
            gastos y pagos pendientes con una interfaz moderna y responsiva.
          </p>
        </section>

        {/* Características */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">Funcionalidades Principales</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'Registro de transacciones', desc: 'Ingresos y gastos categorizados con filtros' },
              { title: 'Pagos pendientes', desc: 'Control de deudas, cuotas y pagos recurrentes' },
              { title: 'Presupuesto mensual', desc: 'Ingreso fijo con barra de progreso visual' },
              { title: 'Gráficos por categoría', desc: 'Visualización de gastos por categoría' },
              { title: 'Balance estimado', desc: 'Proyección financiera a futuro automática' },
              { title: 'Diseño responsive', desc: 'Funciona en computador, tablet y celular' }
            ].map((feature) => (
              <div key={feature.title} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                <h3 className="font-semibold text-gray-800">{feature.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stack Tecnológico */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">Stack Tecnológico</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {techStack.map((tech) => (
              <div key={tech.category} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2.5 rounded-lg ${tech.color}`}>
                    <tech.icon size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">{tech.category}</h3>
                </div>
                <ul className="space-y-2">
                  {tech.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Arquitectura */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">Arquitectura</h2>
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="p-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-3">
                  <Globe className="text-blue-600" size={24} />
                </div>
                <h4 className="font-bold text-gray-800">Frontend</h4>
                <p className="text-sm text-gray-500 mt-1">React SPA con Context API para estado global y Axios para comunicación HTTP</p>
              </div>
              <div className="p-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-3">
                  <Code2 className="text-green-600" size={24} />
                </div>
                <h4 className="font-bold text-gray-800">Backend</h4>
                <p className="text-sm text-gray-500 mt-1">API REST con Express, arquitectura por capas (rutas, controladores, modelos)</p>
              </div>
              <div className="p-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-3">
                  <Database className="text-purple-600" size={24} />
                </div>
                <h4 className="font-bold text-gray-800">Base de Datos</h4>
                <p className="text-sm text-gray-500 mt-1">PostgreSQL con Sequelize ORM, migraciones y relaciones entre tablas</p>
              </div>
            </div>
          </div>
        </section>

        {/* Equipo */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">Equipo de Desarrollo</h2>
          <div className="flex justify-center">
            {teamMembers.map((member) => (
              <div key={member.name} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm text-center max-w-sm w-full">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <Users className="text-green-600" size={28} />
                </div>
                <h3 className="font-bold text-gray-800">{member.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{member.role}</p>
                <p className="text-xs text-gray-400 mt-0.5">{member.institution}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            © 2026 Monetty — Proyecto educativo FESC
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Desarrollado con React, Express, PostgreSQL y Sequelize
          </p>
        </footer>
      </main>
    </div>
  );
};

export default About;
