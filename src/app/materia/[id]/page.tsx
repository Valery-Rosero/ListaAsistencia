"use client";
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { obtenerMaterias, guardarMaterias } from '../../utils/storage';
import { Materia } from '../../utils/types';
import AddStudentModal from '../../components/AddStudentModal';
import AttendanceTable from '../../components/AttendanceTable';
import AttendanceHistory from '../../components/AttendanceHistory';
import Tabs from '../../components/Tabs';
import { toast } from 'react-hot-toast';
import StatsDashboard from './../../components/StatsDashboard';

export default function MateriaPage() {
  const { id } = useParams();
  const router = useRouter();
  const [materia, setMateria] = useState<Materia | null>(null);
  const [activeTab, setActiveTab] = useState('Estudiantes');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Cargar materia al inicio
  useEffect(() => {
    const materias = obtenerMaterias();
    const materiaEncontrada = materias.find((m) => m.id === id);
    if (!materiaEncontrada) {
      toast.error('Materia no encontrada');
      router.push('/');
    }
    setMateria(materiaEncontrada || null);
  }, [id, router]);

  // Función para añadir estudiante
  const agregarEstudiante = (nombre: string) => {
    if (!materia || !nombre.trim()) return;
    
    const nuevoEstudiante = {
      id: Date.now().toString(),
      nombre: nombre.trim(),
    };

    const updated = {
      ...materia,
      estudiantes: [...materia.estudiantes, nuevoEstudiante],
    };

    actualizarMateria(updated);
    toast.success(`Estudiante ${nombre.trim()} añadido`);
  };

  // Función para marcar/desmarcar asistencia
  const toggleAsistencia = (estudianteId: string) => {
    if (!materia) return;
    
    const hoy = new Date().toISOString().split('T')[0];
    const updatedAsistencias = [...materia.asistencias];
    const index = updatedAsistencias.findIndex(
      (a) => a.estudianteId === estudianteId && a.fecha === hoy
    );

    if (index >= 0) {
      updatedAsistencias[index].presente = !updatedAsistencias[index].presente;
    } else {
      updatedAsistencias.push({
        estudianteId,
        fecha: hoy,
        presente: true,
      });
    }

    const updated = { ...materia, asistencias: updatedAsistencias };
    actualizarMateria(updated);
  };

  // Función para guardar todas las asistencias
  const guardarAsistencias = () => {
    if (!materia) return;
    
    const hoy = new Date().toISOString().split('T')[0];
    let cambios = false;
    const updatedAsistencias = [...materia.asistencias];

    materia.estudiantes.forEach(estudiante => {
      const existe = updatedAsistencias.some(
        a => a.estudianteId === estudiante.id && a.fecha === hoy
      );
      
      if (!existe) {
        updatedAsistencias.push({
          estudianteId: estudiante.id,
          fecha: hoy,
          presente: false
        });
        cambios = true;
      }
    });

    if (cambios) {
      const updated = { ...materia, asistencias: updatedAsistencias };
      actualizarMateria(updated);
      toast.success('Asistencias guardadas correctamente');
    } else {
      toast('No hay cambios para guardar', { icon: 'ℹ️' });
    }
  };

  // Actualizar materia en estado y localStorage
  const actualizarMateria = (updated: Materia) => {
    const materias = obtenerMaterias().map((m) => 
      m.id === updated.id ? updated : m
    );
    guardarMaterias(materias);
    setMateria(updated);
  };

  if (!materia) {
    return (
      <div className="p-8 text-center">
        <p>Cargando materia...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen dark:bg-gray-900">
      <button 
        onClick={() => router.push('/')}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors dark:text-blue-400"
      >
        ← Volver al menú
      </button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          {materia.nombre}
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          + Añadir Estudiante
        </button>
      </div>

      <StatsDashboard materia={materia} />

      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === 'Estudiantes' && (
        <div className="bg-white rounded-xl shadow-sm p-6 dark:bg-gray-800">
          <AttendanceTable 
            materia={materia} 
            onToggleAttendance={toggleAsistencia} 
            onSaveAttendance={guardarAsistencias}
          />
        </div>
      )}

      {activeTab === 'Asistencias' && (
        <div className="bg-white rounded-xl shadow-sm p-6 dark:bg-gray-800">
          <AttendanceHistory materia={materia} />
        </div>
      )}

      {activeTab === 'Reportes' && (
        <div className="bg-white rounded-xl shadow-sm p-6 dark:bg-gray-800">
          <p className="text-gray-500 text-center py-12 dark:text-gray-400">
            Próximamente: Gráficos y reportes detallados
          </p>
        </div>
      )}

      <AddStudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={agregarEstudiante}
      />
    </div>
  );
}