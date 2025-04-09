// components/StatsDashboard.tsx
"use client";
import { Materia } from '../utils/types';

export default function StatsDashboard({ materia }: { materia: Materia }) {
  const totalEstudiantes = materia.estudiantes.length;
  const asistenciasHoy = materia.asistencias.filter(a => a.fecha === new Date().toISOString().split('T')[0]).length;
  const porcentajeAsistencia = totalEstudiantes > 0 ? Math.round((asistenciasHoy / totalEstudiantes) * 100) : 0;

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow border">
        <h3 className="text-gray-700">Total Estudiantes</h3>
        <p className="text-2xl font-bold text-green-600">{totalEstudiantes}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow border">
        <h3 className="text-gray-700">Asistencias Hoy</h3>
        <p className="text-2xl font-bold text-green-600">{asistenciasHoy}</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg shadow border">
        <h3 className="text-gray-100">Asistencia</h3>
        <p className="text-2xl font-bold text-gray-300">{porcentajeAsistencia}%</p>
      </div>
    </div>
  );
}