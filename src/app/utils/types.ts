export type Estudiante = {
    id: string;
    nombre: string;
  };
  
  export type Asistencia = {
    estudianteId: string;
    fecha: string;  // Formato: 'YYYY-MM-DD'
    presente: boolean;
  };
  
  export type Materia = {
    id: string;
    nombre: string;
    estudiantes: Estudiante[];
    asistencias: Asistencia[];
  };