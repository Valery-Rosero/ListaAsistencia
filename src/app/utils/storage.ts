import { Materia } from './types';

const MATERIAS_KEY = 'materiasData';

export const guardarMaterias = (materias: Materia[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MATERIAS_KEY, JSON.stringify(materias));
};

export const obtenerMaterias = (): Materia[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(MATERIAS_KEY);
  return data ? JSON.parse(data) : [];
};