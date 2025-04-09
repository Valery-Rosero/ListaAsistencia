"use client";
import { useState, useEffect } from 'react';
import { obtenerMaterias, guardarMaterias } from './utils/storage';
import { Materia } from './utils/types';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { PlusIcon, TrashIcon, ArrowRightIcon, ChartBarIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [nuevaMateria, setNuevaMateria] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Cargar modo oscuro desde localStorage
    const savedMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedMode);
    document.documentElement.classList.toggle('dark', savedMode);

    // Cargar materias
    setMaterias(obtenerMaterias());
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    document.documentElement.classList.toggle('dark', newMode);
  };

  const agregarMateria = () => {
    if (!nuevaMateria.trim()) {
      toast.error('El nombre de la materia no puede estar vacío');
      return;
    }

    const nueva: Materia = {
      id: Date.now().toString(),
      nombre: nuevaMateria.trim(),
      estudiantes: [],
      asistencias: [],
    };

    const updated = [...materias, nueva];
    setMaterias(updated);
    guardarMaterias(updated);
    setNuevaMateria('');
    toast.success(`Materia "${nuevaMateria.trim()}" creada`);
  };

  const eliminarMateria = (id: string) => {
    const updated = materias.filter((m) => m.id !== id);
    setMaterias(updated);
    guardarMaterias(updated);
    toast.success('Materia eliminada');
  };

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
            Gestión de Asistencias
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Administra tus materias y registros
          </p>
        </div>
        
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-yellow-300"
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </div>

      {/* Formulario para añadir materia */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8 transition-all duration-200">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Añadir Nueva Materia
        </h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={nuevaMateria}
            onChange={(e) => setNuevaMateria(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && agregarMateria()}
            placeholder="Nombre de la materia"
            className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={agregarMateria}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            <span className="hidden md:inline">Añadir</span>
          </button>
        </div>
      </div>

      {/* Listado de materias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materias.map((materia) => (
          <div 
            key={materia.id} 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  {materia.nombre}
                </h2>
                <button
                  onClick={() => eliminarMateria(materia.id)}
                  className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-1 rounded-full"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
              
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-4">
                <div className="mr-4">
                  <span className="font-medium">{materia.estudiantes.length}</span> estudiantes
                </div>
                <div>
                  <span className="font-medium">
                    {materia.asistencias.filter(a => a.presente).length}
                  </span> asistencias
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Link
                  href={`/materia/${materia.id}`}
                  className="flex-1 flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                >
                  <ArrowRightIcon className="h-4 w-4" />
                  Entrar
                </Link>
                
                <button className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <ChartBarIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {materias.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 text-gray-400 dark:text-gray-500 mb-4">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">
            No hay materias registradas
          </h3>
          <p className="text-gray-400 dark:text-gray-500 mt-1">
            Comienza añadiendo tu primera materia
          </p>
        </div>
      )}
    </main>
  );
}
