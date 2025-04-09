// components/AttendanceHistory.tsx
"use client";
import { Materia } from '../utils/types';

export default function AttendanceHistory({ materia }: { materia: Materia }) {
  const asistenciasPorFecha = materia.asistencias.reduce((acc, asistencia) => {
    if (!acc[asistencia.fecha]) {
      acc[asistencia.fecha] = [];
    }
    acc[asistencia.fecha].push(asistencia);
    return acc;
  }, {} as Record<string, typeof materia.asistencias>);

  return (
    <div className="space-y-6">
      {Object.entries(asistenciasPorFecha).map(([fecha, asistencias]) => (
        <div key={fecha} className="bg-gray-700 p-4 rounded-lg shadow border">
          <h3 className="font-bold text-lg mb-2">{new Date(fecha).toLocaleDateString()}</h3>
          <ul className="space-y-2">
            {asistencias.map(asistencia => {
              const estudiante = materia.estudiantes.find(e => e.id === asistencia.estudianteId);
              return (
                <li key={`${fecha}-${asistencia.estudianteId}`} className="flex justify-between">
                  <span>{estudiante?.nombre || 'Desconocido'}</span>
                  <span className={asistencia.presente ? 'text-green-500' : 'text-red-500'}>
                    {asistencia.presente ? 'Presente' : 'Ausente'}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}