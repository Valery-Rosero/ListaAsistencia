"use client";
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getSubjects, saveSubjects } from '../../utils/storage';
import { Subject } from '../../utils/types';
import AddStudentModal from '../../components/AddStudentModal';
import AttendanceTable from '../../components/AttendanceTable';
import AttendanceHistory from '../../components/AttendanceHistory';
import Tabs from '../../components/Tabs';
import { toast } from 'react-hot-toast';
import StatsDashboard from './../../components/StatsDashboard';

export default function SubjectPage() {
  const { id } = useParams();
  const router = useRouter();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [activeTab, setActiveTab] = useState('Students');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load subject on mount
  useEffect(() => {
    const subjects = getSubjects();
    const foundSubject = subjects.find((m) => m.id === id);
    if (!foundSubject) {
      toast.error('Subject not found');
      router.push('/');
    }
    setSubject(foundSubject || null);
  }, [id, router]);

  // Function to add student
  const addStudent = (name: string) => {
    if (!subject || !name.trim()) return;
    
    const newStudent = {
      id: Date.now().toString(),
      name: name.trim(),
    };

    const updated = {
      ...subject,
      students: [...subject.students, newStudent],
    };

    updateSubject(updated);
    toast.success(`Student ${name.trim()} added`);
  };

  // Function to toggle attendance
  const toggleAttendance = (studentId: string) => {
    if (!subject) return;
    
    const today = new Date().toISOString().split('T')[0];
    const updatedAttendances = [...subject.attendances];
    const index = updatedAttendances.findIndex(
      (a) => a.studentId === studentId && a.date === today
    );

    if (index >= 0) {
      updatedAttendances[index].present = !updatedAttendances[index].present;
    } else {
      updatedAttendances.push({
        studentId,
        date: today,
        present: true,
      });
    }

    const updated = { ...subject, attendances: updatedAttendances };
    updateSubject(updated);
  };

  // Function to save all attendances
  const saveAttendances = () => {
    if (!subject) return;
    
    const today = new Date().toISOString().split('T')[0];
    let changes = false;
    const updatedAttendances = [...subject.attendances];

    subject.students.forEach(student => {
      const exists = updatedAttendances.some(
        a => a.studentId === student.id && a.date === today
      );
      
      if (!exists) {
        updatedAttendances.push({
          studentId: student.id,
          date: today,
          present: false
        });
        changes = true;
      }
    });

    if (changes) {
      const updated = { ...subject, attendances: updatedAttendances };
      updateSubject(updated);
      toast.success('Attendances saved successfully');
    } else {
      toast('No changes to save', { icon: 'ℹ️' });
    }
  };

  // Update subject in state and localStorage
  const updateSubject = (updated: Subject) => {
    const subjects = getSubjects().map((m) => 
      m.id === updated.id ? updated : m
    );
    saveSubjects(subjects);
    setSubject(updated);
  };

  if (!subject) {
    return (
      <div className="p-8 text-center">
        <p>Loading subject...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen dark:bg-gray-900">
      <button 
        onClick={() => router.push('/')}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors dark:text-blue-400"
      >
        ← Back to menu
      </button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          {subject.name}
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          + Add Student
        </button>
      </div>

      <StatsDashboard subject={subject} />

      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === 'Students' && (
        <div className="bg-white rounded-xl shadow-sm p-6 dark:bg-gray-800">
          <AttendanceTable 
            subject={subject} 
            onToggleAttendance={toggleAttendance} 
            onSaveAttendance={saveAttendances}
          />
        </div>
      )}

      {activeTab === 'Attendance' && (
        <div className="bg-white rounded-xl shadow-sm p-6 dark:bg-gray-800">
          <AttendanceHistory subject={subject} />
        </div>
      )}

      {activeTab === 'Reports' && (
        <div className="bg-white rounded-xl shadow-sm p-6 dark:bg-gray-800">
          <p className="text-gray-500 text-center py-12 dark:text-gray-400">
            Coming soon: Detailed charts and reports
          </p>
        </div>
      )}

      <AddStudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addStudent}
      />
    </div>
  );
}