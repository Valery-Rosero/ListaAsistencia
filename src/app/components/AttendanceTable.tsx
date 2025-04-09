"use client";
import { Materia } from '../utils/types';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

export default function AttendanceTable({ 
  materia,
  onToggleAttendance,
  onSaveAttendance
}: {
  materia: Materia;
  onToggleAttendance: (estudianteId: string) => void;
  onSaveAttendance: () => void;
}) {
  const hoy = new Date().toISOString().split('T')[0];

  // Calcular estadísticas rápidas
  const totalEstudiantes = materia.estudiantes.length;
  const asistenciasHoy = materia.asistencias.filter(
    a => a.fecha === hoy && a.presente
  ).length;

  return (
    <div className="space-y-4">
      {/* Header informativo - MODIFICADO COMO SOLICITASTE */}
      <div className="flex justify-between items-center bg-blue-100 p-4 rounded-lg border border-blue-200 shadow-sm">
        <div>
          <h3 className="text-lg font-semibold text-blue-800">Asistencia Diaria</h3>
          <p className="text-sm text-blue-700">
            {new Date(hoy).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-blue-800">
            <span className="text-green-600">{asistenciasHoy}</span> de 
            <span> {totalEstudiantes}</span> presentes
          </p>
          <p className="text-xs text-blue-600">
            ({Math.round((asistenciasHoy / totalEstudiantes) * 100)}%)
          </p>
        </div>
      </div>

      {/* Tabla de estudiantes - MANTENIDO EXACTAMENTE IGUAL */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Estudiante
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Asistencia
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {materia.estudiantes.map((estudiante) => {
              const asistencia = materia.asistencias.find(
                (a) => a.estudianteId === estudiante.id && a.fecha === hoy
              );
              const presente = asistencia?.presente ?? false;

              return (
                <tr 
                  key={estudiante.id} 
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {estudiante.nombre}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          ID: {estudiante.id.slice(-6)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {presente ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200">
                        Presente
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200">
                        Ausente
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => onToggleAttendance(estudiante.id)}
                      className={`p-1 rounded-full ${presente ? 'text-green-500 hover:text-green-700' : 'text-red-500 hover:text-red-700'}`}
                    >
                      {presente ? (
                        <CheckCircleIcon className="h-6 w-6" />
                      ) : (
                        <XCircleIcon className="h-6 w-6" />
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Botón de acción - MANTENIDO EXACTAMENTE IGUAL */}
      <div className="flex justify-end">
        <button
          onClick={onSaveAttendance}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Guardar Asistencias
        </button>
      </div>
    </div>
  );
}