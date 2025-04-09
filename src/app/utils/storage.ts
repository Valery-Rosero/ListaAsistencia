import { Subject } from './types';

const SUBJECTS_KEY = 'subjectsData';

export const saveSubjects = (subjects: Subject[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SUBJECTS_KEY, JSON.stringify(subjects));
};

export const getSubjects = (): Subject[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(SUBJECTS_KEY);
  return data ? JSON.parse(data) : [];
};