const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4">
      <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 w-32 bg-gray-200 rounded"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 w-20 bg-gray-200 rounded"></div>
    </td>
    <td className="px-6 py-4 text-right">
      <div className="h-4 w-24 bg-gray-200 rounded ml-auto"></div>
    </td>
    <td className="px-6 py-4">
      <div className="flex justify-center gap-2">
        <div className="h-6 w-6 bg-gray-200 rounded"></div>
        <div className="h-6 w-6 bg-gray-200 rounded"></div>
      </div>
    </td>
  </tr>
);

const SkeletonCard = () => (
  <div className="p-4 flex items-center justify-between animate-pulse">
    <div className="flex items-center gap-3">
      <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
      <div>
        <div className="h-4 w-28 bg-gray-200 rounded mb-1"></div>
        <div className="h-3 w-20 bg-gray-200 rounded"></div>
      </div>
    </div>
    <div className="h-4 w-20 bg-gray-200 rounded"></div>
  </div>
);

const TransactionSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    {/* Tabla skeleton para desktop */}
    <div className="hidden md:block">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tipo</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Descripción</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Categoría</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Fecha</th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Monto</th>
            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {[...Array(5)].map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </tbody>
      </table>
    </div>

    {/* Tarjetas skeleton para móvil */}
    <div className="md:hidden divide-y divide-gray-100">
      {[...Array(5)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  </div>
);

export default TransactionSkeleton;
